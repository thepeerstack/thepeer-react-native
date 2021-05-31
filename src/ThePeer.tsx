import React, { Component } from 'react';
import { View, Modal, Animated, StyleSheet } from 'react-native';
import Header from './components/Header';
import Footer from './components/Footer';
import PaneOne from './components/PaneOne';
import PaneTwo from './components/PaneTwo';
import PaneThree from './components/PaneThree';
import PaneFour from './components/PaneFour';
import Loader from './components/Loader';
import { resheight, reswidth } from './utils';
import axios from 'axios';
import SDKServices from './services/sdkServices';
import type { StateTypes, PropTypes, BusinessType } from './@types';
import { SUCCESS } from './constants';

const AnimView = Animated.View;

const runSpringAnim = ({
  ref,
  toValue,
}: {
  toValue: number;
  ref: Animated.Value;
}) =>
  Animated.spring(ref, {
    toValue,
    useNativeDriver: true,
  });

class Thepeer extends Component<PropTypes> {
  defaultState = {
    movePaneOne: new Animated.Value(1),
    movePaneTwo: new Animated.Value(0),
    movePaneThree: new Animated.Value(0),
    movePaneFour: new Animated.Value(0),
    step: 1,
    confirmingTransaction: false,
    senderBusiness: {
      logo: undefined,
      name: '',
      id: '',
      identifier_type: '',
    },
    receiverBusiness: {
      logo: undefined,
      name: '',
      id: '',
      identifier_type: '',
    },
    resolvedUser: {
      reference: '',
    },
    remark: '',
    identifier: '',
    eventType: '',
    senderUser: { name: '', hash: '' },
  };
  state: StateTypes = this.defaultState;

  checkProps = async () => {
    const { amount, userReference, publicKey, receiptUrl, onClose, onSuccess } =
      this.props;

    const validProps =
      amount &&
      !isNaN(+amount) &&
      typeof +amount === 'number' &&
      !!userReference &&
      !!publicKey &&
      !!receiptUrl &&
      onClose !== undefined &&
      onSuccess !== undefined;

    if (validProps) {
      axios.defaults.headers.common['x-api-key'] = publicKey;
      const res = await axios.all([
        SDKServices.getBusinessDetailService(),
        SDKServices.resolveUserByRefService(userReference),
      ]);
      if (res[0].status === 200 && res[1].status === 200) {
        this.setState((prev) => ({
          ...prev,
          senderBusiness: res[0].data.business,
          senderUser: res[1].data,
        }));
      }
    } else {
      console.error(
        "cannot initialize SDK, ensure you're passing the required props"
      );
    }
  };

  componentDidMount() {
    this.checkProps();
  }

  componentDidUpdate() {
    const { openThePeerSdk } = this.props;
    if (!this.state.senderBusiness.logo && this.props) this.checkProps();
    if (!openThePeerSdk) this.resetSDK();
  }

  resetSDK = () => {
    const { movePaneFour, movePaneTwo, movePaneOne, movePaneThree } =
      this.state;
    Animated.parallel([
      runSpringAnim({ ref: movePaneFour, toValue: 0 }),
      runSpringAnim({ ref: movePaneThree, toValue: 0 }),
      runSpringAnim({ ref: movePaneTwo, toValue: 0 }),
      runSpringAnim({ ref: movePaneOne, toValue: 1 }),
    ]).start();
  };

  resetState = () => {
    this.setState((prev) => ({
      ...prev,
      step: 1,
      receiverBusiness: {
        logo: undefined,
        name: '',
        id: '',
        identifier_type: '',
      },
      resolvedUser: {
        reference: '',
      },
      remark: '',
      identifier: '',
    }));
  };

  closeSDK = () => {
    this.props.onClose();
    this.resetState();
  };

  handleBackPress = () => {
    const { step, movePaneTwo, movePaneThree } = this.state;
    if (step === 2) {
      this.resetState();
      this.resetSDK();
    } else if (step === 3) {
      Animated.parallel([
        runSpringAnim({ ref: movePaneTwo, toValue: 1 }),
        runSpringAnim({ ref: movePaneThree, toValue: 0 }),
      ]).start();
    }
    this.setState((prev: StateTypes) => ({
      ...prev,
      step: prev.step > 1 ? prev.step - 1 : 1,
    }));
  };

  handleSelectedBusiness = (receiverBusiness: BusinessType) => {
    const { movePaneOne, movePaneTwo } = this.state;
    this.setState((prev) => ({ ...prev, receiverBusiness, step: 2 }));
    Animated.parallel([
      runSpringAnim({ ref: movePaneTwo, toValue: 1 }),
      runSpringAnim({ ref: movePaneOne, toValue: 0 }),
    ]).start();
  };

  onSendClick = () => {
    const { movePaneThree, movePaneTwo } = this.state;
    this.setState((prev) => ({ ...prev, step: 3 }));
    Animated.parallel([
      runSpringAnim({ ref: movePaneTwo, toValue: 2 }),
      runSpringAnim({ ref: movePaneThree, toValue: 1 }),
    ]).start();
  };

  showLastStep = () => {
    const { movePaneThree, movePaneFour } = this.state;
    this.setState((prev) => ({ ...prev, step: 4 }));
    Animated.parallel([
      runSpringAnim({ ref: movePaneFour, toValue: 1 }),
      runSpringAnim({ ref: movePaneThree, toValue: 2 }),
    ]).start();
  };

  onProceed = async () => {
    const { remark, resolvedUser } = this.state;
    const { amount, userReference, receiptUrl, onSuccess, openThePeerSdk } =
      this.props;

    this.setState((prev) => ({ ...prev, confirmingTransaction: true }));

    const payload = {
      amount,
      remark,
      to: resolvedUser.reference,
      from: userReference,
    };
    const res = await SDKServices.generateReceiptService(payload);
    if (res.status === 201) {
      axios({
        url: `${receiptUrl}?receipt=${res.data.receipt}`,
        method: 'get',
      })
        .then(({ data }) => {
          this.showLastStep();
          this.setState((prev) => ({
            ...prev,
            confirmingTransaction: false,
            eventType: data.event,
            seconds: 5,
          }));
          if (data.event === SUCCESS) {
            onSuccess(data.event);
            setTimeout(() => {
              openThePeerSdk && this.closeSDK();
            }, 5000);
          }
        })
        .catch((e) => {
          this.showLastStep();
          this.setState((prev) => ({
            ...prev,
            confirmingTransaction: false,
            seconds: 5,
            eventType: e?.response?.data?.event || 'send.error',
          }));
        });
    }
  };

  render() {
    const {
      step,
      movePaneOne,
      movePaneTwo,
      receiverBusiness,
      senderBusiness,
      resolvedUser,
      movePaneThree,
      movePaneFour,
      remark,
      identifier,
      confirmingTransaction,
      eventType,
      senderUser: { name },
    } = this.state;

    const { openThePeerSdk, amount, publicKey }: PropTypes = this.props;
    const isTest = publicKey.includes('test');

    const panes = [
      {
        ref: movePaneOne,
        id: 1,
        child: (
          <PaneOne
            {...{
              name,
              amount,
              handleSelectedBusiness: this.handleSelectedBusiness,
            }}
          />
        ),
      },
      {
        ref: movePaneTwo,
        id: 2,
        child: (
          <PaneTwo
            {...{
              step,
              receiverBusiness,
              el: this,
              onSendClick: this.onSendClick,
              remark,
              identifier,
              resolvedUser,
            }}
          />
        ),
      },
      {
        ref: movePaneThree,
        id: 3,
        child: (
          <PaneThree
            {...{
              receiverBusiness,
              senderBusiness,
              resolvedUser,
              handleBackPress: this.handleBackPress,
              onProceed: this.onProceed,
              amount,
              confirmingTransaction,
            }}
          />
        ),
      },
      {
        ref: movePaneFour,
        id: 4,
        child: (
          <PaneFour
            {...{
              identifier,
              step,
              eventType,
              receiverBusiness,
              amount,
              resetSDK: this.resetSDK,
            }}
          />
        ),
      },
    ];

    const getPosition = (id: number) => (step === id ? 'relative' : 'absolute');

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={openThePeerSdk}
        onRequestClose={this.closeSDK}
      >
        <View style={styles.container}>
          <View style={styles.mainView}>
            <Header
              {...{
                step,
                handleBackPress: this.handleBackPress,
                handleClose: this.closeSDK,
                isTest,
                confirmingTransaction,
              }}
            />
            {senderBusiness.logo ? (
              <View style={styles.panesCont}>
                {panes.map(({ id, ref, child }) => (
                  <AnimView
                    key={id}
                    style={[
                      styles.animView,
                      {
                        position: getPosition(id),
                        transform: [
                          {
                            translateX: ref.interpolate({
                              inputRange: [0, 1, 2],
                              outputRange: [
                                reswidth(id === 1 ? -100 : +100),
                                0,
                                reswidth(-100),
                              ],
                            }),
                          },
                          {
                            translateY: ref.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    {child}
                  </AnimView>
                ))}
              </View>
            ) : (
              <Loader />
            )}

            <Footer />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  animView: {
    flex: 1,
    width: '100%',
  },
  panesCont: {
    height: resheight(70),
    width: '100%',
    marginTop: 24,
    paddingHorizontal: reswidth(5.5),
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingTop: resheight(8),
  },
  mainView: {
    position: 'relative',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: resheight(92),
    backgroundColor: '#fff',
    overflow: 'hidden',
    paddingTop: resheight(6),
  },
});

export default Thepeer;

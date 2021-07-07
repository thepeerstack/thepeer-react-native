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
import { ERROR, SUCCESS } from './constants';

const AnimView = Animated.View;

const runSpringAnim = ({
  ref,
  toValue,
}: {
  toValue: number;
  ref: Animated.Value;
}) =>
  Animated.timing(ref, {
    toValue,
    useNativeDriver: true,
    duration: 200,
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
    const {
      amount,
      userReference,
      publicKey,
      receiptUrl,
      onClose,
      onSuccess,
      onError,
    } = this.props;

    const validProps =
      amount &&
      !isNaN(+amount) &&
      typeof +amount === 'number' &&
      +amount >= 100 &&
      !!userReference &&
      !!publicKey &&
      !!receiptUrl &&
      onClose !== undefined &&
      onError !== undefined &&
      onSuccess !== undefined;

    const isRequired = (name: string, isValid: boolean) => {
      if (isValid) return;
      console.error(`${name} is required`);
    };

    if (validProps) {
      axios.defaults.headers.common['x-api-key'] = publicKey;
      const res = await axios.all([
        SDKServices.getBusinessDetailService(),
        SDKServices.resolveUserByRefService(userReference),
      ]);
      if (res[0].status === 200 && res[1].status === 200) {
        if (res[1].data.name) {
          this.setState((prev) => ({
            ...prev,
            senderBusiness: res[0].data.business,
            senderUser: res[1].data,
          }));
        } else {
          console.error(res[1].data.message);
        }
      }
    } else {
      console.error(
        "cannot initialize SDK, ensure you're passing all the required props"
      );
      isRequired(
        'amount',
        !amount && isNaN(+amount) && typeof +amount !== 'number'
      );
      +amount < 100 && console.error('amount cannot be less than 100 kobo');
      isRequired('userReference', !!userReference);
      isRequired('publicKey', !!receiptUrl);
      isRequired('receiptUrl', !!receiptUrl);
      isRequired('onClose callback', onClose !== undefined);
      isRequired('onError callback', onError !== undefined);
      isRequired('onSuccess callback', onSuccess !== undefined);

    }
  };

  componentDidMount() {
    this.checkProps();
  }

  componentDidUpdate() {
    const { openThePeerSdk } = this.props;
    const { logo, id } = this.state.senderBusiness;
    if (!logo && !id && openThePeerSdk) this.checkProps();
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
    const {
      amount,
      userReference,
      receiptUrl,
      onSuccess,
      openThePeerSdk,
      onError,
    } = this.props;

    this.setState((prev) => ({ ...prev, confirmingTransaction: true }));

    const payload = {
      amount,
      remark,
      to: resolvedUser.reference,
      from: userReference,
    };
    const response = await SDKServices.generateReceiptService(payload);

    const handleError = (e: any) => {
      const validError =
        e && e.response && e.response.data && e.response.data.event;
      const eventType = validError ? e.response.data.event : ERROR;
      this.showLastStep();
      this.setState((prev) => ({
        ...prev,
        confirmingTransaction: false,
        eventType,
      }));
      onError(eventType);
    };
    if (response.status === 201 || response.status === 200) {
      const receipt = response.data.receipt;
      axios({
        url: receiptUrl,
        method: 'post',
        data: {
          receipt,
        },
      })
        .then(async (response2) => {
          if (response2.status === 200) {
            let tryCount = 1;

            const getEvent = async () => {
              const response3 = await SDKServices.getEventService(receipt);
              if (
                response3.status === 200 &&
                response3.data.event === 'unassigned' &&
                tryCount < 6
              ) {
                setTimeout(() => {
                  tryCount += 1;
                  getEvent();
                }, 10000);
              } else if (
                response3.status === 200 &&
                response3.data.event !== 'unassigned'
              ) {
                const event = response3.data.event;
                this.showLastStep();
                if (event === SUCCESS) {
                  onSuccess(event);
                  setTimeout(() => {
                    openThePeerSdk && this.closeSDK();
                  }, 5000);
                }
                this.setState((prev) => ({
                  ...prev,
                  confirmingTransaction: false,
                  eventType: event,
                  seconds: 5,
                }));
              } else {
                handleError(undefined);
              }
            };
            getEvent();
          }
        })
        .catch((e) => {
          handleError(e);
        });
    } else {
      handleError(undefined);
      console.error('Error: ', response.data.message);
    }
  };

  handleGoBack = () => {
    this.resetState();
    this.resetSDK();
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
              handleGoBack: this.handleGoBack,
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

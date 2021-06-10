import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import ThepeerColors from '../colors';
import { isIOS } from '../utils';
import ThePeerText from './ThePeerText';
import SDKServices from '../services/sdkServices';
import { debounce } from '../utils';
import { genericStyles } from '../genericStyles';
import type { PaneTwoPropType, StateTypes } from '../@types';

const AnimView = Animated.View;
const AnimInput = Animated.createAnimatedComponent(TextInput);
const limitText = (txt: string, length: number = 15) => {
  const txtLen = txt.length;
  if (txtLen < length) {
    return txt;
  } else {
    return txt.substring(0, length) + '...';
  }
};

const PaneTwo = ({
  receiverBusiness,
  el,
  onSendClick,
  remark,
  identifier,
  step,
}: PaneTwoPropType) => {
  const { logo, name, identifier_type, id } = receiverBusiness;
  const input1AnimRef = useRef(new Animated.Value(0)).current;
  const input2AnimRef = useRef(new Animated.Value(0)).current;
  const input2Ref = useRef<any>(null);
  const btnRef = useRef(new Animated.Value(0)).current;
  const [enableBtn, setEnableBtn] = useState<boolean>(false);
  const [identifierError, setIdentifierError] = useState<null | string>(null);
  const [errorResolving, setErrorResolving] = useState<null | string>(null);
  const [resolving, setResolving] = useState<boolean>(false);
  const { resolvedUser } = el.state;

  const animateInput = ({ ref, toValue }: { ref: any; toValue: number }) => {
    Animated.timing(ref, {
      toValue,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const getUser = async (userIdentifier: string) => {
    el.setState((prev: StateTypes) => ({ ...prev, resolvedUser: {} }));
    setResolving(true);
    setErrorResolving(null);
    const res = await SDKServices.resolveUserService({
      business_id: id,
      identifier: userIdentifier,
    });
    const { status, data } = res;
    if (status === 200) {
      setResolving(false);
      el.setState((prev: StateTypes) => ({
        ...prev,
        resolvedUser: { ...data, identifier: userIdentifier },
      }));
    } else {
      setResolving(false);
      setErrorResolving("Cannot resolve user's details");
    }
  };
  const handleInput = (text: string) => {
    el.setState((prev: StateTypes) => ({ ...prev, identifier: text.trim() }));
    if (receiverBusiness.identifier_type === 'username') {
      const strippedAt = text.includes('@') ? text.slice(1) : text;
      if (strippedAt.trim().length >= 3) {
        getUser(strippedAt);
      }
    } else {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const email = text.trim();
      const validEmail = re.test(email);
      if (validEmail) {
        setIdentifierError(null);
        getUser(email);
      } else {
        setIdentifierError('Enter a valid email address');
      }
    }
  };

  const handleSubmitEnd = () => onSendClick();

  useEffect(() => {
    const enable = !!identifier && !!remark && !errorResolving;
    Animated.timing(btnRef, {
      toValue: enable ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
    setEnableBtn(enable);
  }, [identifier, remark, errorResolving, btnRef]);

  const blurInput2 = useCallback(() => {
    animateInput({
      ref: input2AnimRef,
      toValue: !remark ? 0 : 2,
    });
  }, [input2AnimRef, remark]);

  const blurInput1 = useCallback(() => {
    identifierError || errorResolving
      ? null
      : animateInput({
          ref: input1AnimRef,
          toValue: !identifier ? 0 : 2,
        });
  }, [identifierError, errorResolving, input1AnimRef, identifier]);

  useEffect(() => {
    if (step === 2) {
      if (!identifier) blurInput1();
      if (!remark) blurInput2();
    }
    if (step === 1) {
      setErrorResolving(null);
      setIdentifierError(null);
      animateInput({
        ref: input1AnimRef,
        toValue: 0,
      });
    }
  }, [step, identifier, remark, blurInput2, blurInput1, input1AnimRef]);

  useEffect(() => {
    animateInput({
      ref: input1AnimRef,
      toValue:
        identifierError || errorResolving
          ? 3
          : !identifierError && !errorResolving && identifier
          ? 1
          : 0,
    });
  }, [identifierError, errorResolving, input1AnimRef, identifier]);

  return (
    <KeyboardAvoidingView
      behavior={isIOS ? 'padding' : 'height'}
      style={genericStyles.flex}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={[genericStyles.al_i_c, genericStyles.mb40]}>
            <ThePeerText text="Send money to" fontSize={14} />
            <View style={styles.businessCont}>
              <Image source={{ uri: logo }} style={styles.businessLogo} />
              <ThePeerText
                {...{
                  fontWeight: 'bold',
                  fontSize: 24,
                  color: ThepeerColors.blue2,
                  text: limitText(name),
                }}
              />
            </View>
          </View>
          <View style={styles.inputCont}>
            <AnimView
              pointerEvents="none"
              style={{
                ...styles.inputLabelCont,
                minWidth: input1AnimRef.interpolate({
                  inputRange: [0, 1, 1],
                  outputRange: ['70%', '20%', '20%'],
                }),
                paddingVertical: input1AnimRef.interpolate({
                  inputRange: [0, 1, 1],
                  outputRange: [10, 0, 0],
                }),
                transform: [
                  {
                    translateY: input1AnimRef.interpolate({
                      inputRange: [0, 1, 1],
                      outputRange: [20, 0, 0],
                    }),
                  },
                  {
                    translateX: input1AnimRef.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [0, 5, 5],
                    }),
                  },
                  {
                    scale: input1AnimRef.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [1, 0.9, 0.9],
                    }),
                  },
                ],
              }}
            >
              <ThePeerText
                text={`Enter ${identifier_type}`}
                fontSize={13}
                color={input1AnimRef.interpolate({
                  inputRange: [0, 1, 2, 3],
                  outputRange: [
                    ThepeerColors.blue2,
                    ThepeerColors.blue1,
                    ThepeerColors.blue2,
                    ThepeerColors.blue2,
                  ],
                })}
              />
            </AnimView>
            <AnimInput
              placeholder={
                identifier_type === 'email'
                  ? 'heimdall@asgard.com'
                  : '@valkyrie'
              }
              style={{
                ...styles.textInput,
                borderColor: input1AnimRef.interpolate({
                  inputRange: [0, 1, 2, 3, 4],
                  outputRange: [
                    ThepeerColors.inputBorder,
                    ThepeerColors.blue1,
                    ThepeerColors.inputBorder,
                    ThepeerColors.red2,
                    ThepeerColors.inputBorder,
                  ],
                }),
              }}
              autoCapitalize="none"
              autoCorrect={false}
              defaultValue={identifier}
              placeholderTextColor={ThepeerColors.blue2}
              onChangeText={debounce(handleInput, 800)}
              onFocus={() => {
                if (!identifierError || !errorResolving) {
                  animateInput({ ref: input1AnimRef, toValue: 1 });
                  blurInput2();
                }
              }}
              onBlur={blurInput1}
              onSubmitEditing={() => input2Ref.current?.focus()}
              returnKeyType="next"
            />

            <View
              style={[
                genericStyles.p_abs,
                genericStyles.p_abs_l_0,
                genericStyles.p_abs_neg_b24,
              ]}
            >
              {resolving ? (
                <ActivityIndicator size="small" color={ThepeerColors.blue2} />
              ) : errorResolving || identifierError ? (
                <ThePeerText
                  {...{
                    text: errorResolving
                      ? errorResolving
                      : identifierError
                      ? identifierError
                      : '',
                    color: ThepeerColors.red2,
                    fontSize: 12,
                  }}
                />
              ) : (
                <ThePeerText
                  {...{
                    text: resolvedUser?.name?.toUpperCase(),
                    color: ThepeerColors.blue2,
                    fontSize: 12,
                  }}
                />
              )}
            </View>
          </View>
          <View style={styles.inputCont}>
            <AnimView
              pointerEvents="none"
              style={{
                ...styles.inputLabelCont,
                minWidth: input2AnimRef.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: ['70%', '20%', '20%'],
                }),
                paddingVertical: input2AnimRef.interpolate({
                  inputRange: [0, 1, 1],
                  outputRange: [10, 0, 0],
                }),
                transform: [
                  {
                    translateY: input2AnimRef.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [20, 0, 0],
                    }),
                  },
                  {
                    translateX: input2AnimRef.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [0, 5, 5],
                    }),
                  },
                  {
                    scale: input2AnimRef.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [1, 0.9, 0.9],
                    }),
                  },
                ],
              }}
            >
              <ThePeerText
                text="What is this for"
                fontSize={13}
                color={input2AnimRef.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [
                    ThepeerColors.blue2,
                    ThepeerColors.blue1,
                    ThepeerColors.blue2,
                  ],
                })}
              />
            </AnimView>

            <AnimInput
              ref={input2Ref}
              placeholder="For asgardian ale"
              defaultValue={remark}
              style={{
                ...styles.textInput,
                borderColor: input2AnimRef.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [
                    ThepeerColors.inputBorder,
                    ThepeerColors.blue1,
                    ThepeerColors.inputBorder,
                  ],
                }),
              }}
              editable={!resolvedUser.reference ? false : true}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={ThepeerColors.blue2}
              onChangeText={(text) =>
                el.setState((prev: StateTypes) => ({
                  ...prev,
                  remark: text.trim(),
                }))
              }
              onFocus={() => {
                animateInput({ ref: input2AnimRef, toValue: 1 });
                if (!errorResolving && !identifierError) blurInput1();
              }}
              onBlur={blurInput2}
              onSubmitEditing={enableBtn ? handleSubmitEnd : () => {}}
              returnKeyType="send"
            />
          </View>
          <Pressable
            android_ripple={{ color: ThepeerColors.ripple }}
            style={({ pressed }) => [
              {
                opacity: pressed && isIOS ? 0.2 : 1,
                marginTop: 21,
              },
            ]}
            disabled={!enableBtn}
            onPress={!enableBtn ? () => {} : onSendClick}
          >
            <AnimView
              style={{
                ...styles.btn,
                backgroundColor: btnRef.interpolate({
                  inputRange: [0, 1],
                  outputRange: [ThepeerColors.disabled, ThepeerColors.blue1],
                }),
              }}
            >
              <ThePeerText
                {...{
                  text: 'Send',
                  fontSize: 14,
                  color: '#fff',
                  fontWeight: 'bold',
                }}
              />
            </AnimView>
          </Pressable>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: 50,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  inputCont: {
    position: 'relative',
    width: '100%',
    marginBottom: 35,
  },
  inputLabel: {
    paddingTop: 10,
  },
  inputLabelCont: {
    backgroundColor: ThepeerColors.inputBg,
    position: 'absolute',
    zIndex: 4,
    paddingLeft: 12,
    paddingRight: 18,
    left: 6,
  },
  textInput: {
    marginTop: 10,
    backgroundColor: ThepeerColors.inputBg,
    borderWidth: 1,
    borderRadius: 6,
    height: 60,
    paddingHorizontal: 18,
  },
  businessCont: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
});

export default PaneTwo;

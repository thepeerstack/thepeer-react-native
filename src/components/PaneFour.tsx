import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import ThepeerColors from '../colors';
import { currencyFormatter, isIOS } from '../utils';
import { genericStyles } from '../genericStyles';
import ThePeerText from './ThePeerText';
import type {
  PaneFourTextType,
  PaneFourImgsType,
  PaneFourPropType,
} from '../@types';
import {
  INSUFFICIENT_FUNDS,
  USER_INSUFFICIENT_FUNDS,
  SUCCESS,
  ERROR,
} from '../constants';

const headerTexts: PaneFourTextType = {
  [INSUFFICIENT_FUNDS]: 'Transaction error',
  [USER_INSUFFICIENT_FUNDS]: 'Transaction error',
  [SUCCESS]: 'Transaction Successful',
  [ERROR]: 'Something went wrong',
};
const imagesUri: PaneFourImgsType = {
  [INSUFFICIENT_FUNDS]: require('../assets/images/close-badge.png'),
  [USER_INSUFFICIENT_FUNDS]: require('../assets/images/close-badge.png'),
  [SUCCESS]: require('../assets/images/check-badge.png'),
  [ERROR]: require('../assets/images/warning.png'),
};

const PaneFour = ({
  receiverBusiness,
  step,
  eventType,
  amount,
  identifier,
  resetSDK,
}: PaneFourPropType) => {
  const texts: PaneFourTextType = {
    [INSUFFICIENT_FUNDS]:
      'Business partner does not have sufficient funds, please try  again later',
    [USER_INSUFFICIENT_FUNDS]:
      'You do not have sufficient funds, please top-up and try again',
    [ERROR]: 'Something went wrong with our server. Please check back later',
    [SUCCESS]: `You have successfully sent ${currencyFormatter(+amount)} to ${
      receiverBusiness.identifier_type === 'email' ? null : '@'
    }${identifier}`,
  };

  const [seconds, setSeconds] = useState<number>(5);

  useEffect(() => {
    if (seconds >= 0 && step === 4) {
      var timeLeft = seconds;
      var countdownTimer = setInterval(function () {
        if (timeLeft <= 0) {
          clearInterval(countdownTimer);
        }
        timeLeft -= 1;
        setSeconds(timeLeft < 0 ? 0 : timeLeft);
      }, 1000);
    }
    return () => {
      clearInterval(countdownTimer);
    };
  }, [seconds, step]);

  return (
    <ScrollView style={genericStyles.flex}>
      <View style={styles.imgCont}>
        <Image source={imagesUri[eventType]} style={styles.img} />
      </View>
      <View style={[genericStyles.mt40, genericStyles.al_i_c]}>
        <ThePeerText
          {...{
            fontWeight: 'bold',
            fontSize: 24,
            color: ThepeerColors.blue2,
            text: headerTexts[eventType],
          }}
        />
        <ThePeerText
          {...{
            fontSize: 14,
            text: texts[eventType],
            textAlign: 'center',
            marginTop: 10,
          }}
        />
        <View style={genericStyles.mt40}>
          {eventType === SUCCESS ? (
            <View
              style={[
                genericStyles.flexDir,
                genericStyles.j_c_c,
                genericStyles.al_i_c,
              ]}
            >
              <ThePeerText
                {...{
                  text: 'Closing in 00:',
                  textAlign: 'center',
                }}
              />
              <ThePeerText
                {...{
                  text: seconds < 10 ? `0${seconds}` : seconds,
                  textAlign: 'center',
                  color: ThepeerColors.blue1,
                }}
              />
            </View>
          ) : (
            <Pressable
              android_ripple={{ color: ThepeerColors.ripple }}
              style={({ pressed }) => [
                {
                  opacity: pressed && isIOS ? 0.2 : 1,
                  marginTop: 20,
                  alignSelf: 'center',
                },
              ]}
              onPress={resetSDK}
            >
              <ThePeerText
                {...{
                  text: 'Go back',
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: ThepeerColors.blue1,
                  textDecorationLine: 'underline',
                  textDecorationColor: ThepeerColors.blue1,
                }}
              />
            </Pressable>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: 50,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 56,
    width: '100%',
    backgroundColor: ThepeerColors.blue1,
  },
  businessCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
  },
  businessLogo: {
    width: 40,
  },
  backArrow: {
    width: 16,
    height: 16,
    marginHorizontal: 10,
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },
  img: {
    width: 80,
    height: 80,
  },
  imgCont: {
    marginTop: 64,
    alignItems: 'center',
  },
});

export default PaneFour;

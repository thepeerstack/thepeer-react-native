import React, { useEffect, useRef } from 'react';
import { View, Pressable, Image, StyleSheet, Animated } from 'react-native';
import ThePeerText from './ThePeerText';
import ThepeerColors from '../colors';
import { isIOS, reswidth } from '../utils';

const AnimView = Animated.View;
type HeaderTypes = {
  handleBackPress: any;
  handleClose: any;
  step: number;
  isTest: boolean;
  confirmingTransaction: boolean;
};

type animValuesType = {
  [key: number]: number;
  1: number;
  2: number;
  3: number;
  4: number;
};
const Header = ({
  handleBackPress,
  handleClose,
  step,
  isTest,
  confirmingTransaction,
}: HeaderTypes) => {
  const backBtnRef = useRef(new Animated.Value(0)).current;
  const closeBtnRef = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const backBtnValues: animValuesType = {
      1: 0,
      2: 1,
      3: 1,
      4: 0,
    };
    Animated.spring(backBtnRef, {
      toValue: backBtnValues[step],
      useNativeDriver: true,
    }).start();
  }, [step, backBtnRef]);
  return (
    <View style={styles.container}>
      <AnimView
        style={{
          opacity: backBtnRef.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
          transform: [
            {
              translateX: backBtnRef.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
        }}
      >
        <Pressable
          android_ripple={{ color: ThepeerColors.ripple }}
          style={({ pressed }) => [
            {
              opacity: isIOS && pressed ? 0.2 : 1,
              padding: 10,
              marginLeft: -10,
            },
          ]}
          onPress={handleBackPress}
          disabled={confirmingTransaction}
        >
          <Image
            source={require('../assets/images/back.png')}
            style={styles.backImg}
          />
        </Pressable>
      </AnimView>

      {isTest && (
        <View style={styles.testModeCont}>
          <ThePeerText
            {...{
              text: 'Test',
              color: ThepeerColors.red2,
              fontSize: 12,
              fontWeight: 'bold',
              paddingVertical: 7,
            }}
          />
        </View>
      )}
      <AnimView
        style={{
          opacity: closeBtnRef.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
          transform: [
            {
              translateX: closeBtnRef.interpolate({
                inputRange: [0, 1],
                outputRange: [+100, 0],
              }),
            },
          ],
        }}
      >
        <Pressable
          android_ripple={{ color: ThepeerColors.ripple }}
          style={({ pressed }) => [
            {
              opacity: isIOS && pressed ? 0.2 : 1,
              padding: 10,
              marginRight: -10,
            },
          ]}
          onPress={handleClose}
          disabled={confirmingTransaction}
        >
          <Image
            source={require('../assets/images/close.png')}
            style={styles.closeImg}
          />
        </Pressable>
      </AnimView>
    </View>
  );
};

const styles = StyleSheet.create({
  backImg: {
    width: 16,
    height: 16,
  },
  closeImg: {
    width: 14,
    height: 14,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: reswidth(5.5),
    backgroundColor: '#fff',
  },
  testModeCont: {
    backgroundColor: ThepeerColors.red1,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;

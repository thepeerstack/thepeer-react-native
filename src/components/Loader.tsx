import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import ThepeerColors from '../colors';
const Loader = () => {
  const view1Ref = useRef(new Animated.Value(0)).current;
  const view2Ref = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(900, [
      Animated.loop(
        Animated.timing(view1Ref, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ),
      Animated.loop(
        Animated.timing(view2Ref, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ),
    ]).start();
  }, [view1Ref, view2Ref]);

  return (
    <View style={styles.container}>
      {[view1Ref, view2Ref].map((ref, index) => (
        <Animated.View
          key={index}
          style={{
            ...styles.view1,
            opacity: ref.interpolate({
              inputRange: [0, 1],
              outputRange: [0.6, 0],
            }),
            transform: [
              {
                scale: ref.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1.5],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  view1: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: ThepeerColors.blue1,
    position: 'absolute',
    top: 120,
  },
});

export default Loader;

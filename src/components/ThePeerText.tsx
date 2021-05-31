import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { resfont } from '../utils';
import ThepeerColors from '../colors';

type TextTypes = {
  fontSize?: number;
  color?: string | any;
  text?: string | number;
};

const ThePeerText = ({
  color = ThepeerColors.lynch,
  text,
  fontSize = 16,
  ...rest
}: TextTypes) => {
  return (
    <Animated.Text
      style={{
        ...styles({ fontSize }).text,
        color,
        ...rest,
      }}
    >
      {text}
    </Animated.Text>
  );
};

const styles = ({ fontSize }: TextTypes) =>
  StyleSheet.create({
    text: {
      fontSize: resfont(fontSize ? fontSize : 16),
    },
  });

export default ThePeerText;

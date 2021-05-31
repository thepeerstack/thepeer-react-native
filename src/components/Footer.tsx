import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import ThePeerText from './ThePeerText';

const Footer = () => {
  return (
    <View style={styles.container}>
      <ThePeerText text="Powered by" {...{ fontSize: 12 }} />
      <Image
        source={require('../assets/images/thepeer.png')}
        style={styles.thepeer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  thepeer: {
    width: 70,
    height: 19,
    marginLeft: 2,
  },
});

export default Footer;

import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Loader = () => {
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator size="small" color="#0069ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: '100%',
  },
});

export default Loader;

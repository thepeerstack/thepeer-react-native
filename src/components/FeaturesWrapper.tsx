import React from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';
import type { FeaturesWrapperProps } from '../types';

const FeaturesWrapper = ({
  visible,
  onRequestClose,
  children,
}: FeaturesWrapperProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      {...{ visible, onRequestClose }}
    >
      <View style={styles.container}>
        <View style={styles.mainView}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 48 : 36,
    position: 'relative',
  },
  mainView: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
});

export default FeaturesWrapper;

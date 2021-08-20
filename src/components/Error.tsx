import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Platform,
  Pressable,
} from 'react-native';

const ErrorFallback = ({
  onClose,
  error,
}: {
  onClose: () => void;
  error: any;
}) => {
  console.error('error', error);
  return (
    <View style={styles.container}>
      <Pressable
        android_ripple={{ color: 'rgba(0,0,0,0.15)' }}
        style={({ pressed }: { pressed: boolean }) => [
          {
            opacity: Platform.OS === 'ios' && pressed ? 0.2 : 1,
            padding: 20,
            marginRight: -20,
            position: 'absolute',
            alignItems: 'flex-end',
            alignSelf: 'flex-end',
          },
        ]}
        onPress={onClose}
      >
        <Image
          source={require('../assets/close.png')}
          style={styles.closeImg}
        />
      </Pressable>
      <View style={styles.imgCont}>
        <Image
          source={require('../assets/warning.png')}
          style={styles.img}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.text}>Something went wrong. Try again</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#727EA3',
    fontWeight: '400',
    marginTop: 10,
  },
  closeImg: {
    width: 32,
    height: 32,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
  },
  img: {
    width: 80,
    height: 80,
  },
  imgCont: {
    marginTop: 100,
    alignItems: 'center',
  },
});

export default ErrorFallback;

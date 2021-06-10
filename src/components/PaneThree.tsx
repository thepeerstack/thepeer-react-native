import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import ThepeerColors from '../colors';
import { genericStyles } from '../genericStyles';
import { currencyFormatter, isIOS } from '../utils';
import ThePeerText from './ThePeerText';
import type { PaneThreePropType } from '../@types';

const PaneThree = ({
  receiverBusiness,
  onProceed,
  handleBackPress,
  senderBusiness,
  resolvedUser,
  amount,
  confirmingTransaction,
}: PaneThreePropType) => {
  const { name, logo, identifier_type } = receiverBusiness;
  return (
    <ScrollView style={genericStyles.flex}>
      <View style={[genericStyles.mt40, genericStyles.al_i_c]}>
        <View style={styles.businessCont}>
          <Image
            source={{ uri: senderBusiness.logo }}
            style={styles.businessLogo}
          />
          <Image
            source={require('../assets/images/back.png')}
            style={styles.backArrow}
          />
          <Image source={{ uri: logo }} style={styles.businessLogo} />
        </View>
        <ThePeerText
          {...{
            fontWeight: 'bold',
            fontSize: 24,
            color: ThepeerColors.blue2,
            text: 'Confirm Transaction',
            marginBottom: 10,
          }}
        />
        <ThePeerText
          {...{
            fontSize: 14,
            text: `You are about to send ${currencyFormatter(+amount)} to ${
              identifier_type === 'email' ? '' : '@'
            }${resolvedUser.identifier} on ${name}. Do you want to proceed?`,
            textAlign: 'center',
          }}
        />

        <Pressable
          android_ripple={{ color: ThepeerColors.ripple }}
          style={({ pressed }) => [
            {
              opacity: pressed && isIOS ? 0.2 : 1,
              backgroundColor: confirmingTransaction
                ? ThepeerColors.disabled
                : ThepeerColors.blue1,
              ...styles.btn,
            },
          ]}
          onPress={onProceed}
          disabled={confirmingTransaction}
        >
          {confirmingTransaction ? (
            <ActivityIndicator size="small" color={ThepeerColors.blue2} />
          ) : (
            <ThePeerText
              {...{
                text: 'Proceed',
                fontSize: 14,
                color: '#fff',
                fontWeight: 'bold',
              }}
            />
          )}
        </Pressable>
        <Pressable
          android_ripple={{ color: ThepeerColors.ripple }}
          style={({ pressed }) => [
            {
              opacity: pressed && isIOS ? 0.2 : 1,
              marginTop: 20,
              alignSelf: 'center',
            },
          ]}
          onPress={handleBackPress}
          disabled={confirmingTransaction}
        >
          <ThePeerText
            {...{
              text: 'Go back',
              fontSize: 14,
              fontWeight: 'bold',
            }}
          />
        </Pressable>
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
  },
  businessCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  businessLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
});

export default PaneThree;

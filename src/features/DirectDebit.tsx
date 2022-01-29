import React, { useEffect, useState } from 'react';
import { createUrl, isRequired, validateAmount } from '../utils';
import type { DirectDebitProps, GeneralProps } from '../@types';
import FeaturesWrapper from '../components/FeaturesWrapper';
import { WebView } from 'react-native-webview';
import {
  DIRECT_CHARGE_INSUFFICIENT_FUNDS,
  DIRECT_CHARGE_USER_INSUFFICIENT_FUNDS,
  DIRECT_CHARGE_SUCCESS,
  DIRECT_CHARGE_BUSINESS_DECLINE,
  DIRECT_CHARGE_USER_DECLINE,
  DIRECT_CHARGE_CLOSE,
} from '../constants';
import Loader from '../components/Loader';
import ErrorFallback from '../components/Error';

const DirectDebit = (props: GeneralProps & DirectDebitProps) => {
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const {
    amount,
    meta,
    userReference,
    publicKey,
    onClose,
    onSuccess,
    onError,
    openDirectChargeSDK,
    currency,
  } = props;

  const isValidAmount = validateAmount({ amount, currency });
  useEffect(() => {
    const checkProps = () => {
      let validProps =
        isValidAmount &&
        !!userReference &&
        !!publicKey &&
        onClose !== undefined &&
        onSuccess !== undefined &&
        onError !== undefined;

      if (meta) {
        if (typeof meta === 'object' && !(meta instanceof Array))
          validProps = true;
        else validProps = false;
      }

      if (validProps) {
        const configs = {
          amount,
          userReference,
          publicKey,
          sdkType: 'directCharge',
          meta,
          currency,
        };
        setSourceUrl(createUrl(configs));
      } else {
        console.error(
          "cannot initialize SDK, ensure you're passing all the required props"
        );
        isRequired('userReference', !!userReference);
        isRequired('publicKey', !!publicKey);
        isRequired('onClose callback', onClose !== undefined);
        isRequired('onError callback', onError !== undefined);
        isRequired('onSuccess callback', onSuccess !== undefined);
        meta &&
          typeof meta === 'object' &&
          meta instanceof Array &&
          console.error('meta must be an object');
      }
    };

    if (openDirectChargeSDK) {
      checkProps();
    }
  }, [
    amount,
    meta,
    userReference,
    publicKey,
    currency,
    onClose,
    onSuccess,
    onError,
    openDirectChargeSDK,
    isValidAmount,
  ]);

  const handleMessage = ({ nativeEvent: { data } }: any) => {
    const response = JSON.parse(data);
    switch (response.event) {
      case DIRECT_CHARGE_CLOSE:
        onClose(response);
        break;
      case DIRECT_CHARGE_SUCCESS:
        onSuccess(response);
        break;
      case DIRECT_CHARGE_INSUFFICIENT_FUNDS:
      case DIRECT_CHARGE_USER_INSUFFICIENT_FUNDS:
      case DIRECT_CHARGE_BUSINESS_DECLINE:
      case DIRECT_CHARGE_USER_DECLINE:
        onError(response);
        break;
    }
  };

  return (
    <FeaturesWrapper visible={openDirectChargeSDK} onRequestClose={onClose}>
      <WebView
        source={{ uri: sourceUrl }}
        onMessage={handleMessage}
        startInLoadingState={true}
        renderLoading={() => <Loader />}
        renderError={(error) => <ErrorFallback {...{ onClose, error }} />}
      />
    </FeaturesWrapper>
  );
};

export default DirectDebit;

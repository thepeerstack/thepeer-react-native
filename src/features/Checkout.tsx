import React, { useEffect, useState } from 'react';
import { createUrl, isRequired } from '../utils';
import type { GeneralProps, CheckoutProps } from '../@types';
import FeaturesWrapper from '../components/FeaturesWrapper';
import { WebView } from 'react-native-webview';
import {
  CHECKOUT_INSUFFICIENT_FUNDS,
  CHECKOUT_USER_INSUFFICIENT_FUNDS,
  CHECKOUT_SUCCESS,
  CHECKOUT_BUSINESS_DECLINE,
  CHECKOUT_USER_DECLINE,
  CHECKOUT_CLOSE,
} from '../constants';
import Loader from '../components/Loader';
import ErrorFallback from '../components/Error';

const Checkout = (props: GeneralProps & CheckoutProps) => {
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const {
    amount,
    meta,
    publicKey,
    onClose,
    onSuccess,
    onError,
    openCheckoutSDK,
    currency,
  } = props;
  useEffect(() => {
    const checkProps = () => {
      const validAmount =
        amount &&
        !isNaN(+amount) &&
        typeof +amount === 'number' &&
        +amount >= 10000;

      let validProps =
        validAmount &&
        !!openCheckoutSDK &&
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
          publicKey,
          sdkType: 'checkout',
          currency,
          meta,
        };
        setSourceUrl(createUrl(configs));
      } else {
        console.error(
          "cannot initialize SDK, ensure you're passing all the required props"
        );
        isRequired(
          'amount',
          !amount && isNaN(+amount) && typeof +amount !== 'number'
        );
        !validAmount && console.error('amount cannot be less than 100 NGN');
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

    if (openCheckoutSDK) {
      checkProps();
    }
  }, [
    amount,
    meta,
    publicKey,
    currency,
    onClose,
    onSuccess,
    onError,
    openCheckoutSDK,
  ]);

  const handleMessage = ({ nativeEvent: { data } }: any) => {
    const response = JSON.parse(data);
    switch (response.event) {
      case CHECKOUT_CLOSE:
        onClose(response);
        break;
      case CHECKOUT_SUCCESS:
        onSuccess(response);
        break;
      case CHECKOUT_INSUFFICIENT_FUNDS:
      case CHECKOUT_USER_INSUFFICIENT_FUNDS:
      case CHECKOUT_BUSINESS_DECLINE:
      case CHECKOUT_USER_DECLINE:
        onError(response);
        break;
    }
  };

  return (
    <FeaturesWrapper visible={openCheckoutSDK} onRequestClose={onClose}>
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

export default Checkout;

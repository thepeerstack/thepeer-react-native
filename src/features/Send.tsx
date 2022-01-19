import React, { useEffect, useState } from 'react';
import { createUrl, isRequired } from '../utils';
import type { GeneralProps, SendProps } from '../@types';
import FeaturesWrapper from '../components/FeaturesWrapper';
import { WebView } from 'react-native-webview';
import {
  SEND_CLOSE,
  SEND_INSUFFICIENT_FUNDS,
  SEND_USER_INSUFFICIENT_FUNDS,
  SEND_SUCCESS,
} from '../constants';
import Loader from '../components/Loader';
import ErrorFallback from '../components/Error';

const Send = (props: GeneralProps & SendProps) => {
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const {
    amount,
    meta,
    userReference,
    publicKey,
    onClose,
    onSuccess,
    onError,
    openSendSDK,
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
          sdkType: 'send',
          meta,
          currency,
        };
        setSourceUrl(createUrl(configs));
      } else {
        console.error(
          "cannot initialize SDK, ensure you're passing all the required props"
        );
        !validAmount && console.error('amount cannot be less than 100 NGN');
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
    if (openSendSDK) {
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
    openSendSDK,
  ]);

  const handleMessage = ({ nativeEvent: { data } }: any) => {
    const response = JSON.parse(data);
    switch (response.event) {
      case SEND_CLOSE:
        onClose();
        break;
      case SEND_SUCCESS:
        onSuccess(response);
        break;
      case SEND_INSUFFICIENT_FUNDS:
      case SEND_USER_INSUFFICIENT_FUNDS:
        onError(response);
        break;
    }
  };

  return (
    <FeaturesWrapper visible={openSendSDK} onRequestClose={onClose}>
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

export default Send;

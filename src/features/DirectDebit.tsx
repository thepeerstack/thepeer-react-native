import React, { useEffect, useState } from 'react';
import { createUrl, isRequired } from '../utils';
import type { DirectDebitProps } from '../@types';
import FeaturesWrapper from '../components/FeaturesWrapper';
import { WebView } from 'react-native-webview';
import {
  DIRECT_DEBIT_CLOSE,
  DIRECT_DEBIT_ERROR,
  DIRECT_DEBIT_SUCCESS,
} from '../constants';
import Loader from '../components/Loader';
import ErrorFallback from '../components/Error';

const DirectDebit = (props: DirectDebitProps) => {
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
  } = props;
  useEffect(() => {
    const checkProps = () => {
      let validProps =
        amount &&
        !isNaN(+amount) &&
        typeof +amount === 'number' &&
        +amount >= 100 &&
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
        +amount < 100 && console.error('amount cannot be less than 100 kobo');
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
    onClose,
    onSuccess,
    onError,
    openDirectChargeSDK,
  ]);

  const handleMessage = ({ nativeEvent: { data } }: any) => {
    console.log('handleMessage -> data', data);
    const response = JSON.parse(data);
    switch (response.event) {
      case DIRECT_DEBIT_CLOSE:
        onClose();
        break;
      case DIRECT_DEBIT_SUCCESS:
        onSuccess(response);
        onClose();
        break;
      case DIRECT_DEBIT_ERROR:
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

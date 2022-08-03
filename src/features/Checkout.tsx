import React from 'react';
import { createUrl } from '../utils';
import type { GeneralProps, CheckoutProps } from '../types';
import FeaturesWrapper from '../components/FeaturesWrapper';
import { CHECKOUT_SUCCESS, CHECKOUT_CLOSE } from '../variables';
import WebViewWrapper from '../components/WebViewWrapper';

const Checkout = (props: GeneralProps & CheckoutProps) => {
  const { onClose, onSuccess, onError, openCheckoutSDK } = props;
  const handleMessage = ({ nativeEvent: { data } }: any) => {
    const response = JSON.parse(data);
    switch (response.event) {
      case CHECKOUT_CLOSE:
        onClose(response);
        break;
      case CHECKOUT_SUCCESS:
        onSuccess(response);
        break;
      default:
        onError(response);
        break;
    }
  };

  const sourceUrl = createUrl({ ...props, sdkType: 'checkout' });
  return (
    <FeaturesWrapper visible={openCheckoutSDK} onRequestClose={onClose}>
      <WebViewWrapper
        {...{
          source: { uri: sourceUrl },
          onMessage: handleMessage,
          onClose,
        }}
      />
    </FeaturesWrapper>
  );
};

export default Checkout;

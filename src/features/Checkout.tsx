import React from 'react';
import { closeResponse, createUrl, handleMessage } from '../utils';
import type { CheckoutProps, DispatchedMessage } from '../types';
import FeaturesWrapper from '../components/FeaturesWrapper';
import WebViewWrapper from '../components/WebViewWrapper';

const Checkout = (props: CheckoutProps) => {
  const { onClose, onSuccess, onError, openCheckoutSDK } = props;
  const sdkType = 'checkout';

  const onMessage = ({ nativeEvent: { data } }: DispatchedMessage) =>
    handleMessage({ onClose, onSuccess, onError, data });

  const sourceUrl = createUrl({
    ...props,
    sdkType,
    userReference: undefined,
  });
  return (
    <FeaturesWrapper
      visible={openCheckoutSDK}
      onRequestClose={() => onClose(closeResponse[sdkType])}
    >
      <WebViewWrapper
        {...{
          sdkType,
          source: { uri: sourceUrl },
          onMessage,
          onClose,
        }}
      />
    </FeaturesWrapper>
  );
};

export default Checkout;

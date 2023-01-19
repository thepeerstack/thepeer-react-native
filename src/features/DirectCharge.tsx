import React from 'react';
import { createUrl, handleMessage } from '../utils';
import type { DirectDebitProps, DispatchedMessage } from '../types';
import FeaturesWrapper from '../components/FeaturesWrapper';
import WebViewWrapper from '../components/WebViewWrapper';

const DirectCharge = (props: DirectDebitProps) => {
  const { onClose, onSuccess, onError, openDirectChargeSDK } = props;
  const sdkType = 'directCharge';

  const onMessage = ({ nativeEvent: { data } }: DispatchedMessage) =>
    handleMessage({ onClose, onSuccess, onError, data });

  const sourceUrl = createUrl({ ...props, sdkType });

  return (
    <FeaturesWrapper visible={openDirectChargeSDK} onRequestClose={onClose}>
      <WebViewWrapper
        {...{
          source: { uri: sourceUrl },
          onMessage,
          onClose,
        }}
      />
    </FeaturesWrapper>
  );
};

export default DirectCharge;

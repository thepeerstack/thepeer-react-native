import React from 'react';
import type { DispatchedMessage, SendProps } from '../types';
import { closeResponse, createUrl, handleMessage } from '../utils';
import FeaturesWrapper from '../components/FeaturesWrapper';
import WebViewWrapper from '../components/WebViewWrapper';

const Send = (props: SendProps) => {
  const { onClose, onSuccess, onError, openSendSDK } = props;
  const sdkType = 'send';
  const onMessage = ({ nativeEvent: { data } }: DispatchedMessage) =>
    handleMessage({ onClose, onSuccess, onError, data });

  const sourceUrl = createUrl({ ...props, sdkType });

  return (
    <FeaturesWrapper
      visible={openSendSDK}
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

export default Send;

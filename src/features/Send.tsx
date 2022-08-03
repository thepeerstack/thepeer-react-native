import React from 'react';
import type { GeneralProps, SendProps } from '../types';
import { createUrl } from '../utils';
import FeaturesWrapper from '../components/FeaturesWrapper';
import { SEND_CLOSE, SEND_SUCCESS } from '../variables';
import WebViewWrapper from '../components/WebViewWrapper';

const Send = (props: GeneralProps & SendProps) => {
  const { onClose, onSuccess, onError, openSendSDK } = props;
  const handleMessage = ({ nativeEvent: { data } }: any) => {
    const response = JSON.parse(data);
    switch (response.event) {
      case SEND_CLOSE:
        onClose();
        break;
      case SEND_SUCCESS:
        onSuccess(response);
        break;
      default:
        onError(response);
        break;
    }
  };

  const sourceUrl = createUrl({ ...props, sdkType: 'send' });

  return (
    <FeaturesWrapper visible={openSendSDK} onRequestClose={onClose}>
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

export default Send;

import React from 'react';
import { createUrl } from 'utils';
import type { DirectDebitProps, GeneralProps } from 'types';
import FeaturesWrapper from 'components/FeaturesWrapper';
import { DIRECT_CHARGE_SUCCESS, DIRECT_CHARGE_CLOSE } from 'variables';
import WebViewWrapper from 'components/WebViewWrapper';

const DirectCharge = (props: GeneralProps & DirectDebitProps) => {
  const { onClose, onSuccess, onError, openDirectChargeSDK } = props;

  const handleMessage = ({ nativeEvent: { data } }: any) => {
    const response = JSON.parse(data);
    switch (response.event) {
      case DIRECT_CHARGE_CLOSE:
        onClose(response);
        break;
      case DIRECT_CHARGE_SUCCESS:
        onSuccess(response);
        break;
      default:
        onError(response);
        break;
    }
  };

  const sourceUrl = createUrl({ ...props, sdkType: 'directCharge' });

  return (
    <FeaturesWrapper visible={openDirectChargeSDK} onRequestClose={onClose}>
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

export default DirectCharge;

import React from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import Loader from './Loader';
import ErrorFallback from './Error';
import type { EventResponse } from 'types';

type WebViewProps = {
  onClose: (response?: EventResponse) => void;
  source: { uri: string };
  onMessage: ((event: WebViewMessageEvent) => void) &
    (({ nativeEvent: { data } }: any) => void);
};

const WebViewWrapper = ({ source, onMessage, onClose }: WebViewProps) => (
  <WebView
    {...{
      source,
      onMessage,
      startInLoadingState: true,
      renderLoading: () => <Loader />,
      renderError: (error) => <ErrorFallback {...{ onClose, error }} />,
    }}
  />
);

export default WebViewWrapper;

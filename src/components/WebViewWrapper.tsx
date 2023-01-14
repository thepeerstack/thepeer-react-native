import React from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import Loader from './Loader';
import ErrorFallback from './Error';
import type { EventResponse } from '../types';
import { Alert, Linking } from 'react-native';

type WebViewProps = {
  onClose: (response?: EventResponse) => void;
  source: { uri: string };
  onMessage: ((event: WebViewMessageEvent) => void) &
    (({ nativeEvent: { data } }: any) => void);
};

const WebViewWrapper = ({ source, onMessage, onClose }: WebViewProps) => {
  const onShouldStartLoadWithRequest = ({ url }: { url: string }) => {
    const isExternal = url.includes('legal/end-user-agreement');
    if (!url) return false;
    if (isExternal) {
      Linking.canOpenURL(url).then((supported) => {
        if (!supported) {
          Alert.alert(
            'Cannot open link at the moment. Please try again later.'
          );
          return false;
        }

        Linking.openURL(url).then((res) => res);
        return false;
      });
      return false;
    }
    return true;
  };

  return (
    <WebView
      {...{
        source,
        onMessage,
        startInLoadingState: true,
        renderLoading: () => <Loader />,
        onShouldStartLoadWithRequest,
        renderError: (error) => <ErrorFallback {...{ onClose, error }} />,
      }}
    />
  );
};

export default WebViewWrapper;

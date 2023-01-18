import React from 'react';
import { WebView } from 'react-native-webview';
import Loader from './Loader';
import ErrorFallback from './Error';
import type { WebViewProps } from '../types';
import { Alert, Linking } from 'react-native';

const WebViewWrapper = ({
  source,
  onMessage,
  onClose,
  sdkType,
}: WebViewProps) => {
  const onShouldStartLoadWithRequest = ({ url }: { url: string }) => {
    if (!url) return false;
    const isMain = url.includes('https://chain.thepeer.co');
    if (isMain) return true;

    Linking.canOpenURL(url).then((supported) => {
      !supported
        ? Alert.alert('Cannot open link at the moment. Please try again later.')
        : Linking.openURL(url).then((res) => res);
    });
    return false;
  };

  return (
    <WebView
      {...{
        source,
        onMessage,
        startInLoadingState: true,
        renderLoading: () => <Loader />,
        onShouldStartLoadWithRequest,
        renderError: (error) => (
          <ErrorFallback {...{ onClose, error, sdkType }} />
        ),
      }}
    />
  );
};

export default WebViewWrapper;

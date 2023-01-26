import React from 'react';
import { WebView } from 'react-native-webview';
import Loader from './Loader';
import ErrorFallback from './Error';
import type { WebViewProps } from '../types';
import { Alert, Linking, StatusBar } from 'react-native';
import { BASE_URL } from '../variables';

const WebViewWrapper = ({ source, onMessage, onClose }: WebViewProps) => {
  const onShouldStartLoadWithRequest = ({ url }: { url: string }) => {
    if (!url) return false;
    const isMain = url.includes(BASE_URL);
    if (isMain) return true;

    Linking.canOpenURL(url).then((supported) => {
      !supported
        ? Alert.alert('Cannot open link at the moment. Please try again later.')
        : Linking.openURL(url).then((res) => res);
    });
    return false;
  };

  const onError = (e: any) => {
    console.error(e);
  };

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor="#ffffff"
        barStyle="dark-content"
        hidden={false}
      />
      <WebView
        {...{
          onError,
          source,
          onMessage,
          startInLoadingState: true,
          renderLoading: () => <Loader />,
          onShouldStartLoadWithRequest,
          renderError: (error) => <ErrorFallback {...{ onClose, error }} />,
          cacheEnabled: false,
          cacheMode: 'LOAD_NO_CACHE',
        }}
      />
    </>
  );
};

export default WebViewWrapper;

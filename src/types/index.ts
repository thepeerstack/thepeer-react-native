import type { WebViewMessageEvent } from 'react-native-webview';

export interface FeaturesWrapperProps {
  visible: boolean;
  onRequestClose: () => void;
  children: any;
}

export interface MetaProps {
  [key: string]: any;
}

export type EventResponse = {
  type: string;
  event: string;
  data: Object;
};

export type Callback = (response: EventResponse) => void;

export interface GeneralProps
  extends Record<
    string,
    string | number | MetaProps | Callback | boolean | undefined
  > {
  publicKey: string;
  amount: string | number;
  meta?: MetaProps;
  currency?: string;
  sdkType: string;
  onSuccess: Callback;
  onError: Callback;
  onClose: Callback;
  userReference?: string;
}

export interface DirectDebitProps extends GeneralProps {
  openDirectChargeSDK: boolean;
}

export interface SendProps extends GeneralProps {
  openSendSDK: boolean;
}

export interface CheckoutProps extends GeneralProps {
  openCheckoutSDK: boolean;
  email: string;
}

export type WebViewProps = {
  onClose: (response: EventResponse) => void;
  source: { uri: string };
  sdkType: string;
  onMessage: ((event: WebViewMessageEvent) => void) &
    ((prop: DispatchedMessage) => void);
};

export type DispatchedMessage = {
  nativeEvent: {
    data: string;
  };
};

export type HandleMessage = {
  data: string;
  onSuccess: Callback;
  onError: Callback;
  onClose: Callback;
};

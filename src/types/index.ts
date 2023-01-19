import type { WebViewMessageEvent } from 'react-native-webview';

export type VoidFunc = () => void;
export interface FeaturesWrapperProps {
  visible: boolean;
  onRequestClose: VoidFunc;
  children: JSX.Element;
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

interface OmittedSDKType
  extends Record<
    string,
    string | number | MetaProps | Callback | boolean | undefined
  > {
  publicKey: string;
  amount: string | number;
  meta?: MetaProps;
  currency?: string;
  onSuccess: Callback;
  onError: Callback;
  onClose: VoidFunc;
  userReference?: string;
}

export interface GeneralProps extends OmittedSDKType {
  sdkType: string;
}

export interface DirectDebitProps extends OmittedSDKType {
  openDirectChargeSDK: boolean;
}

export interface SendProps extends OmittedSDKType {
  openSendSDK: boolean;
}

export interface CheckoutProps extends OmittedSDKType {
  openCheckoutSDK: boolean;
  email: string;
}

export type WebViewProps = {
  onClose: VoidFunc;
  source: { uri: string };
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
  onClose: VoidFunc;
};

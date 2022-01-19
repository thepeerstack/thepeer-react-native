export interface FeaturesWrapperProps {
  visible: boolean;
  onRequestClose: () => void;
  children: any;
}

export interface MetaProps {
  [key: string]: any;
}

type EventResponse = {
  type: string;
  data: undefined | Object;
};
export interface GeneralProps {
  publicKey: string;
  amount: string | number;
  meta?: MetaProps;
  currency?: string;
  onSuccess: (response: EventResponse) => void;
  onError: (response: EventResponse) => void;
  onClose: (response?: EventResponse) => void;
}

export interface DirectDebitProps {
  openDirectChargeSDK: boolean;
  userReference: string;
}

export interface SendProps {
  openSendSDK: boolean;
  userReference: string;
}

export interface CheckoutProps {
  openCheckoutSDK: boolean;
}

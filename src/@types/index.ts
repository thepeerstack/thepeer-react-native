export type FeaturesWrapperProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: any;
};

export type MetaProps = {
  [key: string]: any;
};

export type DirectDebitProps = {
  publicKey: string;
  userReference: string;
  receiptUrl: string;
  amount: string | number;
  onError: (event: string) => void;
  onSuccess: (event: string) => void;
  onClose: () => void;
  openDirectChargeSDK: boolean;
  meta?: MetaProps;
};

export type SendProps = {
  publicKey: string;
  userReference: string;
  receiptUrl: string;
  amount: string | number;
  onSuccess: (event: string) => void;
  onError: (event: string) => void;
  onClose: () => void;
  openSendSDK: boolean;
  meta?: MetaProps;
};

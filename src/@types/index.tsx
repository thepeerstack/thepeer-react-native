import {
  INSUFFICIENT_FUNDS,
  USER_INSUFFICIENT_FUNDS,
  SUCCESS,
  ERROR,
} from '../constants';

export type onPressType = () => void;

export type BusinessType = {
  identifier_type: string;
  logo: string | undefined;
  id: string;
  name: string;
};

//  leave as any or find their right type, not altering these methods in anyway... so any would suffice
export type animatedPropsType = {
  interpolate: any;
  extractOffset: any;
  flattenOffset: any;
  setOffset: any;
  setValue: any;
  addListener: any;
  removeListener: any;
  removeAllListeners: any;
  stopAnimation: any;
  hasListeners: any;
};

export type StateTypes = {
  movePaneOne: animatedPropsType;
  movePaneTwo: animatedPropsType;
  movePaneThree: animatedPropsType;
  movePaneFour: animatedPropsType;
  step: number;
  remark: string;
  identifier: string;
  eventType: string;
  confirmingTransaction: boolean;
  senderBusiness: BusinessType;
  receiverBusiness: BusinessType;
  resolvedUser: { reference?: string; identifier?: string };
  senderUser: { name: string; hash: string };
};

export type PropTypes = {
  publicKey: string;
  userReference: string;
  receiptUrl: string;
  amount: string | number;
  onSuccess: (event: string) => void;
  onClose: () => void;
  openThePeerSdk: boolean;
};

export type PaneOnePropType = {
  name: string;
  amount: string | number;
  handleSelectedBusiness: (business: BusinessType) => void;
};

export type PaneTwoPropType = {
  receiverBusiness: BusinessType;
  el: any;
  onSendClick: onPressType;
  step: number;
  identifier: string;
  remark: string;
};

export type PaneThreePropType = {
  receiverBusiness: BusinessType;
  senderBusiness: BusinessType;
  resolvedUser: { identifier?: string; reference?: string };
  onProceed: () => Promise<any>;
  handleBackPress: () => void;
  amount: string | number;
  confirmingTransaction: boolean;
};

export type PaneFourTextType = {
  [key: string]: string;
  [INSUFFICIENT_FUNDS]: string;
  [USER_INSUFFICIENT_FUNDS]: string;
  [SUCCESS]: string;
  [ERROR]: string;
};

export type PaneFourImgsType = {
  [key: string]: any;
  [INSUFFICIENT_FUNDS]: any;
  [USER_INSUFFICIENT_FUNDS]: any;
  [SUCCESS]: any;
  [ERROR]: any;
};

export type PaneFourPropType = {
  receiverBusiness: BusinessType;
  step: number;
  amount: number | string;
  eventType: string;
  identifier: string;
  resetSDK: () => void;
};

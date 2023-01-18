import type { EventResponse, GeneralProps, HandleMessage } from '../types';
import {
  CHECKOUT_CLOSE,
  CHECKOUT_SUCCESS,
  DIRECT_CHARGE_CLOSE,
  DIRECT_CHARGE_SUCCESS,
  SEND_CLOSE,
  SEND_SUCCESS,
} from '../variables';

const isRequired = (prop: string, isValid: boolean): void => {
  if (isValid) return;
  throw new Error(`${prop} is required`);
};

const validateAmount = ({
  amount,
  currency,
}: {
  amount: string | number;
  currency: string;
}): void => {
  if (!amount) return isRequired('amount', false);

  const amt = +amount;
  if (!isNaN(amt)) {
    if (currency === 'NGN' && amt < 10000) {
      throw new Error('amount cannot be less than ₦100');
    } else if (currency === 'USD' && amt < 500) {
      throw new Error('amount cannot be less than $5');
    }
  } else {
    throw new Error('amount must be a number');
  }
};

const validateConfig = (config: any): boolean => {
  const {
    amount,
    meta,
    userReference,
    publicKey,
    onClose,
    onSuccess,
    onError,
    currency,
    sdkType,
    email,
  } = config;

  isRequired('publicKey', !!publicKey);
  isRequired('onClose callback', onClose !== undefined);
  isRequired('onError callback', onError !== undefined);
  isRequired('onSuccess callback', onSuccess !== undefined);
  validateAmount({ amount, currency: currency || 'NGN' });

  sdkType === 'checkout'
    ? isRequired('email', !!email)
    : isRequired('userReference', !!userReference);

  if (meta && !(typeof meta === 'object' && !(meta instanceof Array))) {
    throw new Error('meta must be an object');
  }

  return true;
};

const createUrl = (config: GeneralProps): string => {
  const configValid = validateConfig(config);
  let base = 'https://chain.thepeer.co?';
  if (!configValid) return base;
  Object.keys(config).map((key) => {
    const val = config[key];

    if (val) {
      const _val = key === 'meta' ? JSON.stringify(val) : val;
      base = base.concat(`${key}=${_val}&`);
    }
  });
  return base.slice(0, -1);
};

const handleMessage = ({
  data,
  onClose,
  onSuccess,
  onError,
}: HandleMessage) => {
  const response = JSON.parse(data);
  switch (response.event) {
    case SEND_CLOSE:
    case DIRECT_CHARGE_CLOSE:
    case CHECKOUT_CLOSE:
      onClose(response);
      break;
    case SEND_SUCCESS:
    case DIRECT_CHARGE_SUCCESS:
    case CHECKOUT_SUCCESS:
      onSuccess(response);
      break;
    default:
      onError(response);
      break;
  }
};

const closeResponse: {
  [key: string]: EventResponse;
} = {
  checkout: { type: CHECKOUT_CLOSE, event: CHECKOUT_CLOSE, data: {} },
  directCharge: {
    type: DIRECT_CHARGE_CLOSE,
    event: DIRECT_CHARGE_CLOSE,
    data: {},
  },
  send: { type: SEND_CLOSE, event: SEND_CLOSE, data: {} },
};

export { isRequired, createUrl, handleMessage, closeResponse };

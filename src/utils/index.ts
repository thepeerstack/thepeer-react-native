import type { GeneralProps, HandleMessage } from '../types';
import {
  BASE_URL,
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

const validateConfig = (config: any): boolean => {
  const { onClose, onSuccess, onError } = config;
  isRequired('onClose callback', onClose !== undefined);
  isRequired('onError callback', onError !== undefined);
  isRequired('onSuccess callback', onSuccess !== undefined);
  return true;
};

const createUrl = (config: GeneralProps): string => {
  const configValid = validateConfig(config);
  let base = BASE_URL + '?';
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
      onClose();
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

export { createUrl, handleMessage };

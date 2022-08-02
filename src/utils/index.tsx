const isRequired = (prop: string, isValid: boolean) => {
  if (isValid) return;
  throw new Error(`${prop} is required`);
};

const validateAmount = ({
  amount,
  currency,
}: {
  amount: string | number;
  currency: string;
}) => {
  if (!amount) return isRequired('amount', false);
  if (!isNaN(+amount) && typeof +amount === 'number') {
    if (currency === 'NGN' && +amount < 10000) {
      throw new Error('amount cannot be less than ₦100');
    } else if (currency === 'USD' && +amount < 500) {
      throw new Error('amount cannot be less than $5');
    }
  } else {
    throw new Error('amount must be a number');
  }
};

const validateConfig = (config: any) => {
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

  if (sdkType === 'checkout') {
    isRequired('email', !!email);
  } else {
    isRequired('userReference', !!userReference);
  }
  if (meta && !(typeof meta === 'object' && !(meta instanceof Array))) {
    throw new Error('meta must be an object');
  }

  return true;
};

const createUrl = (config: any) => {
  const configValid = validateConfig(config);
  let base = 'https://chain.thepeer.co?';
  if (!configValid) return base;

  Object.keys(config).map((k) => {
    if (config[k]) {
      const val = k === 'meta' ? JSON.stringify(config[k]) : config[k];
      base = base.concat(`${k}=${val}&`);
    }
  });
  return base.slice(0, -1);
};

export { isRequired, createUrl };

const isRequired = (name: string, isValid: boolean) => {
  if (isValid) return;
  console.error(`${name} is required`);
};

const validateAmount = ({
  amount,
  currency,
}: {
  amount: string | number;
  currency: string | undefined;
}) => {
  if (!amount) return isRequired('amount', false);
  if (!isNaN(+amount) && typeof +amount === 'number') {
    if (currency === 'NGN' && +amount < 10000) {
      throw new Error('amount cannot be less than ₦100');
    } else if (currency === 'USD' && +amount < 1000) {
      throw new Error('amount cannot be less than $10');
    }
  } else {
    throw new Error('amount must be a number');
  }
  return true;
};

const createUrl = (params: any) => {
  let base = 'https://chain.thepeer.co?';
  Object.keys(params).map((k) => {
    if (params[k]) {
      const value = k === 'meta' ? JSON.stringify(params[k]) : params[k];
      base = base.concat(`${k}=${value}&`);
    }
  });
  return base.slice(0, -1);
};

export { isRequired, createUrl, validateAmount };

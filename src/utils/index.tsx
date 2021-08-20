const isRequired = (name: string, isValid: boolean) => {
  if (isValid) return;
  console.error(`${name} is required`);
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

export { isRequired, createUrl };

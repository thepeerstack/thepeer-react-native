// @ts-ignore
import { postFunc, getFunc } from './httpService';

const SDKServices = {
  getBusinessesService: () => getFunc('businesses'),
  getBusinessDetailService: () => getFunc('business'),
  resolveUserService: ({
    business_id,
    identifier,
  }: {
    business_id: string;
    identifier: string;
  }) => getFunc(`resolve?business_id=${business_id}&identifier=${identifier}`),
  resolveUserByRefService: (userReference: string) =>
    getFunc(`resolve/reference?reference=${userReference}`),
  generateReceiptService: (payload: any) => postFunc('receipt', payload),
};

export default SDKServices;

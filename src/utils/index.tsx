import { Platform, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const getFont = (fontSize: number) => {
  const standardScreenHeight = 680;
  const heightPercent = (fontSize * height) / standardScreenHeight;
  return Math.round(heightPercent);
};
const resfont = (val: number) => getFont(val);
const resheight = (val: number) => height * (+val / 100);
const reswidth = (val: number) => width * (+val / 100);

const currencyFormatter = (amt: number | string) => {
  return `₦${(+amt / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

const debounce = (func: Function, wait: number) => {
  let timeout: any;
  return function executedFunction(...args: any) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
export { resheight, resfont, reswidth, isIOS, currencyFormatter, debounce };

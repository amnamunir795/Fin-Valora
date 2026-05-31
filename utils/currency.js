// Currency symbols mapping for Asian currencies
export const currencySymbols = {
  INR: '₹',
  CNY: '¥',
  JPY: '¥',
  KRW: '₩',
  SGD: 'S$',
  HKD: 'HK$',
  THB: '฿',
  MYR: 'RM',
  IDR: 'Rp',
  PHP: '₱',
  VND: '₫',
  TWD: 'NT$',
  PKR: '₨',
  BDT: '৳',
  LKR: 'Rs',
  NPR: 'Rs',
  MMK: 'K',
  KHR: '៛',
  LAK: '₭',
  BND: 'B$'
};

// Get currency symbol by currency code
export const getCurrencySymbol = (currencyCode) => {
  return currencySymbols[currencyCode] || currencyCode;
};

// Get formatted currency display (symbol + code)
export const getFormattedCurrency = (currencyCode) => {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol} ${currencyCode}`;
};

// Currency names mapping
export const currencyNames = {
  INR: 'Indian Rupee',
  CNY: 'Chinese Yuan',
  JPY: 'Japanese Yen',
  KRW: 'South Korean Won',
  SGD: 'Singapore Dollar',
  HKD: 'Hong Kong Dollar',
  THB: 'Thai Baht',
  MYR: 'Malaysian Ringgit',
  IDR: 'Indonesian Rupiah',
  PHP: 'Philippine Peso',
  VND: 'Vietnamese Dong',
  TWD: 'Taiwan Dollar',
  PKR: 'Pakistani Rupee',
  BDT: 'Bangladeshi Taka',
  LKR: 'Sri Lankan Rupee',
  NPR: 'Nepalese Rupee',
  MMK: 'Myanmar Kyat',
  KHR: 'Cambodian Riel',
  LAK: 'Lao Kip',
  BND: 'Brunei Dollar'
};

// Get full currency name
export const getCurrencyName = (currencyCode) => {
  return currencyNames[currencyCode] || currencyCode;
};
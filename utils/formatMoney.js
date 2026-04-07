import { getCurrencySymbol } from './currency';

function defaultLocaleForCurrency(currencyCode) {
  const map = {
    PKR: 'en-PK',
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    BDT: 'en-BD',
    LKR: 'en-LK',
    NPR: 'ne-NP',
  };
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language;
  }
  return map[currencyCode] || 'en-US';
}

/**
 * Format amount with Intl using the user's currency (e.g. PKR → Rs-style via locale).
 */
export function formatCurrencyAmount(value, currencyCode, locale) {
  const code = currencyCode || 'USD';
  const loc = locale || defaultLocaleForCurrency(code);
  const n = Number(value);
  if (Number.isNaN(n)) return `${getCurrencySymbol(code)}0`;

  try {
    return new Intl.NumberFormat(loc, {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(n);
  } catch {
    const sym = getCurrencySymbol(code);
    return `${sym}${n.toLocaleString(loc, { maximumFractionDigits: 2 })}`;
  }
}

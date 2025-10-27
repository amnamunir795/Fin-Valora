// Centralized currency constants to ensure consistency across the app

export const SUPPORTED_CURRENCIES = [
  'INR', 'CNY', 'JPY', 'KRW', 'SGD', 'HKD', 'THB', 'MYR', 
  'IDR', 'PHP', 'VND', 'TWD', 'PKR', 'BDT', 'LKR', 'NPR', 
  'MMK', 'KHR', 'LAK', 'BND'
];

export const CURRENCY_OPTIONS = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee' },
  { code: 'NPR', symbol: 'Rs', name: 'Nepalese Rupee' },
  { code: 'MMK', symbol: 'K', name: 'Myanmar Kyat' },
  { code: 'KHR', symbol: '៛', name: 'Cambodian Riel' },
  { code: 'LAK', symbol: '₭', name: 'Lao Kip' },
  { code: 'BND', symbol: 'B$', name: 'Brunei Dollar' }
];

export const DEFAULT_CURRENCY = 'PKR';
// Centralized currency constants to ensure consistency across the app

export const SUPPORTED_CURRENCIES = [
  'INR', 'CNY', 'JPY', 'KRW', 'SGD', 'HKD', 'THB', 'MYR', 
  'IDR', 'PHP', 'VND', 'TWD', 'PKR', 'BDT', 'LKR', 'NPR', 
  'MMK', 'KHR', 'LAK', 'BND'
];

export const CURRENCY_OPTIONS = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', country: 'India' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', country: 'China' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', country: 'Japan' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', country: 'South Korea' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', country: 'Singapore' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', country: 'Hong Kong' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', country: 'Thailand' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', country: 'Malaysia' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', country: 'Indonesia' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', country: 'Philippines' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', country: 'Vietnam' },
  { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar', country: 'Taiwan' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', country: 'Pakistan' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', country: 'Bangladesh' },
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', country: 'Sri Lanka' },
  { code: 'NPR', symbol: 'Rs', name: 'Nepalese Rupee', country: 'Nepal' },
  { code: 'MMK', symbol: 'K', name: 'Myanmar Kyat', country: 'Myanmar' },
  { code: 'KHR', symbol: '៛', name: 'Cambodian Riel', country: 'Cambodia' },
  { code: 'LAK', symbol: '₭', name: 'Lao Kip', country: 'Laos' },
  { code: 'BND', symbol: 'B$', name: 'Brunei Dollar', country: 'Brunei' }
];

export const DEFAULT_CURRENCY = 'PKR';
import { CardType } from '@/types/payment';

// Detect card brand based on starting digits
export const getCardType = (cardNumber: string): CardType => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  if (/^4/.test(cleanNumber)) return 'Visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'Amex';
  return 'Unknown';
};

// Auto-format card number with spaces (e.g., 4242 4242 4242 4242)
export const formatCardNumber = (value: string): string => {
  const cleanValue = value.replace(/\D/g, ''); // Remove non-digits
  const matches = cleanValue.match(/.{1,4}/g);
  return matches ? matches.join(' ') : cleanValue;
};

// Auto-format expiry date with slash (e.g., 12/25)
export const formatExpiry = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length >= 3) {
    return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
  }
  return cleanValue;
};
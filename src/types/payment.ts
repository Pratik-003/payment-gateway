export type PaymentStatus = 'Idle' | 'Processing' | 'Success' | 'Failed' | 'Timeout';
export type CardType = 'Visa' | 'Mastercard' | 'Amex' | 'Unknown';

export interface Transaction {
  id: string; // The idempotent UUID
  amount: number;
  currency: string;
  status: PaymentStatus;
  timestamp: string; // ISO date string
  failureReason?: string;
  attempts: number;
}

export interface PaymentPayload {
  cardholderName: string;
  cardNumber: string; 
  expiryDate: string; // MM/YY
  cvv: string;
  amount: number;
  currency: string;
}
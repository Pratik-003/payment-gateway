'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema, PaymentFormData } from '@/utils/validators';
import { formatCardNumber, formatExpiry, getCardType } from '@/utils/formatters';
import { LiveCardPreview } from './LiveCardPreview';

interface CardInputProps {
  onSubmitPayment: (data: PaymentFormData) => void;
  isProcessing: boolean;
}

export const CardInput: React.FC<CardInputProps> = ({ onSubmitPayment, isProcessing }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: 'onChange',
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      amount: 0,
      currency: 'INR',
    },
  });

  // Watch fields to pass to our Live Preview component
  const watchedCardNumber = watch('cardNumber', '');
  const watchedName = watch('cardholderName', '');
  const watchedExpiry = watch('expiryDate', '');
  const cardType = getCardType(watchedCardNumber);

  // Intercept the default onChange to apply our custom spacing/slashes
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('cardNumber', formatCardNumber(e.target.value), { shouldValidate: true });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('expiryDate', formatExpiry(e.target.value), { shouldValidate: true });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 w-full max-w-5xl mx-auto items-center">
      
      {/* Left Column: Live Preview */}
      <div className="w-full lg:w-1/2">
        <LiveCardPreview
          cardNumber={watchedCardNumber}
          cardholderName={watchedName}
          expiryDate={watchedExpiry}
          cardType={cardType}
        />
      </div>

      {/* Right Column: The Form */}
      <div className="w-full lg:w-1/2 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <form onSubmit={handleSubmit(onSubmitPayment)} className="space-y-5">
          
          {/* Cardholder Name */}
          <div>
            <label htmlFor="cardholderName" className="block text-sm font-medium text-slate-700 mb-1">
              Cardholder Name
            </label>
            <input
              id="cardholderName"
              type="text"
              {...register('cardholderName')}
              aria-invalid={!!errors.cardholderName}
              aria-describedby={errors.cardholderName ? "name-error" : undefined}
              className={`w-full text-black bg-white px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all ${
                errors.cardholderName ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500'
              }`}
            />
            {errors.cardholderName && (
              <p id="name-error" className="mt-1 text-xs text-red-500">{errors.cardholderName.message}</p>
            )}
          </div>

          {/* Card Number */}
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700 mb-1">
              Card Number
            </label>
            <input
              id="cardNumber"
              type="text"
              maxLength={19}
              {...register('cardNumber')}
              onChange={handleCardNumberChange}
              aria-invalid={!!errors.cardNumber}
              aria-describedby={errors.cardNumber ? "card-error" : undefined}
              className={`w-full text-black bg-white px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all font-mono ${
                errors.cardNumber ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500'
              }`}
            />
            {errors.cardNumber && (
              <p id="card-error" className="mt-1 text-xs text-red-500">{errors.cardNumber.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            {/* Expiry Date */}
            <div className="w-1/2">
              <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-700 mb-1">
                Expiry Date
              </label>
              <input
                id="expiryDate"
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                {...register('expiryDate')}
                onChange={handleExpiryChange}
                aria-invalid={!!errors.expiryDate}
                aria-describedby={errors.expiryDate ? "expiry-error" : undefined}
                className={`w-full text-black bg-white px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all font-mono ${
                  errors.expiryDate ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500'
                }`}
              />
              {errors.expiryDate && (
                <p id="expiry-error" className="mt-1 text-xs text-red-500">{errors.expiryDate.message}</p>
              )}
            </div>

            {/* CVV */}
            <div className="w-1/2">
              <label htmlFor="cvv" className="block text-sm font-medium text-slate-700 mb-1">
                CVV
              </label>
              <input
                id="cvv"
                type="password"
                maxLength={4}
                {...register('cvv')}
                aria-invalid={!!errors.cvv}
                aria-describedby={errors.cvv ? "cvv-error" : undefined}
                className={`w-full text-black bg-white px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all font-mono tracking-widest ${
                  errors.cvv ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500'
                }`}
              />
              {errors.cvv && (
                <p id="cvv-error" className="mt-1 text-xs text-red-500">{errors.cvv.message}</p>
              )}
            </div>
          </div>

          {/* Amount and Currency */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
              Amount
            </label>
            <div className="flex gap-2">
              <select
                {...register('currency')}
                className="px-3 py-2 text-black bg-slate-50 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
              </select>
              <input
                id="amount"
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                aria-invalid={!!errors.amount}
                aria-describedby={errors.amount ? "amount-error" : undefined}
                className={`flex-1 text-black bg-white px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all ${
                  errors.amount ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.amount && (
              <p id="amount-error" className="mt-1 text-xs text-red-500">{errors.amount.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || isProcessing}
            className={`w-full py-3 mt-4 rounded-xl font-bold text-white transition-all shadow-md ${
              !isValid || isProcessing
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'
            }`}
          >
            {isProcessing ? 'Processing Payment...' : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
};
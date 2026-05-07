'use client';

import React from 'react';
import { CardInput } from '@/components/CardInput';
import { StatusScreen } from '@/components/StatusScreen';
import { TransactionHistory } from '@/components/TransactionHistory';
import { usePaymentStore } from '@/store/usePaymentStore';
import { usePaymentFlow } from '@/hooks/usePaymentFlow';

export default function Home() {
  const status = usePaymentStore((state) => state.status);
  const { processPayment, attemptCount, failureReason, resetFlow, triggerRetry } = usePaymentFlow();

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Secure Checkout
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            Complete your payment details below.
          </p>
        </div>

        {/* Swap between the Form and the Status Screen based on global state */}
        {status === 'Idle' ? (
          <CardInput 
            onSubmitPayment={(data) => processPayment(data, false)} 
            isProcessing={false} 
          />
        ) : (
          <StatusScreen
            status={status}
            attemptCount={attemptCount}
            failureReason={failureReason}
            onRetry={triggerRetry}
            onReset={resetFlow}
          />
        )}

        {/* This reads directly from localStorage/Zustand automatically */}
        <TransactionHistory />
        
      </div>
    </main>
  );
}
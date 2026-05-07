import React, { useEffect, useRef } from 'react';
import { PaymentStatus } from '@/types/payment';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

interface StatusScreenProps {
  status: PaymentStatus;
  attemptCount: number;
  failureReason?: string;
  onRetry: () => void;
  onReset: () => void;
}

export const StatusScreen: React.FC<StatusScreenProps> = ({ status, attemptCount, failureReason, onRetry, onReset }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Accessibility: Move focus to this screen when it appears so screen readers catch it
  useEffect(() => {
    if (status !== 'Idle' && containerRef.current) {
      containerRef.current.focus();
    }
  }, [status]);

  if (status === 'Idle') return null;

  const canRetry = attemptCount < 3 && (status === 'Failed' || status === 'Timeout');

  return (
    <div 
      ref={containerRef}
      tabIndex={-1} 
      className="w-full max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center outline-none"
    >
      {status === 'Processing' && (
        <>
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Processing Payment</h2>
          <p className="text-slate-500 mt-2">Please do not close this window...</p>
        </>
      )}

      {status === 'Success' && (
        <>
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Payment Successful!</h2>
          <p className="text-slate-500 mt-2">Your transaction has been securely processed.</p>
          <button onClick={onReset} className="mt-8 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors">
            Make Another Payment
          </button>
        </>
      )}

      {(status === 'Failed' || status === 'Timeout') && (
        <>
          {status === 'Failed' ? (
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
          ) : (
            <Clock className="w-16 h-16 text-yellow-500 mb-4" />
          )}
          <h2 className="text-2xl font-bold text-slate-800">
            {status === 'Failed' ? 'Payment Failed' : 'Connection Timeout'}
          </h2>
          <p className="text-slate-600 mt-2 max-w-sm">
            {failureReason || 'We could not process your payment at this time.'}
          </p>
          
          <div className="mt-6 w-full space-y-3">
            {canRetry ? (
              <>
                <p className="text-sm font-medium text-slate-500">Attempt {attemptCount} of 3</p>
                <button onClick={onRetry} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md">
                  Retry Payment
                </button>
              </>
            ) : (
              <p className="text-sm font-bold text-red-500 bg-red-50 py-2 rounded-lg">Maximum retries reached.</p>
            )}
            
            <button onClick={onReset} className="w-full py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all">
              Cancel & Start Over
            </button>
          </div>
        </>
      )}
    </div>
  );
};
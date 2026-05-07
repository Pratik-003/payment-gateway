import { useState, useRef } from 'react';
import { usePaymentStore } from '@/store/usePaymentStore';
import { PaymentFormData } from '@/utils/validators';

export const usePaymentFlow = () => {
  const { setStatus, addTransaction, updateTransaction } = usePaymentStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [attemptCount, setAttemptCount] = useState(1);
  const [currentTxId, setCurrentTxId] = useState('');
  const [failureReason, setFailureReason] = useState('');
  
  // We need to store the current form data so we can retry without re-typing
  const [lastPayload, setLastPayload] = useState<PaymentFormData | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const processPayment = async (data: PaymentFormData, isRetry = false) => {
    setIsProcessing(true);
    setStatus('Processing');
    setFailureReason('');

    let txId = currentTxId;
    let currentAttempt = isRetry ? attemptCount + 1 : 1;

    // Idempotency: Generate UUID before the FIRST attempt only
    if (!isRetry) {
      txId = crypto.randomUUID();
      setCurrentTxId(txId);
      setAttemptCount(1);
      setLastPayload(data);
      currentAttempt = 1;
    } else {
      setAttemptCount(currentAttempt);
    }

    abortControllerRef.current = new AbortController();
    
    // Fallback timer to trigger the abort signal at exactly 6 seconds
    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }, 6000);

    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, transactionId: txId, attempt: currentAttempt }),
        signal: abortControllerRef.current.signal,
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (response.ok && result.status === 'Success') {
        setStatus('Success');
        addTransaction({
          id: txId,
          amount: data.amount,
          currency: data.currency,
          status: 'Success',
          timestamp: new Date().toISOString(),
          attempts: currentAttempt,
        });
      } else {
        // Handle API returned failures (400) or Server Timeouts (504)
        handleFailure(result.status === 'Timeout' ? 'Timeout' : 'Failed', result.reason || 'Payment declined', txId, data, currentAttempt);
      }
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      // Differentiate between our intentional Abort timeout and actual network failures
      const isAbort = error instanceof Error && error.name === 'AbortError';
      handleFailure(
        isAbort ? 'Timeout' : 'Failed', 
        isAbort ? 'Request timed out after 6 seconds' : 'Network error occurred', 
        txId, 
        data, 
        currentAttempt
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFailure = (
    status: 'Failed' | 'Timeout', 
    reason: string, 
    txId: string, 
    data: PaymentFormData, 
    attempt: number
  ) => {
    setStatus(status);
    setFailureReason(reason);
    
    if (attempt === 1) {
      addTransaction({
        id: txId,
        amount: data.amount,
        currency: data.currency,
        status: status,
        timestamp: new Date().toISOString(),
        failureReason: reason,
        attempts: attempt,
      });
    } else {
      // Update the existing transaction record so we don't create duplicates in history
      updateTransaction(txId, { 
        status, 
        failureReason: reason, 
        attempts: attempt, 
        timestamp: new Date().toISOString() 
      });
    }
  };

  const resetFlow = () => {
    setStatus('Idle');
    setAttemptCount(1);
    setCurrentTxId('');
    setFailureReason('');
    setLastPayload(null);
  };

  const triggerRetry = () => {
    if (lastPayload && attemptCount < 3) {
      processPayment(lastPayload, true);
    }
  };

  return { processPayment, isProcessing, attemptCount, failureReason, resetFlow, triggerRetry };
};
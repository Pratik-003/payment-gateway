import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PaymentStatus, Transaction } from '@/types/payment';

interface PaymentState {
  status: PaymentStatus;
  transactions: Transaction[];
  setStatus: (status: PaymentStatus) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      status: 'Idle',
      transactions: [],
      
      setStatus: (status) => set({ status }),
      
      addTransaction: (transaction) =>
        set((state) => ({ 
          // Add new transaction to the top of the list
          transactions: [transaction, ...state.transactions] 
        })),
        
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
    }),
    {
      name: 'payment-history-storage', // Name of the localStorage key
      partialize: (state) => ({ transactions: state.transactions }), // ONLY persist history, not current UI status
    }
  )
);
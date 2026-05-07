'use client'; 

import React from 'react';
import { usePaymentStore } from '@/store/usePaymentStore';

export const TransactionHistory: React.FC = () => {
  // Read the transactions array directly from our global store
  const transactions = usePaymentStore((state) => state.transactions);

  // If there are no transactions, don't render the table
  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 w-full max-w-3xl mx-auto">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Transaction History</h3>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-3">Transaction ID</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {tx.id.split('-')[0]}... 
                  </td>
                  {/* FIX: Added text-slate-900 here to make the amount solid black/dark gray */}
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {tx.currency} {tx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        tx.status === 'Success'
                          ? 'bg-green-100 text-green-800'
                          : tx.status === 'Failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
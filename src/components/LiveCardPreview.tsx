import React from 'react';
import { CardType } from '@/types/payment';
import { CreditCard } from 'lucide-react';

interface LiveCardPreviewProps {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cardType: CardType;
}

export const LiveCardPreview: React.FC<LiveCardPreviewProps> = ({
  cardNumber,
  cardholderName,
  expiryDate,
  cardType,
}) => {
  // A helper to display a clean default state if the user hasn't typed anything yet
  const displayCardNumber = cardNumber || '•••• •••• •••• ••••';
  const displayName = cardholderName || 'YOUR NAME';
  const displayExpiry = expiryDate || 'MM/YY';

  return (
    <div className="w-full max-w-sm mx-auto aspect-[1.586/1] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 text-white flex flex-col justify-between relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>

      <div className="flex justify-between items-center z-10">
        <CreditCard className="w-8 h-8 text-slate-400" />
        <span className="font-bold text-lg italic tracking-wider">
          {cardType !== 'Unknown' ? cardType : ''}
        </span>
      </div>

      <div className="z-10 mt-6">
        <p className="font-mono text-2xl tracking-[0.15em] drop-shadow-sm">
          {displayCardNumber}
        </p>
      </div>

      <div className="flex justify-between z-10 mt-4">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 uppercase tracking-widest">Cardholder</span>
          <span className="font-medium tracking-wide truncate max-w-[180px] uppercase">
            {displayName}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs text-slate-400 uppercase tracking-widest">Expires</span>
          <span className="font-medium font-mono">{displayExpiry}</span>
        </div>
      </div>
    </div>
  );
};
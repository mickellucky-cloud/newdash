'use client';

import React from 'react';
import SwapWidget from '@/components/SwapWidget';
import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

export default function BuyPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#26262D]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Presale Token Swap</h1>
          <p className="text-xs text-neutral-400">Direct BNB-to-$OKN swap via verified BEP-20 smart contracts</p>
        </div>
      </div>

      <SwapWidget />

      {/* Presale Tokenomics Card */}
      <div className="glass-panel rounded-3xl p-6 border border-[#26262D] space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-[#C9A6FF]" />
          <span>Presale Terms & Contract Guarantees</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-[#1B1B20] rounded-xl border border-[#26262D]">
            <div className="text-neutral-400">Exchange Rate</div>
            <div className="text-sm font-bold text-white mt-1">1 BNB = 10,000 $OKN</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Fixed Seed Price</div>
          </div>
          <div className="p-3.5 bg-[#1B1B20] rounded-xl border border-[#26262D]">
            <div className="text-neutral-400">Hard Cap</div>
            <div className="text-sm font-bold text-white mt-1">5,000 BNB</div>
            <div className="text-[11px] text-[#F3BA2F] mt-0.5">82% Filled</div>
          </div>
          <div className="p-3.5 bg-[#1B1B20] rounded-xl border border-[#26262D]">
            <div className="text-neutral-400">Listing Price</div>
            <div className="text-sm font-bold text-white mt-1">1 BNB = 7,500 $OKN</div>
            <div className="text-[11px] text-[#C9A6FF] mt-0.5">+33% Listing Premium</div>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2 text-xs text-neutral-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Tokens are delivered directly to your connected wallet upon transaction confirmation.</span>
        </div>
      </div>
    </div>
  );
}

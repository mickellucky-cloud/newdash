'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAppStore } from '@/lib/store/useAppStore';
import { translations } from '@/lib/i18n/translations';
import { OKN_RATE, OKN_PRICE_USD, BNB_PRICE_USD } from '@/lib/web3/contracts';
import { ArrowDown, Zap, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function SwapWidget() {
  const { bnbBalance, executeSwap, language, isConnected, setWalletModalOpen } = useAppStore();
  const t = translations[language] || translations.en;

  const [bnbInput, setBnbInput] = useState<string>('0.1');
  const [slippage, setSlippage] = useState<number>(0.5);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  const bnbAmount = parseFloat(bnbInput) || 0;
  const oknOutput = bnbAmount * OKN_RATE;
  const usdValue = bnbAmount * BNB_PRICE_USD;

  const handleSwap = async () => {
    if (!isConnected) {
      setWalletModalOpen(true);
      return;
    }

    if (bnbAmount <= 0) {
      toast.error('Please enter a valid BNB amount');
      return;
    }

    if (bnbAmount > bnbBalance) {
      toast.error('Insufficient BNB balance for swap + gas fees');
      return;
    }

    setIsSwapping(true);
    const toastId = toast.loading('Submitting BSC Presale Swap transaction...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const txHash = executeSwap(bnbAmount, oknOutput);
      toast.dismiss(toastId);
      toast.success(
        `Successfully swapped ${bnbAmount} BNB for ${oknOutput.toLocaleString()} $OKN!`,
        {
          description: `Tx: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
        }
      );
      setBnbInput('0.1');
    } catch {
      toast.dismiss(toastId);
      toast.error('Transaction was rejected or failed on BSC node');
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border border-[#26262D] space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#26262D]/60">
        <div>
          <h3 className="text-lg font-bold text-white">{t.swapNow}</h3>
          <p className="text-xs text-neutral-400">{t.swapSubtitle}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Fixed Rate Active</span>
        </div>
      </div>

      {/* Pay BNB Input */}
      <div className="p-4 rounded-2xl bg-[#0A0A0C] border border-[#26262D] space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>{t.youPay}</span>
          <div className="flex items-center gap-1.5">
            <span>Balance: {bnbBalance.toFixed(3)} BNB</span>
            <button
              onClick={() => setBnbInput(Math.max(0, bnbBalance - 0.01).toFixed(2))}
              className="text-[#7A12F5] hover:text-[#C9A6FF] font-bold text-[11px]"
            >
              MAX
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <input
            type="number"
            min="0.01"
            step="0.05"
            value={bnbInput}
            onChange={(e) => setBnbInput(e.target.value)}
            placeholder="0.0"
            className="w-full bg-transparent text-2xl font-bold font-mono text-white focus:outline-none"
          />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1B1B20] border border-[#26262D] rounded-xl shrink-0">
            <span className="text-base">🔶</span>
            <span className="text-xs font-bold text-white">BNB</span>
          </div>
        </div>
        <div className="text-xs text-neutral-500">
          ≈ ${usdValue.toFixed(2)} USD
        </div>
      </div>

      {/* Swap Arrow Divider */}
      <div className="flex justify-center -my-2 relative z-10">
        <div className="p-2 bg-[#1B1B20] border border-[#26262D] text-[#C9A6FF] rounded-full shadow-lg">
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>

      {/* Receive $OKN Input */}
      <div className="p-4 rounded-2xl bg-[#0A0A0C] border border-[#26262D] space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>{t.youReceive}</span>
          <span className="text-xs font-mono text-emerald-400">
            Est. Value: ${(oknOutput * OKN_PRICE_USD).toFixed(2)} USD
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-2xl font-bold font-mono text-[#C9A6FF]">
            {oknOutput.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1B1B20] border border-[#26262D] rounded-xl shrink-0">
            <Image
              src="/assets/okn-logo.png"
              alt="OKN"
              width={20}
              height={20}
              className="object-contain"
            />
            <span className="text-xs font-bold text-white">$OKN</span>
          </div>
        </div>
      </div>

      {/* Slippage & Details */}
      <div className="p-3 bg-[#1B1B20]/60 border border-[#26262D]/60 rounded-xl space-y-2 text-xs">
        <div className="flex items-center justify-between text-neutral-400">
          <span>Slippage Tolerance</span>
          <div className="flex items-center gap-1">
            {[0.1, 0.5, 1.0].map((s) => (
              <button
                key={s}
                onClick={() => setSlippage(s)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  slippage === s
                    ? 'bg-[#7A12F5] text-white'
                    : 'bg-[#0A0A0C] text-neutral-400 hover:text-white'
                }`}
              >
                {s}%
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between text-neutral-400">
          <span>Network Routing</span>
          <span className="text-white font-mono">BSC TokenSale Contract</span>
        </div>
        <div className="flex items-center justify-between text-neutral-400">
          <span>Est. Network Fee (Gas)</span>
          <span className="text-emerald-400 font-mono">~0.00075 BNB ($0.48)</span>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={handleSwap}
        disabled={isSwapping}
        className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
          isSwapping
            ? 'bg-neutral-800 text-neutral-400 cursor-wait'
            : 'bg-[#7A12F5] hover:bg-[#8C38F7] text-white shadow-[#7A12F5]/30'
        }`}
      >
        <Zap className="w-4 h-4 fill-current" />
        <span>
          {isSwapping ? 'Confirming on BSC...' : `Swap ${bnbAmount} BNB for ${oknOutput.toLocaleString()} $OKN`}
        </span>
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>BEP-20 Standard Safe Execution</span>
      </div>
    </div>
  );
}

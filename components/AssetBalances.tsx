'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppStore } from '@/lib/store/useAppStore';
import { translations } from '@/lib/i18n/translations';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function AssetBalances() {
  const { bnbBalance, oknBalance, language, setWalletModalOpen } = useAppStore();
  const t = translations[language] || translations.en;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Asset Balances Card */}
      <div className="glass-panel rounded-3xl p-6 border border-[#26262D] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white">
            {t.assetBalances}
          </h3>
          <span className="text-xs text-neutral-400 font-mono">BEP-20 / Native</span>
        </div>

        <div className="space-y-3 pt-1">
          {/* BNB Balance */}
          <div className="p-3.5 bg-[#1B1B20] rounded-2xl flex items-center justify-between border border-[#26262D]/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F3BA2F]/15 border border-[#F3BA2F]/30 flex items-center justify-center font-bold text-[#F3BA2F] text-sm">
                🔶
              </div>
              <div>
                <div className="text-xs text-neutral-400 font-medium">BNB</div>
                <div className="text-[11px] text-neutral-500">(Native Gas)</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white font-mono leading-none">
                {bnbBalance.toFixed(2)}
              </div>
              <div className="text-[11px] text-[#F3BA2F] font-semibold mt-1">BNB</div>
            </div>
          </div>

          {/* OKN Balance */}
          <div className="p-3.5 bg-[#1B1B20] rounded-2xl flex items-center justify-between border border-[#26262D]/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#7A12F5]/15 border border-[#7A12F5]/30 flex items-center justify-center overflow-hidden p-1">
                <Image
                  src="/assets/okn-logo.png"
                  alt="OKN"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-xs text-neutral-400 font-medium">$OKN</div>
                <div className="text-[11px] text-neutral-500">Token</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white font-mono leading-none">
                {oknBalance.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#C9A6FF] font-semibold mt-1">$OKN</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit & Withdraw Card */}
      <div className="glass-panel rounded-3xl p-6 border border-[#26262D] flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-2">
            {t.depositWithdraw}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            {t.depositDesc}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <Link
            href="/buy"
            className="py-3 px-3 rounded-xl bg-[#7A12F5] hover:bg-[#8C38F7] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#7A12F5]/20"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Deposit / Buy</span>
          </Link>
          <button
            onClick={() => setWalletModalOpen(true)}
            className="py-3 px-3 rounded-xl bg-[#1B1B20] hover:bg-[#26262D] border border-[#26262D] text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import ClaimWidget from '@/components/ClaimWidget';
import { useAppStore } from '@/lib/store/useAppStore';
import { ShieldCheck, Calendar, Lock } from 'lucide-react';

export default function ClaimPage() {
  const { oknBalance } = useAppStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#26262D]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Merkle Airdrop & Claims</h1>
          <p className="text-xs text-neutral-400">Cryptographically verified token distributions on BNB Smart Chain</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-[#C9A6FF] border border-purple-500/20 text-xs font-mono">
            Balance: {oknBalance.toLocaleString()} $OKN
          </span>
        </div>
      </div>

      <ClaimWidget />

      {/* Vesting Timeline Schedule */}
      <div className="glass-panel rounded-3xl p-6 border border-[#26262D] space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#C9A6FF]" />
          <span>Vesting & Release Schedule</span>
        </h3>

        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-[#1B1B20] border border-emerald-500/30 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">Round 1: Initial Community Claim</div>
              <div className="text-[11px] text-emerald-400">Status: 100% Unlocked • Available Now</div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold font-mono text-emerald-400">12,500 $OKN</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1B1B20] border border-[#26262D] flex items-center justify-between opacity-70">
            <div>
              <div className="text-xs font-semibold text-white">Round 2: Presale Liquidity Match</div>
              <div className="text-[11px] text-neutral-400">Unlocks: End of Season 1 (Q2 2026)</div>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-xs font-mono text-neutral-400">25,000 $OKN</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1B1B20] border border-[#26262D] flex items-center justify-between opacity-70">
            <div>
              <div className="text-xs font-semibold text-white">Round 3: Ecosystem Governance Rewards</div>
              <div className="text-[11px] text-neutral-400">Unlocks: Milestone-based DAO voting</div>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-xs font-mono text-neutral-400">50,000 $OKN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

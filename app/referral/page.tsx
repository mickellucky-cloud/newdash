'use client';

import React from 'react';
import PartnerPackage from '@/components/PartnerPackage';
import ReferralBox from '@/components/ReferralBox';
import { Users, DollarSign, Award, Gift, CheckCircle2 } from 'lucide-react';

export default function ReferralPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Partner Package Hero Card */}
      <PartnerPackage />

      {/* 2. Referral Link & One-Click Sharing */}
      <ReferralBox />

      {/* 3. Detailed Partner Package Breakdown */}
      <div className="glass-panel rounded-3xl p-6 border border-[#26262D] space-y-4">
        <h3 className="text-lg font-bold text-white">Here is the package:</h3>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          The OKN Partner Program is designed for Web3 leaders, community founders, and DeFi creators. As a verified partner, you receive instant on-chain commission splits and access to the decentralized marketing grant.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          <div className="p-4 rounded-2xl bg-[#1B1B20] border border-[#26262D] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-[#C9A6FF] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">10% - 15% Instant Commission</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Earn direct BNB commission on all presale swaps and $OKN staking allocations initiated through your referral code.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1B1B20] border border-[#26262D] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/15 text-[#F3BA2F] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">$200,000 Marketing Budget</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Co-marketing grants, banner sponsorships, and priority placement across our ecosystem partner networks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1B1B20] border border-[#26262D] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">12 mo Token Vesting</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Strategic allocation of $OKN tokens streamed continuously block-by-block with quarterly milestone reviews.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Referral Performance Metrics */}
      <div className="glass-panel rounded-3xl p-6 border border-[#26262D] space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-[#C9A6FF]" />
          <span>Your Referral Performance</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 bg-[#1B1B20] rounded-xl border border-[#26262D]">
            <div className="text-xs text-neutral-400">Total Referrals</div>
            <div className="text-xl font-bold font-mono text-white mt-1">24</div>
          </div>
          <div className="p-3.5 bg-[#1B1B20] rounded-xl border border-[#26262D]">
            <div className="text-xs text-neutral-400">Total Commission</div>
            <div className="text-xl font-bold font-mono text-[#F3BA2F] mt-1">0.85 BNB</div>
          </div>
          <div className="p-3.5 bg-[#1B1B20] rounded-xl border border-[#26262D]">
            <div className="text-xs text-neutral-400">Bonus $OKN</div>
            <div className="text-xl font-bold font-mono text-[#C9A6FF] mt-1">8,500</div>
          </div>
          <div className="p-3.5 bg-[#1B1B20] rounded-xl border border-[#26262D]">
            <div className="text-xs text-neutral-400">Partner Tier</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">Tier 2</div>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2 text-xs text-neutral-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Commissions are distributed automatically every Friday at 18:00 UTC directly to your connected wallet.</span>
        </div>
      </div>
    </div>
  );
}

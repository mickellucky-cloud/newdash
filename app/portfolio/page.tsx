'use client';

import React from 'react';
import CustodyCard from '@/components/CustodyCard';
import AssetBalances from '@/components/AssetBalances';
import PartnerPackage from '@/components/PartnerPackage';
import ReferralBox from '@/components/ReferralBox';
import ActivityList from '@/components/ActivityList';

export default function PortfolioPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-2 border-b border-[#26262D]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Portfolio & Custody</h1>
          <p className="text-xs text-neutral-400">Real-time balances across Binance Smart Chain protocols</p>
        </div>
      </div>

      <CustodyCard />
      <AssetBalances />
      <PartnerPackage />
      <ReferralBox />
      <ActivityList />
    </div>
  );
}

'use client';

import React from 'react';
import CustodyCard from '@/components/CustodyCard';
import AssetBalances from '@/components/AssetBalances';
import PartnerPackage from '@/components/PartnerPackage';
import ReferralBox from '@/components/ReferralBox';
import ActivityList from '@/components/ActivityList';

export default function HomePage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Purple Web3 Custody Card */}
      <CustodyCard />

      {/* 2. Asset Balances & Deposit/Withdraw Cards */}
      <AssetBalances />

      {/* 3. Partner Package with fixed hierarchy ($200,000 / 12 mo separation) */}
      <PartnerPackage />

      {/* 4. Referral Link with 1-click Copy & Socials */}
      <ReferralBox />

      {/* 5. Protocol Activity Stream */}
      <ActivityList />
    </div>
  );
}

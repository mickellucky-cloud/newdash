'use client';

import React from 'react';
import ActivityList from '@/components/ActivityList';

export default function ActivityPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-[#26262D]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">On-Chain Activity</h1>
          <p className="text-xs text-neutral-400">Verifiable transaction receipts on BNB Smart Chain</p>
        </div>
      </div>

      <ActivityList />
    </div>
  );
}

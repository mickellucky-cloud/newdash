'use client';

import React from 'react';
import TasksList from '@/components/TasksList';
import { useAppStore } from '@/lib/store/useAppStore';
import { Flame, Trophy, ShieldCheck } from 'lucide-react';

export default function TasksPage() {
  const { streakCount, setStreakModalOpen } = useAppStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="purple-gradient-card rounded-3xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Season 1 Rewards
            </span>
            <span className="text-xs text-purple-200">BSC Airdrop Pool</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Earn $OKN Rewards</h1>
          <p className="text-xs sm:text-sm text-purple-100/80 max-w-lg">
            Complete daily missions, community verifications, and on-chain swaps to accrue guaranteed allocations.
          </p>
        </div>

        <button
          onClick={() => setStreakModalOpen(true)}
          className="px-4 py-3 bg-white text-[#7A12F5] hover:bg-neutral-100 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md shrink-0 self-start sm:self-auto"
        >
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span>Active Streak: {streakCount} Days</span>
        </button>
      </div>

      {/* Main Tasks List */}
      <TasksList />

      {/* Rewards Tier Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-[#26262D]">
          <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Tier 1: Explorer</div>
          <div className="text-base font-bold text-white">0 - 2,500 $OKN</div>
          <p className="text-xs text-neutral-400 mt-1">Unlocked via community and social tasks.</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-[#26262D]">
          <div className="text-xs font-bold text-[#F3BA2F] uppercase tracking-wider mb-1">Tier 2: Contributor</div>
          <div className="text-base font-bold text-white">2,500 - 10,000 $OKN</div>
          <p className="text-xs text-neutral-400 mt-1">Includes 1.1x streak multiplier on rewards.</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-[#26262D]">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Tier 3: Partner</div>
          <div className="text-base font-bold text-white">10,000+ $OKN</div>
          <p className="text-xs text-neutral-400 mt-1">Qualifies for Partner Package & revenue sharing.</p>
        </div>
      </div>
    </div>
  );
}

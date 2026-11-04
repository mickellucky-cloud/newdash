'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { X, Flame, Check, Gift, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function StreakModal() {
  const {
    isStreakModalOpen,
    setStreakModalOpen,
    streakCount,
    checkInToday,
    lastCheckInDate,
  } = useAppStore();

  if (!isStreakModalOpen) return null;

  const today = new Date().toISOString().split('T')[0];
  const alreadyCheckedIn = lastCheckInDate === today;

  const days = [
    { day: 1, reward: 50 },
    { day: 2, reward: 60 },
    { day: 3, reward: 70 },
    { day: 4, reward: 80 },
    { day: 5, reward: 100 },
    { day: 6, reward: 120 },
    { day: 7, reward: 250, special: true },
  ];

  const handleClaim = () => {
    const res = checkInToday();
    if (res.success) {
      toast.success(`Check-in successful! +${res.reward} $OKN added to balance.`);
    } else {
      toast.info('You have already claimed today’s check-in bonus!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#131316] border border-[#26262D] rounded-2xl shadow-2xl p-6 text-white">
        <div className="flex items-center justify-between pb-4 border-b border-[#26262D]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg">
              <Flame className="w-5 h-5 fill-orange-500/40" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">7-Day Protocol Streak</h3>
              <p className="text-xs text-neutral-400">Claim daily $OKN tokens and multiply rewards</p>
            </div>
          </div>
          <button
            onClick={() => setStreakModalOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current streak display */}
        <div className="my-5 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-transparent border border-orange-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xl">
              {streakCount}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-orange-400 font-semibold">Active Streak</div>
              <div className="text-sm font-medium text-white">{streakCount} Days in a row</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-400">Multiplier</div>
            <div className="text-sm font-bold text-[#C9A6FF]">1.{(streakCount * 5).toString().padStart(2, '0')}x</div>
          </div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {days.slice(0, 4).map((d) => {
            const isCompleted = d.day <= streakCount;
            const isCurrent = d.day === streakCount + 1 && !alreadyCheckedIn;
            return (
              <div
                key={d.day}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : isCurrent
                    ? 'bg-[#7A12F5]/20 border-[#7A12F5] text-white ring-1 ring-[#7A12F5]'
                    : 'bg-[#1B1B20] border-[#26262D] text-neutral-400'
                }`}
              >
                <div className="text-[10px] uppercase font-semibold">Day {d.day}</div>
                <div className="my-1.5 flex justify-center">
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Gift className="w-4 h-4 text-neutral-400" />
                  )}
                </div>
                <div className="text-xs font-bold">+{d.reward}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {days.slice(4).map((d) => {
            const isCompleted = d.day <= streakCount;
            const isCurrent = d.day === streakCount + 1 && !alreadyCheckedIn;
            return (
              <div
                key={d.day}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  d.special ? 'relative overflow-hidden' : ''
                } ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : isCurrent
                    ? 'bg-[#7A12F5]/20 border-[#7A12F5] text-white ring-1 ring-[#7A12F5]'
                    : 'bg-[#1B1B20] border-[#26262D] text-neutral-400'
                }`}
              >
                {d.special && (
                  <div className="absolute top-0 right-0 bg-[#F3BA2F] text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded-bl">
                    MEGA
                  </div>
                )}
                <div className="text-[10px] uppercase font-semibold">Day {d.day}</div>
                <div className="my-1.5 flex justify-center">
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-[#F3BA2F]" />
                  )}
                </div>
                <div className="text-xs font-bold">+{d.reward}</div>
              </div>
            );
          })}
        </div>

        {/* Claim button */}
        <button
          onClick={handleClaim}
          disabled={alreadyCheckedIn}
          className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            alreadyCheckedIn
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              : 'bg-[#7A12F5] hover:bg-[#8C38F7] text-white shadow-lg shadow-[#7A12F5]/30'
          }`}
        >
          {alreadyCheckedIn ? (
            <>
              <Check className="w-4 h-4" />
              Claimed for Today (Resets 00:00 UTC)
            </>
          ) : (
            <>
              <Flame className="w-4 h-4 text-orange-400" />
              Claim Day {streakCount + 1} Bonus
            </>
          )}
        </button>
      </div>
    </div>
  );
}

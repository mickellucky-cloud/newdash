'use client';

import React from 'react';
import { Trophy, Medal, Flame, Users } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  address: string;
  points: number;
  streak: number;
  tier: string;
}

export default function LeaderboardPage() {
  const leaders: LeaderboardUser[] = [
    { rank: 1, address: '0x48B7...9A2C', points: 124500, streak: 42, tier: 'Diamond' },
    { rank: 2, address: '0x9E21...B840', points: 98200, streak: 35, tier: 'Diamond' },
    { rank: 3, address: '0x71C5...49A1', points: 37500, streak: 14, tier: 'Platinum' },
    { rank: 4, address: '0x1C88...E124', points: 29400, streak: 12, tier: 'Gold' },
    { rank: 5, address: '0xFA32...C49B', points: 22100, streak: 9, tier: 'Gold' },
    { rank: 6, address: '0x88D1...77F3', points: 18500, streak: 7, tier: 'Silver' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#26262D]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Community Leaderboard</h1>
          <p className="text-xs text-neutral-400">Top contributors, referral partners, and on-chain stakers</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[#F3BA2F] text-xs font-mono">
          <Trophy className="w-3.5 h-3.5" />
          <span>Bi-Weekly Rewards Active</span>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-[#26262D] space-y-4">
        <div className="space-y-2">
          {leaders.map((user) => {
            const isCurrentUser = user.address.includes('71C5');
            return (
              <div
                key={user.rank}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                  isCurrentUser
                    ? 'bg-[#7A12F5]/20 border-[#7A12F5] shadow-md shadow-[#7A12F5]/10'
                    : 'bg-[#1B1B20] border-[#26262D] hover:border-[#7A12F5]/30'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                      user.rank === 1
                        ? 'bg-yellow-500/20 text-[#F3BA2F]'
                        : user.rank === 2
                        ? 'bg-neutral-300/20 text-neutral-200'
                        : user.rank === 3
                        ? 'bg-amber-600/20 text-amber-500'
                        : 'bg-neutral-800 text-neutral-400 text-xs'
                    }`}
                  >
                    {user.rank <= 3 ? <Medal className="w-4 h-4" /> : user.rank}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-white">
                        {user.address}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[10px] bg-[#7A12F5] text-white px-1.5 py-0.2 rounded font-semibold">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
                      <span className="flex items-center gap-1 text-orange-400">
                        <Flame className="w-3 h-3 fill-orange-400" />
                        {user.streak}d streak
                      </span>
                      <span>•</span>
                      <span className="text-neutral-400">{user.tier} Tier</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm sm:text-base font-extrabold font-mono text-white">
                    {user.points.toLocaleString()}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#C9A6FF]">Points</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

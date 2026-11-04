'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { ArrowUpRight, ArrowDownLeft, Gift, ExternalLink } from 'lucide-react';

export default function ActivityList() {
  const { transactions, network } = useAppStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'swap':
        return <ArrowDownLeft className="w-4 h-4 text-[#F3BA2F]" />;
      case 'claim':
        return <Gift className="w-4 h-4 text-[#C9A6FF]" />;
      default:
        return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border border-[#26262D] space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#26262D]/60">
        <div>
          <h3 className="text-lg font-bold text-white">Recent Protocol Activity</h3>
          <p className="text-xs text-neutral-400">Real-time BSC transaction events and claim verification</p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Sync: 100%
        </span>
      </div>

      <div className="space-y-2.5">
        {transactions.map((tx) => (
          <div
            key={tx.hash}
            className="p-3.5 rounded-2xl bg-[#1B1B20] border border-[#26262D] flex items-center justify-between hover:border-[#7A12F5]/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0A0A0C] border border-[#26262D] flex items-center justify-center shrink-0">
                {getIcon(tx.type)}
              </div>
              <div>
                <div className="text-xs sm:text-sm font-semibold text-white">
                  {tx.description}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-400">
                  <span className="font-mono text-neutral-500">
                    {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                  </span>
                  <span>•</span>
                  <span>{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="text-sm font-mono font-bold text-emerald-400">
                  {tx.amount}
                </div>
                <div className="text-[10px] uppercase font-bold text-neutral-500">
                  {tx.status}
                </div>
              </div>
              <a
                href={`https://${network === 'bscTestnet' ? 'testnet.' : ''}bscscan.com/tx/${tx.hash}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[#0A0A0C] hover:bg-[#26262D] text-neutral-400 hover:text-white transition-colors"
                title="View on BscScan"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

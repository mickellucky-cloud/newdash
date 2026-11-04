'use client';

import React from 'react';
import CustodyCard from '@/components/CustodyCard';
import AssetBalances from '@/components/AssetBalances';
import { useAppStore } from '@/lib/store/useAppStore';
import { ShieldCheck, Globe, Key, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function WalletPage() {
  const { network, switchNetwork, setWalletModalOpen } = useAppStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-[#26262D]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Web3 Custody & Security</h1>
          <p className="text-xs text-neutral-400">Account status, RPC nodes, and token permissions</p>
        </div>
      </div>

      <CustodyCard />
      <AssetBalances />

      {/* Network Configuration Details */}
      <div className="glass-panel rounded-3xl p-6 border border-[#26262D] space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#C9A6FF]" />
          <span>Active Chain Parameters</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-[#1B1B20] rounded-xl flex items-center justify-between border border-[#26262D]">
            <span className="text-neutral-400">Network Name:</span>
            <span className="font-semibold text-white">
              {network === 'bsc' ? 'BNB Smart Chain Mainnet' : 'BNB Smart Chain Testnet'}
            </span>
          </div>
          <div className="p-3.5 bg-[#1B1B20] rounded-xl flex items-center justify-between border border-[#26262D]">
            <span className="text-neutral-400">Chain ID:</span>
            <span className="font-mono text-emerald-400 font-bold">
              {network === 'bsc' ? '56' : '97'}
            </span>
          </div>
          <div className="p-3.5 bg-[#1B1B20] rounded-xl flex items-center justify-between border border-[#26262D]">
            <span className="text-neutral-400">Currency Symbol:</span>
            <span className="font-mono text-[#F3BA2F] font-bold">BNB</span>
          </div>
          <div className="p-3.5 bg-[#1B1B20] rounded-xl flex items-center justify-between border border-[#26262D]">
            <span className="text-neutral-400">Block Explorer:</span>
            <span className="font-mono text-neutral-300">
              {network === 'bsc' ? 'https://bscscan.com' : 'https://testnet.bscscan.com'}
            </span>
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <button
            onClick={() => setWalletModalOpen(true)}
            className="flex-1 py-3 bg-[#7A12F5] hover:bg-[#8C38F7] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Key className="w-4 h-4" />
            <span>Manage Connected Wallets</span>
          </button>
          <button
            onClick={() => {
              const target = network === 'bsc' ? 'bscTestnet' : 'bsc';
              switchNetwork(target);
              toast.success(`Switched network to ${target.toUpperCase()}`);
            }}
            className="py-3 px-4 bg-[#1B1B20] hover:bg-[#26262D] border border-[#26262D] text-neutral-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Toggle Network</span>
          </button>
        </div>
      </div>
    </div>
  );
}

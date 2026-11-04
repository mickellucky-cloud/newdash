'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { X, Wallet, CheckCircle2, ShieldCheck, ArrowRight, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function WalletModal() {
  const {
    isWalletModalOpen,
    setWalletModalOpen,
    isConnected,
    address,
    connectWallet,
    disconnectWallet,
    network,
    switchNetwork,
  } = useAppStore();

  if (!isWalletModalOpen) return null;

  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      desc: 'Popular browser extension & mobile wallet',
      badge: 'Popular',
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      icon: (
        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-bold text-orange-400">
          🦊
        </div>
      ),
    },
    {
      id: 'binance',
      name: 'Binance Web3 Wallet',
      desc: 'Native BNB Smart Chain integrated custody',
      badge: 'Recommended',
      color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      icon: (
        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center font-bold text-yellow-400">
          🟡
        </div>
      ),
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      desc: 'Secure multi-coin mobile & extension wallet',
      badge: 'Mobile',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: (
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-400">
          🛡️
        </div>
      ),
    },
    {
      id: 'demo',
      name: 'OKN Demo Custody (Instant)',
      desc: 'Prefunded testnet custody (0x71C...49A1)',
      badge: 'Instant Access',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: (
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center font-bold text-purple-300">
          <Wallet className="w-4 h-4 text-purple-300" />
        </div>
      ),
    },
  ];

  const handleSelectWallet = (walletId: string) => {
    if (walletId === 'demo') {
      connectWallet('0x71C50428d0f944473858feB6b7EB3686888449A1');
      toast.success('Connected to OKN Web3 Custody (0x71C...49A1)');
    } else {
      // If browser window.ethereum exists, or fallback to demo
      if (typeof window !== 'undefined' && (window as unknown as { ethereum?: unknown }).ethereum) {
        connectWallet();
        toast.success(`Connected via ${walletId.toUpperCase()}`);
      } else {
        connectWallet('0x71C50428d0f944473858feB6b7EB3686888449A1');
        toast.info(`Simulated connection via ${walletId}`);
      }
    }
    setWalletModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#131316] border border-[#26262D] rounded-2xl shadow-2xl p-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#26262D]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#7A12F5]/20 text-[#C9A6FF] rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Connect Web3 Wallet</h3>
              <p className="text-xs text-neutral-400">Connect to BNB Smart Chain to access presale & rewards</p>
            </div>
          </div>
          <button
            onClick={() => setWalletModalOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network Switcher inside modal */}
        <div className="my-4 p-3 bg-[#1B1B20] border border-[#26262D] rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-medium text-neutral-300">Network:</span>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                switchNetwork('bscTestnet');
                toast.info('Switched to BNB Smart Chain Testnet');
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                network === 'bscTestnet'
                  ? 'bg-[#7A12F5] text-white shadow-sm'
                  : 'bg-neutral-800/60 text-neutral-400 hover:text-white'
              }`}
            >
              BSC Testnet
            </button>
            <button
              onClick={() => {
                switchNetwork('bsc');
                toast.info('Switched to BNB Smart Chain Mainnet');
              }}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                network === 'bsc'
                  ? 'bg-[#F3BA2F] text-black shadow-sm font-semibold'
                  : 'bg-neutral-800/60 text-neutral-400 hover:text-white'
              }`}
            >
              BSC Mainnet
            </button>
          </div>
        </div>

        {/* Status if already connected */}
        {isConnected && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{address}</span>
            </div>
            <button
              onClick={() => {
                disconnectWallet();
                toast.info('Wallet disconnected');
              }}
              className="px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded font-medium"
            >
              Disconnect
            </button>
          </div>
        )}

        {/* Wallet Options */}
        <div className="space-y-2 mt-2">
          {walletOptions.map((w) => (
            <button
              key={w.id}
              onClick={() => handleSelectWallet(w.id)}
              className="w-full p-3.5 rounded-xl bg-[#1B1B20] hover:bg-[#26262D] border border-transparent hover:border-[#7A12F5]/50 flex items-center justify-between transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                {w.icon}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white group-hover:text-[#C9A6FF] transition-colors">
                      {w.name}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${w.color}`}>
                      {w.badge}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">{w.desc}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>

        {/* Security badge */}
        <div className="mt-5 pt-3 border-t border-[#26262D] flex items-center justify-center gap-1.5 text-xs text-neutral-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>CertiK Audited & BEP-20 Verified Smart Contracts</span>
        </div>
      </div>
    </div>
  );
}

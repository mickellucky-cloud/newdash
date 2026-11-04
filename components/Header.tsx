'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from '@/lib/store/useAppStore';
import { translations } from '@/lib/i18n/translations';
import LanguageSelector from './LanguageSelector';
import { Wallet, Bell, Flame } from 'lucide-react';
import { formatAddress } from '@/lib/utils';

export default function Header() {
  const {
    isConnected,
    address,
    network,
    streakCount,
    setWalletModalOpen,
    setStreakModalOpen,
    language,
  } = useAppStore();

  const t = translations[language] || translations.en;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#26262D]/80 px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* User greeting and avatar */}
      <div className="flex items-center gap-3">
        <Link href="/" className="relative flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#1B1B20] border border-[#26262D] flex items-center justify-center overflow-hidden shadow-inner group-hover:border-[#7A12F5]/50 transition-colors">
            <Image
              src="/assets/okn-logo.png"
              alt="OKN Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="text-[11px] text-neutral-400 font-medium leading-none">
              {t.welcomeBack}
            </div>
            <div className="text-base font-bold text-white tracking-wide">
              DE
            </div>
          </div>
        </Link>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Button */}
        <button
          onClick={() => setStreakModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 text-xs font-semibold transition-all"
          title="Daily Check-in Streak"
        >
          <Flame className="w-4 h-4 fill-orange-500/50" />
          <span>{streakCount}d</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 rounded-xl bg-[#1B1B20] hover:bg-[#26262D] border border-[#26262D] text-neutral-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7A12F5] ring-2 ring-[#131316]"></span>
          </button>
        </div>

        {/* Language selector */}
        <LanguageSelector />

        {/* Wallet Connect Button with clear Wallet Icon */}
        <button
          onClick={() => setWalletModalOpen(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isConnected
              ? 'bg-[#7A12F5] hover:bg-[#8C38F7] text-white shadow-md shadow-[#7A12F5]/25'
              : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
          }`}
          title="Connect or manage Web3 Wallet"
        >
          <Wallet className="w-4 h-4 text-white" />
          <span className="hidden sm:inline">
            {isConnected ? formatAddress(address) : t.connectWallet}
          </span>
          <span className="inline sm:hidden">
            {isConnected ? `${address.slice(0, 4)}..` : 'Connect'}
          </span>
          {isConnected && (
            <span
              className={`w-2 h-2 rounded-full ${
                network === 'bsc' ? 'bg-[#F3BA2F]' : 'bg-emerald-400'
              }`}
            />
          )}
        </button>
      </div>
    </header>
  );
}

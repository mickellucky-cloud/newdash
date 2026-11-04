'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store/useAppStore';
import { translations } from '@/lib/i18n/translations';
import {
  Home,
  Zap,
  Download,
  PlusCircle,
  Bot,
  Users,
  Clock,
  Wallet,
  Trophy,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { language, network, bnbBalance, oknBalance } = useAppStore();
  const t = translations[language] || translations.en;

  const navItems = [
    { href: '/', label: t.navPortfolio, icon: Home },
    { href: '/tasks', label: t.navEarn, icon: Zap },
    { href: '/claim', label: t.navClaim, icon: Download },
    { href: '/buy', label: t.navBuy, icon: PlusCircle },
    { href: '/agents', label: t.navAgents, icon: Bot },
    { href: '/referral', label: t.navReferral, icon: Users },
    { href: '/activity', label: t.navActivity, icon: Clock },
    { href: '/wallet', label: t.navWallet, icon: Wallet },
    { href: '/leaderboard', label: t.navLeaderboard, icon: Trophy },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-[#26262D]/80 min-h-[calc(100vh-65px)] p-4 shrink-0 justify-between">
      <div className="space-y-6">
        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#7A12F5] text-white shadow-lg shadow-[#7A12F5]/25 font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-[#1B1B20]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Live BSC Network Card */}
        <div className="p-3.5 rounded-xl bg-[#1B1B20] border border-[#26262D] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Target Chain</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {network === 'bsc' ? 'BSC Mainnet (56)' : 'BSC Testnet (97)'}
            </span>
          </div>

          <div className="pt-2 border-t border-[#26262D]/60 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Holdings:</span>
            <span className="text-white font-semibold">{oknBalance.toLocaleString()} $OKN</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Native Gas:</span>
            <span className="text-white font-semibold">{bnbBalance.toFixed(2)} BNB</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-[#26262D]/60 space-y-3">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Wagmi v2 & Viem v2 Verified</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-neutral-500">
          <span>OKN Protocol v2.5</span>
          <a
            href="https://bscscan.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[#C9A6FF] hover:underline"
          >
            <span>BscScan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store/useAppStore';
import { translations } from '@/lib/i18n/translations';
import { Home, Zap, Download, PlusCircle, Bot, Users } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const { language } = useAppStore();
  const t = translations[language] || translations.en;

  const items = [
    { href: '/', label: t.navHome, icon: Home },
    { href: '/tasks', label: t.navEarn, icon: Zap },
    { href: '/claim', label: t.navClaim, icon: Download },
    { href: '/buy', label: t.navBuy, icon: PlusCircle },
    { href: '/referral', label: t.navReferral, icon: Users },
    { href: '/agents', label: t.navAgents, icon: Bot },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-xl border-t border-[#26262D] px-2 py-2 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center min-w-[50px] py-1 px-2 rounded-xl transition-all ${
              isActive
                ? 'bg-[#7A12F5] text-white shadow-md shadow-[#7A12F5]/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
            <span
              className={`text-[10px] mt-1 font-medium tracking-tight ${
                isActive ? 'text-white font-semibold' : 'text-neutral-400'
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

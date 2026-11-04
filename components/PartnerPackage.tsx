'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { translations } from '@/lib/i18n/translations';

export default function PartnerPackage() {
  const { language } = useAppStore();
  const t = translations[language] || translations.en;

  const metrics = [
    {
      value: '10-15%',
      label: t.commission,
      highlight: true,
    },
    {
      value: '$200k',
      fullValue: '$200,000',
      label: t.marketingBudget,
    },
    {
      value: '12 mo',
      label: t.tokenVesting,
    },
  ];

  return (
    <div className="w-full purple-gradient-card rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl">
      {/* Background glow */}
      <div className="absolute right-0 bottom-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
          {t.partnerPackage}
        </h2>

        {/* 3 Metrics Cards with strict responsive layout preventing overlap */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {metrics.map((item, idx) => (
            <div
              key={idx}
              className="purple-sub-card rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-h-[96px] min-w-0"
            >
              <div>
                <div className="text-base sm:text-2xl font-black tracking-tight text-white leading-tight truncate">
                  <span className="sm:hidden">{item.value}</span>
                  <span className="hidden sm:inline">{item.fullValue || item.value}</span>
                </div>
              </div>
              <div className="text-[11px] sm:text-xs text-purple-100/90 font-medium leading-tight mt-1 line-clamp-2">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { translations } from '@/lib/i18n/translations';
import { Copy, Check, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function ReferralBox() {
  const { language } = useAppStore();
  const t = translations[language] || translations.en;
  const [copied, setCopied] = useState(false);

  const referralCode = 'DE-71C49';
  const referralLink = `https://app.okntoken.com/ref/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success(t.copied);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(
      `Join the $OKN Presale on BNB Smart Chain! Claim allocation & earn with code ${referralCode}:\n${referralLink}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareTelegram = () => {
    const text = encodeURIComponent(
      `Join the $OKN Presale on BNB Smart Chain! Claim allocation with code ${referralCode}`
    );
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`,
      '_blank'
    );
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border border-[#26262D] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-white">
          {t.yourReferralLink}
        </h3>
        <span className="px-2.5 py-1 rounded-lg bg-[#1B1B20] border border-[#26262D] text-xs font-mono font-medium text-neutral-300">
          Code: <strong className="text-white">{referralCode}</strong>
        </span>
      </div>

      {/* Referral Link Box */}
      <div className="relative">
        <input
          type="text"
          readOnly
          value={referralLink}
          className="w-full px-4 py-3.5 bg-[#0A0A0C] border border-[#26262D] rounded-xl text-sm font-mono text-neutral-300 focus:outline-none select-all"
        />
      </div>

      {/* Action Buttons: Copy link, X, Telegram */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={handleCopy}
          className="flex-1 py-3 px-4 bg-[#7A12F5] hover:bg-[#8C38F7] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#7A12F5]/25"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{t.copied}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>{t.copyLink}</span>
            </>
          )}
        </button>

        {/* X / Twitter share */}
        <button
          onClick={shareTwitter}
          className="p-3 bg-[#1B1B20] hover:bg-[#26262D] border border-[#26262D] text-white rounded-xl transition-colors"
          title="Share to X"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* Telegram share */}
        <button
          onClick={shareTelegram}
          className="p-3 bg-[#1B1B20] hover:bg-[#26262D] border border-[#26262D] text-cyan-400 rounded-xl transition-colors"
          title="Share to Telegram"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

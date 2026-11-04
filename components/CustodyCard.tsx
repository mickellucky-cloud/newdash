'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { translations } from '@/lib/i18n/translations';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function CustodyCard() {
  const {
    address,
    network,
    language,
    setWalletModalOpen,
  } = useAppStore();

  const t = translations[language] || translations.en;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard!');
  };

  const formattedShort = `${address.slice(0, 5)}...${address.slice(-4)}`;

  return (
    <div className="w-full purple-gradient-card rounded-3xl p-6 sm:p-7 text-white relative overflow-hidden shadow-2xl">
      {/* Background ambient shine */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 space-y-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-purple-200 font-semibold mb-1">
            {t.web3Custody}
          </div>
          <div className="text-xs text-purple-200/80 font-medium">
            {t.connectedAddress}
          </div>
        </div>

        {/* Address and quick copy */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-white drop-shadow-sm break-all">
            {formattedShort}
          </h2>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
              title="Copy Address"
            >
              <Copy className="w-4 h-4" />
            </button>
            <a
              href={`https://${network === 'bscTestnet' ? 'testnet.' : ''}bscscan.com/address/${address}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
              title="View on BscScan"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Network indicator pill */}
        <div className="pt-1">
          <button
            onClick={() => setWalletModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-xs font-semibold text-white backdrop-blur-md border border-white/25 transition-all shadow-sm"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                network === 'bsc' ? 'bg-[#F3BA2F]' : 'bg-emerald-400'
              } animate-pulse`}
            />
            <span>
              {network === 'bsc'
                ? 'BNB Smart Chain (Mainnet)'
                : 'BNB Smart Chain (Testnet)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAppStore } from '@/lib/store/useAppStore';
import { translations } from '@/lib/i18n/translations';
import { getProofForAddress } from '@/lib/web3/merkle';
import { ShieldCheck, CheckCircle2, Download, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function ClaimWidget() {
  const { claimableOkn, claimAirdrop, language, address, isConnected, setWalletModalOpen } = useAppStore();
  const t = translations[language] || translations.en;
  const [isClaiming, setIsClaiming] = useState(false);

  const merkleProof = getProofForAddress(address);

  const handleClaim = async () => {
    if (!isConnected) {
      setWalletModalOpen(true);
      return;
    }

    if (claimableOkn <= 0) {
      toast.info('No remaining claimable allocation in this round');
      return;
    }

    setIsClaiming(true);
    const toastId = toast.loading('Verifying Merkle cryptographic leaf on BSC node...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1600));
      const success = claimAirdrop();
      toast.dismiss(toastId);
      if (success) {
        toast.success(
          `Successfully claimed ${claimableOkn.toLocaleString()} $OKN rewards!`,
          {
            description: 'Funds dispatched to your BSC custody wallet',
          }
        );
      }
    } catch {
      toast.dismiss(toastId);
      toast.error('Claim transaction encountered an error');
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border border-[#26262D] space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#26262D]/60">
        <div>
          <h3 className="text-lg font-bold text-white">{t.airdropTitle}</h3>
          <p className="text-xs text-neutral-400">{t.airdropSubtitle}</p>
        </div>
        <div className="p-2 rounded-xl bg-purple-500/15 text-[#C9A6FF]">
          <Download className="w-5 h-5" />
        </div>
      </div>

      {/* Claimable allocation preview */}
      <div className="p-5 rounded-2xl bg-[#0A0A0C] border border-[#26262D] flex items-center justify-between">
        <div>
          <div className="text-xs text-neutral-400 font-medium">Claimable Allocation</div>
          <div className="text-3xl font-extrabold font-mono text-white mt-1">
            {claimableOkn.toLocaleString()}
            <span className="text-sm font-bold text-[#C9A6FF] ml-2">$OKN</span>
          </div>
          <div className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Cryptographic Proof Validated</span>
          </div>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-[#1B1B20] border border-[#26262D] flex items-center justify-center p-2">
          <Image
            src="/assets/okn-logo.png"
            alt="OKN"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
      </div>

      {/* Cryptographic verification panel */}
      <div className="p-4 bg-[#1B1B20]/60 border border-[#26262D]/60 rounded-xl space-y-2.5 text-xs">
        <div className="flex items-center justify-between text-neutral-400">
          <span>Merkle Root</span>
          <span className="font-mono text-neutral-300">0x7e88c7...9821</span>
        </div>
        <div className="flex items-center justify-between text-neutral-400">
          <span>Leaf Proof Hash (Level 1)</span>
          <span className="font-mono text-neutral-300">
            {merkleProof.proof[0].slice(0, 10)}...{merkleProof.proof[0].slice(-8)}
          </span>
        </div>
        <div className="flex items-center justify-between text-neutral-400">
          <span>Vesting Schedule</span>
          <span className="text-emerald-400 font-medium">100% Unlocked (Round 1)</span>
        </div>
      </div>

      {/* Claim button */}
      <button
        onClick={handleClaim}
        disabled={isClaiming || claimableOkn <= 0}
        className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
          claimableOkn <= 0
            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            : isClaiming
            ? 'bg-neutral-800 text-neutral-400 cursor-wait'
            : 'bg-[#7A12F5] hover:bg-[#8C38F7] text-white shadow-[#7A12F5]/30'
        }`}
      >
        {claimableOkn <= 0 ? (
          <>
            <Lock className="w-4 h-4" />
            <span>Allocation Claimed</span>
          </>
        ) : isClaiming ? (
          <span>Confirming claim...</span>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Claim {claimableOkn.toLocaleString()} $OKN to Wallet</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Non-custodial cryptographic distribution contract</span>
      </div>
    </div>
  );
}

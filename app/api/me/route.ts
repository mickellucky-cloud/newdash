import { NextResponse } from 'next/server';

export async function GET() {
  const profile = {
    username: 'DE',
    address: '0x71C50428d0f944473858feB6b7EB3686888449A1',
    network: 'bscTestnet',
    chainId: 97,
    tier: 'Platinum',
    streak: 3,
    referralCode: 'DE-71C49',
    referralLink: 'https://app.okntoken.com/ref/DE-71C49',
    stats: {
      bnbBalance: 1.45,
      oknBalance: 25000,
      claimableOkn: 12500,
      totalReferrals: 24,
      commissionEarnedBNB: 0.85,
    },
  };

  return NextResponse.json(profile);
}

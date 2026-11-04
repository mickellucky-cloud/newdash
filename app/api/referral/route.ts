import { NextResponse } from 'next/server';

export async function GET() {
  const referralData = {
    referralCode: 'DE-71C49',
    referralLink: 'https://app.okntoken.com/ref/DE-71C49',
    tier: 'Tier 2 (Silver Partner)',
    stats: {
      totalInvited: 24,
      totalVolumeBNB: 8.5,
      commissionEarnedBNB: 0.85,
      bonusOknTokens: 8500,
      activeCommissionRate: '10%',
      nextTierRequirement: '15 referrals to reach Tier 3 (15% rate)',
    },
    packageBenefits: [
      '10% - 15% instant commission on all swaps',
      '$200,000 ecosystem marketing budget co-grant',
      '12 mo continuous block-by-block token vesting allocation',
    ],
  };

  return NextResponse.json(referralData);
}

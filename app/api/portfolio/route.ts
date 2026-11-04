import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    address: '0x71C50428d0f944473858feB6b7EB3686888449A1',
    network: 'BNB Smart Chain',
    chainId: 97,
    bnbPriceUSD: 650.0,
    oknPriceUSD: 0.065,
    balances: [
      {
        token: 'BNB',
        symbol: 'BNB',
        name: 'Build and Build (Native)',
        amount: 1.45,
        usdValue: 1.45 * 650.0,
        isNative: true,
      },
      {
        token: 'OKN',
        symbol: '$OKN',
        name: 'OKN Ecosystem Token',
        amount: 25000,
        usdValue: 25000 * 0.065,
        contractAddress: '0x9482Ac05510E59d9c8C636b0D4A0c128D3D9E9E9',
      },
    ],
    totalPortfolioUSD: 1.45 * 650.0 + 25000 * 0.065,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(data);
}

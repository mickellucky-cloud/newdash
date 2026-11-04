import { NextRequest, NextResponse } from 'next/server';
import { OKN_RATE, OKN_PRICE_USD, BNB_PRICE_USD } from '@/lib/web3/contracts';

export async function POST(req: NextRequest) {
  try {
    const { bnbAmount } = await req.json();
    const bnb = parseFloat(bnbAmount) || 0;
    const oknAmount = bnb * OKN_RATE;
    const usdValue = bnb * BNB_PRICE_USD;

    return NextResponse.json({
      success: true,
      bnbAmount: bnb,
      oknAmount,
      rate: OKN_RATE,
      usdValue,
      tokenPriceUSD: OKN_PRICE_USD,
      gasEstimateBNB: 0.00075,
      contractAddress: '0x43868B750eA3B310F0606B8F7792e3B80678F128',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

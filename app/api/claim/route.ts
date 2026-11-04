import { NextRequest, NextResponse } from 'next/server';
import { getProofForAddress } from '@/lib/web3/merkle';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const address = body.address || '0x71C50428d0f944473858feB6b7EB3686888449A1';
    const proofData = getProofForAddress(address);

    return NextResponse.json({
      success: true,
      address,
      eligible: proofData.eligible,
      amount: '12500000000000000000000', // 12,500 $OKN in wei
      proof: proofData.proof,
      merkleRoot: '0x7e88c751296D468502A197D87b22F1e564B59821',
      vestingStatus: '100% Unlocked',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  const tasks = [
    {
      id: 't-streak',
      title: 'Daily Protocol Check-in',
      reward: 50,
      category: 'daily',
      completed: true,
    },
    {
      id: 't-telegram',
      title: 'Join OKN Official Telegram Community',
      reward: 250,
      category: 'community',
      completed: true,
      actionUrl: 'https://t.me/okntoken',
    },
    {
      id: 't-x',
      title: 'Follow @OKNToken on X & Retweet Announcement',
      reward: 200,
      category: 'community',
      completed: true,
      actionUrl: 'https://x.com/okntoken',
    },
    {
      id: 't-swap',
      title: 'Perform your first BNB to $OKN Presale Swap',
      reward: 500,
      category: 'onchain',
      completed: false,
    },
    {
      id: 't-partner',
      title: 'Verify Partner Package & Share Referral Link',
      reward: 1000,
      category: 'community',
      completed: false,
    },
    {
      id: 't-ai-agent',
      title: 'Deploy or Interact with an OKN On-chain Agent',
      reward: 750,
      category: 'onchain',
      completed: false,
    },
  ];

  return NextResponse.json({ tasks });
}

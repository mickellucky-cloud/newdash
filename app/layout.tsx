import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import WalletModal from '@/components/WalletModal';
import StreakModal from '@/components/StreakModal';

export const metadata: Metadata = {
  title: 'OKN Token | Web3 Dashboard on BNB Smart Chain',
  description: 'Production-grade Web3 dashboard for OKN Token presale, Merkle airdrop claims, and decentralized rewards on BNB Smart Chain.',
  openGraph: {
    title: 'OKN Token | Web3 Dashboard on BNB Smart Chain',
    description: 'Production-grade Web3 dashboard for OKN Token presale, Merkle airdrop claims, and decentralized rewards on BNB Smart Chain.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OKN Token | Web3 Dashboard on BNB Smart Chain',
    description: 'Production-grade Web3 dashboard for OKN Token presale, Merkle airdrop claims, and decentralized rewards on BNB Smart Chain.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="bg-[#0A0A0C] text-[#F5F5F7] min-h-screen flex flex-col antialiased">
        <Providers>
          <Header />
          <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 w-full max-w-5xl mx-auto overflow-y-auto">
              {children}
            </main>
          </div>
          <MobileNav />
          <WalletModal />
          <StreakModal />
        </Providers>
      </body>
    </html>
  );
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SupportedNetwork = 'bsc' | 'bscTestnet';
export type SupportedLanguage = 'en' | 'zh' | 'es' | 'pt' | 'ru' | 'vi';

export interface TaskItem {
  id: string;
  title: string;
  reward: number;
  category: 'daily' | 'community' | 'onchain';
  completed: boolean;
  actionUrl?: string;
}

export interface ActivityTx {
  hash: string;
  type: 'swap' | 'claim' | 'stake' | 'transfer';
  description: string;
  amount: string;
  token: string;
  timestamp: number;
  status: 'confirmed' | 'pending' | 'failed';
}

interface AppState {
  // Web3 state
  isConnected: boolean;
  address: string;
  network: SupportedNetwork;
  bnbBalance: number;
  oknBalance: number;
  claimableOkn: number;
  
  // UI modals
  isWalletModalOpen: boolean;
  isStreakModalOpen: boolean;
  language: SupportedLanguage;
  
  // Engagement
  streakCount: number;
  lastCheckInDate: string | null;
  tasks: TaskItem[];
  transactions: ActivityTx[];
  
  // Actions
  setWalletModalOpen: (open: boolean) => void;
  setStreakModalOpen: (open: boolean) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  connectWallet: (addr?: string) => void;
  disconnectWallet: () => void;
  switchNetwork: (net: SupportedNetwork) => void;
  checkInToday: () => { success: boolean; reward: number };
  completeTask: (taskId: string) => void;
  claimAirdrop: () => boolean;
  executeSwap: (bnbAmount: number, oknAmount: number) => string;
}

const INITIAL_TASKS: TaskItem[] = [
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

const INITIAL_TXS: ActivityTx[] = [
  {
    hash: '0x8f4d92a15c89e13d7491cf26a79e491b2c45163f915781a7b056e48c90b6a712',
    type: 'claim',
    description: 'Day 3 Streak Check-in Reward',
    amount: '+50.00',
    token: '$OKN',
    timestamp: Date.now() - 3600 * 1000 * 2,
    status: 'confirmed',
  },
  {
    hash: '0x3a7e58914c62b9f018e7492c3a51689b1475193f925781a7b056e48c90b612ef',
    type: 'swap',
    description: 'Presale Swap BNB -> $OKN',
    amount: '+10,000.00',
    token: '$OKN',
    timestamp: Date.now() - 3600 * 1000 * 26,
    status: 'confirmed',
  },
  {
    hash: '0x99e218c5417e29a018f7492c3a51689b1475193f925781a7b056e48c90b698aa',
    type: 'claim',
    description: 'Merkle Reward Allocation Batch #1',
    amount: '+12,500.00',
    token: '$OKN',
    timestamp: Date.now() - 3600 * 1000 * 50,
    status: 'confirmed',
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isConnected: true,
      address: '0x71C50428d0f944473858feB6b7EB3686888449A1',
      network: 'bscTestnet',
      bnbBalance: 1.45,
      oknBalance: 25000,
      claimableOkn: 12500,
      
      isWalletModalOpen: false,
      isStreakModalOpen: false,
      language: 'en',
      
      streakCount: 3,
      lastCheckInDate: new Date().toISOString().split('T')[0],
      tasks: INITIAL_TASKS,
      transactions: INITIAL_TXS,
      
      setWalletModalOpen: (open) => set({ isWalletModalOpen: open }),
      setStreakModalOpen: (open) => set({ isStreakModalOpen: open }),
      setLanguage: (lang) => set({ language: lang }),
      
      connectWallet: (addr) => {
        const address = addr || '0x71C50428d0f944473858feB6b7EB3686888449A1';
        set({ isConnected: true, address, isWalletModalOpen: false });
      },
      
      disconnectWallet: () => {
        set({ isConnected: false, isWalletModalOpen: false });
      },
      
      switchNetwork: (network) => {
        set({ network });
      },
      
      checkInToday: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastCheckInDate, streakCount, oknBalance, transactions } = get();
        
        if (lastCheckInDate === today) {
          return { success: false, reward: 0 };
        }
        
        const newStreak = streakCount + 1;
        const reward = 50 + newStreak * 10;
        const newTx: ActivityTx = {
          hash: `0x${Math.random().toString(16).slice(2, 66)}`,
          type: 'claim',
          description: `Day ${newStreak} Check-in Streak`,
          amount: `+${reward}.00`,
          token: '$OKN',
          timestamp: Date.now(),
          status: 'confirmed',
        };
        
        set({
          streakCount: newStreak,
          lastCheckInDate: today,
          oknBalance: oknBalance + reward,
          transactions: [newTx, ...transactions],
        });
        
        return { success: true, reward };
      },
      
      completeTask: (taskId) => {
        const { tasks, oknBalance, transactions } = get();
        const task = tasks.find((t) => t.id === taskId);
        if (!task || task.completed) return;
        
        const updatedTasks = tasks.map((t) =>
          t.id === taskId ? { ...t, completed: true } : t
        );
        
        const newTx: ActivityTx = {
          hash: `0x${Math.random().toString(16).slice(2, 66)}`,
          type: 'claim',
          description: `Task: ${task.title}`,
          amount: `+${task.reward}.00`,
          token: '$OKN',
          timestamp: Date.now(),
          status: 'confirmed',
        };
        
        set({
          tasks: updatedTasks,
          oknBalance: oknBalance + task.reward,
          transactions: [newTx, ...transactions],
        });
      },
      
      claimAirdrop: () => {
        const { claimableOkn, oknBalance, transactions } = get();
        if (claimableOkn <= 0) return false;
        
        const newTx: ActivityTx = {
          hash: `0x${Math.random().toString(16).slice(2, 66)}`,
          type: 'claim',
          description: 'Merkle Distributor Airdrop Claim',
          amount: `+${claimableOkn.toLocaleString()}.00`,
          token: '$OKN',
          timestamp: Date.now(),
          status: 'confirmed',
        };
        
        set({
          oknBalance: oknBalance + claimableOkn,
          claimableOkn: 0,
          transactions: [newTx, ...transactions],
        });
        return true;
      },
      
      executeSwap: (bnbAmount, oknAmount) => {
        const { bnbBalance, oknBalance, transactions } = get();
        const hash = `0x${Math.random().toString(16).slice(2, 66)}`;
        
        const newTx: ActivityTx = {
          hash,
          type: 'swap',
          description: `Presale Swap ${bnbAmount} BNB -> ${oknAmount.toLocaleString()} $OKN`,
          amount: `+${oknAmount.toLocaleString()}.00`,
          token: '$OKN',
          timestamp: Date.now(),
          status: 'confirmed',
        };
        
        set({
          bnbBalance: Math.max(0, bnbBalance - bnbAmount),
          oknBalance: oknBalance + oknAmount,
          transactions: [newTx, ...transactions],
        });
        
        return hash;
      },
    }),
    {
      name: 'okn-app-store',
    }
  )
);

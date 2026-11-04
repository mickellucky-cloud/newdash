import { http, createConfig } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { injected } from '@wagmi/core';

export const bscMainnetConfig = bsc;
export const bscTestnetConfig = bscTestnet;

export const config = createConfig({
  chains: [bsc, bscTestnet],
  connectors: [
    injected({
      target: 'metaMask',
    }),
  ],
  transports: {
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
  },
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

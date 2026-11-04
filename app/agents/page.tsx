'use client';

import React, { useState } from 'react';
import { Bot, Zap, TrendingUp, ShieldCheck, Activity, Check } from 'lucide-react';
import { toast } from 'sonner';

interface AgentCard {
  id: string;
  name: string;
  category: string;
  apy: string;
  status: 'active' | 'deployed' | 'paused';
  description: string;
  dailyYield: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentCard[]>([
    {
      id: 'ag-1',
      name: 'OKN Arbitrage Alpha',
      category: 'Cross-DEX Arbitrage',
      apy: '42.8%',
      status: 'active',
      description: 'Monitors PancakeSwap and Uniswap BSC pools for high-frequency price discrepancies.',
      dailyYield: '+0.117% / day',
    },
    {
      id: 'ag-2',
      name: 'Liquidity Optimizer v4',
      category: 'Concentrated Liquidity',
      apy: '28.4%',
      status: 'deployed',
      description: 'Auto-rebalances $OKN/BNB range orders to maximize transaction fee yields.',
      dailyYield: '+0.078% / day',
    },
    {
      id: 'ag-3',
      name: 'Sentiment Pulse Sentinel',
      category: 'Algorithmic Hedging',
      apy: '35.1%',
      status: 'active',
      description: 'Analyzes on-chain wallet movements and X social sentiment to hedge presale liquidity.',
      dailyYield: '+0.096% / day',
    },
  ]);

  const toggleDeploy = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const newStatus = a.status === 'deployed' ? 'active' : 'deployed';
          if (newStatus === 'deployed') {
            toast.success(`Agent "${a.name}" deployed to BSC execution loop!`);
          } else {
            toast.info(`Agent "${a.name}" paused`);
          }
          return { ...a, status: newStatus };
        }
        return a;
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#26262D]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">On-Chain Autonomous Agents</h1>
          <p className="text-xs text-neutral-400">Algorithmic execution contracts generating DeFi yields on BSC</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Active Agents: {agents.filter((a) => a.status === 'deployed').length}/3</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const isDeployed = agent.status === 'deployed';
          return (
            <div
              key={agent.id}
              className={`glass-panel rounded-3xl p-5 border flex flex-col justify-between space-y-4 transition-all ${
                isDeployed
                  ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                  : 'border-[#26262D] hover:border-[#7A12F5]/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 px-2 py-0.5 rounded bg-[#1B1B20] border border-[#26262D]">
                    {agent.category}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isDeployed
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {isDeployed ? 'RUNNING' : 'STANDBY'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#C9A6FF]" />
                    <span>{agent.name}</span>
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mt-1.5">
                    {agent.description}
                  </p>
                </div>

                <div className="p-3 bg-[#0A0A0C] rounded-2xl border border-[#26262D] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase text-neutral-500 font-semibold">Target APY</div>
                    <div className="text-lg font-black font-mono text-emerald-400">{agent.apy}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase text-neutral-500 font-semibold">Yield Rate</div>
                    <div className="text-xs font-mono font-bold text-[#F3BA2F]">{agent.dailyYield}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleDeploy(agent.id)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  isDeployed
                    ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    : 'bg-[#7A12F5] hover:bg-[#8C38F7] text-white shadow-md shadow-[#7A12F5]/20'
                }`}
              >
                {isDeployed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pause Execution</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Deploy Agent</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

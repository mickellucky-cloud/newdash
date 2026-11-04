'use client';

import React, { useState } from 'react';
import { useAppStore, TaskItem } from '@/lib/store/useAppStore';
import { Check, ArrowRight, Zap, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function TasksList() {
  const { tasks, completeTask, isConnected, setWalletModalOpen } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'daily' | 'community' | 'onchain'>('all');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true;
    return t.category === filter;
  });

  const handleTaskClick = (task: TaskItem) => {
    if (!isConnected) {
      setWalletModalOpen(true);
      return;
    }

    if (task.completed) {
      toast.info('Task already completed!');
      return;
    }

    if (task.actionUrl) {
      window.open(task.actionUrl, '_blank');
    }

    completeTask(task.id);
    toast.success(`Completed "${task.title}"! +${task.reward} $OKN credited.`);
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border border-[#26262D] space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#26262D]/60">
        <div>
          <h3 className="text-lg font-bold text-white">Missions & Bounty Rewards</h3>
          <p className="text-xs text-neutral-400">Complete tasks to unlock token allocations and gas rebates</p>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0A0A0C] border border-[#26262D] rounded-xl self-start sm:self-auto">
          {(['all', 'daily', 'community', 'onchain'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-[#7A12F5] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab === 'onchain' ? 'On-Chain' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Task list items */}
      <div className="space-y-2.5">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => handleTaskClick(task)}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
              task.completed
                ? 'bg-[#1B1B20]/40 border-emerald-500/20 opacity-80'
                : 'bg-[#1B1B20] hover:bg-[#26262D] border-[#26262D] hover:border-[#7A12F5]/50'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  task.completed
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-[#7A12F5]/15 text-[#C9A6FF] group-hover:bg-[#7A12F5] group-hover:text-white transition-colors'
                }`}
              >
                {task.completed ? <Check className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
              </div>
              <div>
                <h4
                  className={`text-sm font-semibold transition-colors ${
                    task.completed ? 'text-neutral-300 line-through' : 'text-white group-hover:text-[#C9A6FF]'
                  }`}
                >
                  {task.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-mono font-bold text-[#F3BA2F]">
                    +{task.reward} $OKN
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-neutral-500 px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800">
                    {task.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {task.completed ? (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  Done
                </span>
              ) : (
                <button className="px-3 py-1.5 rounded-xl bg-[#7A12F5]/20 group-hover:bg-[#7A12F5] text-[#C9A6FF] group-hover:text-white text-xs font-semibold flex items-center gap-1 transition-all">
                  <span>Start</span>
                  {task.actionUrl ? (
                    <ExternalLink className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { AlertCircle, Calendar, CheckCircle2, ShieldCheck, TrendingDown, Wallet, Zap } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupee } from '../../utils/currency';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Card } from '../ui/Card';

export const SafeSpendHero: React.FC = () => {
  const { metrics, plan } = useFinance();

  const isOverAllocated = metrics.allocationGap < 0;
  const committedTotal = metrics.upcomingEssentialsTotal + metrics.upcomingSubscriptionsTotal;

  return (
    <div className="space-y-4">
      {/* Primary Hero Card: "How much money can I safely spend?" */}
      <div
        data-animate="hero"
        className="relative overflow-hidden rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-app)] p-6 md:p-8 shadow-[var(--shadow-md)]"
      >
        {/* Luminous multi-color ambient lighting mesh */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--accent-primary)] animate-pulse shadow-sm shadow-emerald-400" />
              <span className="text-xs uppercase tracking-wider font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Safe Daily Burn Engine
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] bg-[var(--bg-surface-elevated)] px-3 py-1 rounded-full border border-[var(--border-subtle)] shadow-sm">
              <Calendar size={13} className="text-[var(--accent-primary)]" />
              <span>
                {metrics.daysRemaining} days remaining in {plan.monthName.split(' ')[0]}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Big Focus: Today's Safe Spending */}
            <div className="lg:col-span-7">
              <span className="text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)] block mb-1">
                How much money can I safely spend today?
              </span>
              <div className="flex items-baseline gap-2">
                <AnimatedNumber
                  value={metrics.safeDailySpend}
                  className="text-4xl sm:text-6xl font-black tracking-tight text-[var(--accent-primary)]"
                />
                <span className="text-[var(--text-muted)] font-medium text-sm sm:text-lg">/ day</span>
              </div>

              {/* Explainability Breakdown */}
              <div className="mt-4 p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)]/90 border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-[var(--text-muted)]">Remaining:</span>
                  <span className="text-[var(--text-primary)] font-bold">
                    {formatRupee(metrics.remainingMoney)}
                  </span>
                </div>
                <span className="text-[var(--text-muted)]">−</span>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <span>Commitments:</span>
                  <span className="font-bold">{formatRupee(committedTotal)}</span>
                </div>
                <span className="text-[var(--text-muted)]">=</span>
                <div className="flex items-center gap-1.5 text-[var(--accent-primary)] font-bold">
                  <span>Flexible:</span>
                  <span>{formatRupee(metrics.flexibleMoney)}</span>
                </div>
              </div>
            </div>

            {/* Right Mini Status & Weekly Target */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* This Week Burn */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--bg-surface-elevated)] to-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1.5">
                  <span className="flex items-center gap-1">
                    <TrendingDown size={14} className="text-cyan-400" />
                    Last 7 Days
                  </span>
                  <span className="font-mono text-[var(--text-secondary)]">
                    {formatRupee(metrics.weeklySpent)}
                  </span>
                </div>
                <div className="text-lg font-bold font-mono text-[var(--text-primary)]">
                  <AnimatedNumber value={metrics.weeklySpent} />
                  <span className="text-xs text-[var(--text-muted)] font-normal ml-1">
                    / {formatRupee(metrics.weeklyBudget)} safe
                  </span>
                </div>
                <div className="w-full bg-[var(--bg-surface)] h-2 rounded-full mt-2 overflow-hidden border border-[var(--border-subtle)]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      metrics.weeklySpent > metrics.weeklyBudget
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                        : 'bg-gradient-to-r from-teal-400 to-emerald-400'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        metrics.weeklyBudget > 0 ? (metrics.weeklySpent / metrics.weeklyBudget) * 100 : 0
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Month Forecast */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--bg-surface-elevated)] to-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1.5">
                  <span className="flex items-center gap-1">
                    <Zap
                      size={14}
                      className={metrics.isOverBudgetProjected ? 'text-amber-400' : 'text-emerald-400'}
                    />
                    Projected Spend
                  </span>
                </div>
                <div className="text-lg font-bold font-mono text-[var(--text-primary)]">
                  <AnimatedNumber value={metrics.projectedMonthEndSpend} />
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px]">
                  {metrics.isOverBudgetProjected ? (
                    <span className="text-amber-400 font-medium flex items-center gap-1">
                      <AlertCircle size={12} />
                      Exceeds by {formatRupee(metrics.projectedMonthEndSpend - metrics.availableMoney)}
                    </span>
                  ) : (
                    <span className="text-[var(--accent-primary)] font-medium flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      On track with plan
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Financial Stat Cards with Vibrant Themed Accents */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Available Money - Emerald Theme */}
        <Card
          interactive
          animate
          className="border-t-2 border-t-emerald-500 bg-gradient-to-b from-emerald-500/[0.08] via-[var(--bg-surface)] to-[var(--bg-surface)] hover:border-emerald-500/50"
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
            <span className="font-medium">Available Balance</span>
            <div className="p-1 rounded-lg bg-emerald-500/15 text-emerald-400">
              <Wallet size={14} />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black font-mono text-[var(--text-primary)]">
            <AnimatedNumber value={metrics.remainingMoney} />
          </div>
          <div className="text-[11px] text-emerald-400/80 font-medium mt-1">
            Current unspent pool
          </div>
        </Card>

        {/* Monthly Money Inflow - Cyan Theme */}
        <Card
          interactive
          animate
          className="border-t-2 border-t-cyan-500 bg-gradient-to-b from-cyan-500/[0.08] via-[var(--bg-surface)] to-[var(--bg-surface)] hover:border-cyan-500/50"
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
            <span className="font-medium">Monthly Inflow</span>
            <div className="p-1 rounded-lg bg-cyan-500/15 text-cyan-400">
              <Zap size={14} />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black font-mono text-[var(--text-primary)]">
            <AnimatedNumber value={plan.availableMoney} />
          </div>
          <div className="text-[11px] text-cyan-400/80 font-medium mt-1">
            Budget for {plan.monthName.split(' ')[0]}
          </div>
        </Card>

        {/* Allocated - Violet Theme */}
        <Card
          interactive
          animate
          className={`border-t-2 ${
            isOverAllocated ? 'border-t-rose-500' : 'border-t-purple-500'
          } bg-gradient-to-b from-purple-500/[0.08] via-[var(--bg-surface)] to-[var(--bg-surface)] hover:border-purple-500/50`}
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
            <span className="font-medium">Allocated</span>
            {isOverAllocated ? (
              <span className="text-[10px] font-bold text-rose-400 uppercase bg-rose-500/15 px-1 rounded">Over</span>
            ) : (
              <div className="p-1 rounded-lg bg-purple-500/15 text-purple-400">
                <ShieldCheck size={14} />
              </div>
            )}
          </div>
          <div
            className={`text-xl md:text-2xl font-black font-mono ${
              isOverAllocated ? 'text-rose-400' : 'text-[var(--text-primary)]'
            }`}
          >
            <AnimatedNumber value={metrics.totalAllocated} />
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">
            {isOverAllocated
              ? `⚠️ Exceeds by ${formatRupee(Math.abs(metrics.allocationGap))}`
              : `${formatRupee(metrics.allocationGap)} unallocated`}
          </div>
        </Card>

        {/* Total Spent So Far - Amber Theme */}
        <Card
          interactive
          animate
          className="border-t-2 border-t-amber-500 bg-gradient-to-b from-amber-500/[0.08] via-[var(--bg-surface)] to-[var(--bg-surface)] hover:border-amber-500/50"
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
            <span className="font-medium">Spent So Far</span>
            <div className="p-1 rounded-lg bg-amber-500/15 text-amber-400">
              <TrendingDown size={14} />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black font-mono text-[var(--text-primary)]">
            <AnimatedNumber value={metrics.totalSpentThisMonth} />
          </div>
          <div className="text-[11px] text-amber-400/80 font-medium mt-1">
            {plan.availableMoney > 0
              ? `${Math.round((metrics.totalSpentThisMonth / plan.availableMoney) * 100)}% of month budget`
              : '0%'}
          </div>
        </Card>
      </div>
    </div>
  );
};

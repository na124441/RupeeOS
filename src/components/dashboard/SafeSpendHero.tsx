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
        {/* Subtle ambient lighting accent */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-[var(--accent-glow)] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
              <span className="text-xs uppercase tracking-wider font-bold text-[var(--accent-primary)]">
                Safe Daily Burn Engine
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] bg-[var(--bg-surface-elevated)] px-3 py-1 rounded-full border border-[var(--border-subtle)]">
              <Calendar size={13} className="text-[var(--text-muted)]" />
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
                  className="text-4xl sm:text-6xl font-black text-[var(--accent-primary)] tracking-tight"
                />
                <span className="text-[var(--text-muted)] font-medium text-sm sm:text-lg">/ day</span>
              </div>

              {/* Explainability Breakdown */}
              <div className="mt-4 p-3 rounded-2xl bg-[var(--bg-app)]/80 border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono">
                <div className="flex items-center gap-1">
                  <span className="text-[var(--text-muted)]">Remaining:</span>
                  <span className="text-[var(--text-primary)] font-bold">
                    {formatRupee(metrics.remainingMoney)}
                  </span>
                </div>
                <span className="text-[var(--text-muted)]">−</span>
                <div className="flex items-center gap-1 text-amber-500/90">
                  <span>Upcoming Commitments:</span>
                  <span className="font-bold">{formatRupee(committedTotal)}</span>
                </div>
                <span className="text-[var(--text-muted)]">=</span>
                <div className="flex items-center gap-1 text-[var(--accent-primary)] font-bold">
                  <span>Flexible:</span>
                  <span>{formatRupee(metrics.flexibleMoney)}</span>
                </div>
              </div>
            </div>

            {/* Right Mini Status & Weekly Target */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* This Week Burn */}
              <div className="p-4 rounded-2xl bg-[var(--bg-app)]/70 border border-[var(--border-subtle)]">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1.5">
                  <span className="flex items-center gap-1">
                    <TrendingDown size={14} className="text-[var(--accent-primary)]" />
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
                <div className="w-full bg-[var(--bg-surface-elevated)] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      metrics.weeklySpent > metrics.weeklyBudget ? 'bg-amber-500' : 'bg-[var(--accent-primary)]'
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
              <div className="p-4 rounded-2xl bg-[var(--bg-app)]/70 border border-[var(--border-subtle)]">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1.5">
                  <span className="flex items-center gap-1">
                    <Zap
                      size={14}
                      className={metrics.isOverBudgetProjected ? 'text-amber-500' : 'text-[var(--accent-primary)]'}
                    />
                    Projected Month-End
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

      {/* 4 Financial Stat Cards with subtle hover elevation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Available Money */}
        <Card interactive animate variant="surface">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
            <span>Available Balance</span>
            <Wallet size={15} className="text-[var(--accent-primary)]" />
          </div>
          <div className="text-xl md:text-2xl font-black font-mono text-[var(--text-primary)]">
            <AnimatedNumber value={metrics.remainingMoney} />
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">
            Current unspent funds
          </div>
        </Card>

        {/* Monthly Money Inflow */}
        <Card interactive animate variant="surface">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
            <span>Monthly Money</span>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">Total</span>
          </div>
          <div className="text-xl md:text-2xl font-black font-mono text-[var(--text-primary)]">
            <AnimatedNumber value={plan.availableMoney} />
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">
            Set for {plan.monthName.split(' ')[0]}
          </div>
        </Card>

        {/* Allocated */}
        <Card interactive animate variant="surface">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
            <span>Allocated</span>
            {isOverAllocated ? (
              <span className="text-[10px] font-bold text-rose-400 uppercase bg-rose-500/10 px-1 rounded">Over</span>
            ) : (
              <ShieldCheck size={15} className="text-[var(--accent-primary)]" />
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

        {/* Total Spent So Far */}
        <Card interactive animate variant="surface">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
            <span>Spent So Far</span>
            <TrendingDown size={15} className="text-amber-500" />
          </div>
          <div className="text-xl md:text-2xl font-black font-mono text-[var(--text-primary)]">
            <AnimatedNumber value={metrics.totalSpentThisMonth} />
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">
            {plan.availableMoney > 0
              ? `${Math.round((metrics.totalSpentThisMonth / plan.availableMoney) * 100)}% of monthly money`
              : '0%'}
          </div>
        </Card>
      </div>
    </div>
  );
};

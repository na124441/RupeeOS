import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, HelpCircle, Info, Sparkles, TrendingDown, Wallet, Zap } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupee } from '../../utils/currency';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Card } from '../ui/Card';

export const SafeSpendHero: React.FC = () => {
  const { metrics, plan } = useFinance();
  const [showCalculationDetails, setShowCalculationDetails] = useState(false);

  const committedTotal = metrics.upcomingEssentialsTotal + metrics.upcomingSubscriptionsTotal;
  const spentPercent = plan.availableMoney > 0 ? Math.min(100, Math.round((metrics.totalSpentThisMonth / plan.availableMoney) * 100)) : 0;

  return (
    <div className="space-y-4">
      {/* Primary Clean Daily Hero Card */}
      <div
        data-animate="hero"
        className="relative overflow-hidden rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-app)] p-6 md:p-8 shadow-[var(--shadow-md)]"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header Row: Label & Days Remaining */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                Daily Spending Guide
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] bg-[var(--bg-surface-elevated)] px-3 py-1 rounded-full border border-[var(--border-subtle)]">
              <Calendar size={13} className="text-[var(--accent-primary)]" />
              <span>
                {metrics.daysRemaining} days left in {plan.monthName.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Main Hero Focus: Big Number & Plain English Advice */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-2">
            <div>
              <h2 className="text-sm font-medium text-[var(--text-muted)]">
                You can safely spend today:
              </h2>
              <div className="flex items-baseline gap-2 mt-1">
                <AnimatedNumber
                  value={metrics.safeDailySpend}
                  className="text-4xl sm:text-6xl font-black tracking-tight text-[var(--accent-primary)] font-mono"
                />
                <span className="text-base sm:text-xl font-normal text-[var(--text-muted)]">/ day</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                Spend up to this amount daily and you will finish the month right on budget.
              </p>
            </div>

            {/* Quick Status Pill */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => setShowCalculationDetails(!showCalculationDetails)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-hover)] bg-[var(--accent-surface)] px-3.5 py-2 rounded-xl border border-[var(--border-accent)] transition-all w-fit"
              >
                <HelpCircle size={14} />
                <span>How is this calculated?</span>
                {showCalculationDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          {/* Collapsible Easy-to-Understand Calculation Breakdown */}
          {showCalculationDetails && (
            <div className="mt-4 p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
                <Info size={15} className="text-[var(--accent-primary)]" />
                <span>Simple 3-Step Math:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                  <span className="text-[11px] text-[var(--text-muted)] block">1. Total Available Now</span>
                  <span className="font-bold text-sm font-mono text-[var(--text-primary)]">{formatRupee(metrics.remainingMoney)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                  <span className="text-[11px] text-[var(--text-muted)] block">2. Minus Bills & Essentials</span>
                  <span className="font-bold text-sm font-mono text-amber-400">− {formatRupee(committedTotal)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                  <span className="text-[11px] text-[var(--text-muted)] block">3. Divided by Remaining Days</span>
                  <span className="font-bold text-sm font-mono text-[var(--accent-primary)]">÷ {metrics.daysRemaining} days</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3 Clear, High-Level Financial Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Available Balance */}
        <Card interactive className="p-5 border-t-2 border-t-emerald-500 bg-gradient-to-b from-emerald-500/[0.06] via-[var(--bg-surface)] to-[var(--bg-surface)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1.5">
            <span className="font-semibold text-[var(--text-primary)]">Available Balance</span>
            <div className="p-1 rounded-lg bg-emerald-500/15 text-emerald-400">
              <Wallet size={15} />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[var(--text-primary)]">
            <AnimatedNumber value={metrics.remainingMoney} />
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Total unspent money in your pocket today
          </p>
        </Card>

        {/* Card 2: Spent This Month */}
        <Card interactive className="p-5 border-t-2 border-t-amber-500 bg-gradient-to-b from-amber-500/[0.06] via-[var(--bg-surface)] to-[var(--bg-surface)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1.5">
            <span className="font-semibold text-[var(--text-primary)]">Spent This Month</span>
            <div className="p-1 rounded-lg bg-amber-500/15 text-amber-400">
              <TrendingDown size={15} />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[var(--text-primary)]">
            <AnimatedNumber value={metrics.totalSpentThisMonth} />
          </div>
          <div className="mt-2 w-full bg-[var(--bg-app)] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${spentPercent > 90 ? 'bg-rose-500' : 'bg-amber-400'}`}
              style={{ width: `${spentPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
            {spentPercent}% of your {formatRupee(plan.availableMoney)} monthly plan
          </p>
        </Card>

        {/* Card 3: Planned Savings & Reserves */}
        <Card interactive className="p-5 border-t-2 border-t-cyan-500 bg-gradient-to-b from-cyan-500/[0.06] via-[var(--bg-surface)] to-[var(--bg-surface)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1.5">
            <span className="font-semibold text-[var(--text-primary)]">Planned Savings</span>
            <div className="p-1 rounded-lg bg-cyan-500/15 text-cyan-400">
              <Sparkles size={15} />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[var(--text-primary)]">
            <AnimatedNumber value={(plan.allocations.savings || 0) + (plan.allocations.emergency || 0)} />
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Protected savings & emergency reserve
          </p>
        </Card>
      </div>
    </div>
  );
};

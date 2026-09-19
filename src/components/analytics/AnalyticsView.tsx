import React, { useEffect, useRef } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CategoryId } from '../../types';
import { CATEGORY_MAP } from '../../constants/categories';
import { formatRupee } from '../../utils/currency';
import { CategoryIcon } from '../common/CategoryIcon';
import {
  Activity,
  HeartPulse,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { animatePageEntrance } from '../../lib/animations/entrance';

export const AnalyticsView: React.FC = () => {
  const { plan, metrics, healthScore, transactions, activeMonth } = useFinance();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = animatePageEntrance(containerRef.current);
    return () => {
      tl?.kill();
    };
  }, []);

  const monthExpenses = transactions.filter(
    (t) => t.date.startsWith(activeMonth) && t.type === 'expense'
  );

  // Category breakdown
  const categorySpentMap: Partial<Record<CategoryId, number>> = {};
  for (const t of monthExpenses) {
    categorySpentMap[t.categoryId] = (categorySpentMap[t.categoryId] || 0) + t.amount;
  }

  const sortedCategories = (Object.keys(categorySpentMap) as CategoryId[]).sort(
    (a, b) => (categorySpentMap[b] || 0) - (categorySpentMap[a] || 0)
  );

  // Essential vs Discretionary
  let essentialSpend = 0;
  let discretionarySpend = 0;
  for (const t of monthExpenses) {
    if (CATEGORY_MAP[t.categoryId]?.isEssential || t.categoryId === 'bills') {
      essentialSpend += t.amount;
    } else if (!CATEGORY_MAP[t.categoryId]?.isSavings) {
      discretionarySpend += t.amount;
    }
  }
  const totalLivingSpend = essentialSpend + discretionarySpend;
  const essentialPercent =
    totalLivingSpend > 0 ? Math.round((essentialSpend / totalLivingSpend) * 100) : 0;
  const discretionaryPercent = 100 - essentialPercent;

  // Largest expense
  let largestExpense = 0;
  let largestExpenseNote = 'None';
  for (const t of monthExpenses) {
    if (t.amount > largestExpense) {
      largestExpense = t.amount;
      largestExpenseNote = t.note || t.categoryId;
    }
  }

  // Most frequent merchant
  const merchantCountMap: Record<string, number> = {};
  for (const t of monthExpenses) {
    const merchant = t.merchant || t.note || 'Other';
    merchantCountMap[merchant] = (merchantCountMap[merchant] || 0) + 1;
  }
  let mostFrequentMerchant = 'None';
  let maxCount = 0;
  for (const [m, count] of Object.entries(merchantCountMap)) {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentMerchant = m;
    }
  }

  // Weekly breakdown
  const weeklyTotals = [0, 0, 0, 0];
  for (const t of monthExpenses) {
    const day = parseInt(t.date.split('-')[2], 10);
    if (day <= 7) weeklyTotals[0] += t.amount;
    else if (day <= 14) weeklyTotals[1] += t.amount;
    else if (day <= 21) weeklyTotals[2] += t.amount;
    else weeklyTotals[3] += t.amount;
  }
  const maxWeekly = Math.max(...weeklyTotals, 1);

  // Average daily spend
  const avgDailySpend =
    metrics.daysElapsed > 0 ? Math.round(metrics.totalSpentThisMonth / metrics.daysElapsed) : 0;

  // Savings rate
  const savingsAllocated = (plan.allocations.savings || 0) + (plan.allocations.emergency || 0);
  const savingsRate =
    plan.availableMoney > 0 ? Math.round((savingsAllocated / plan.availableMoney) * 100) : 0;

  return (
    <div ref={containerRef} className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
          Intelligence & Scoring
        </span>
        <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2.5 mt-0.5">
          <Activity size={24} className="text-[var(--accent-primary)]" />
          <span>Analytics & Financial Health</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Deep behavioral metrics, explainable financial health scoring, and velocity modeling.
        </p>
      </div>

      {/* Financial Health Score Hero (0-100) */}
      <Card
        variant="surface"
        className="p-6 md:p-8 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-surface-elevated)] border-[var(--border-accent)] shadow-[var(--shadow-md)] space-y-6 relative overflow-hidden"
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent-surface)] border border-[var(--border-accent)] flex items-center justify-center text-[var(--accent-primary)] shadow-sm">
              <HeartPulse size={32} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-[var(--text-muted)]">
                Personal Metric
              </span>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Financial Health Score</h3>
              <p className="text-xs text-[var(--accent-primary)] font-semibold mt-0.5">
                Rating: {healthScore.rating}
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-1">
            <AnimatedNumber
              value={healthScore.score}
              isCurrency={false}
              className="text-4xl sm:text-5xl font-black font-mono text-[var(--accent-primary)]"
            />
            <span className="text-sm font-medium text-[var(--text-muted)]">/ 100</span>
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-3xl">
          {healthScore.summary}
        </p>

        {/* Breakdown bar */}
        <div className="space-y-2 relative z-10">
          <div className="w-full bg-[var(--bg-app)] rounded-full h-3 overflow-hidden p-0.5 border border-[var(--border-subtle)]">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
              style={{ width: `${healthScore.score}%` }}
            />
          </div>

          {/* Factor Breakdown Chips */}
          <div className="space-y-2 pt-3 border-t border-[var(--border-subtle)]">
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--text-muted)]">
              Score Factor Breakdown
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {healthScore.factors.map((f, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-[var(--bg-app)]/80 border border-[var(--border-subtle)] flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          f.impact === 'positive'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : f.impact === 'negative'
                            ? 'bg-rose-500/15 text-rose-400'
                            : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]'
                        }`}
                      >
                        {f.impact === 'positive' ? `+${f.score}` : `${f.score}`} pts
                      </span>
                      <h5 className="text-xs font-semibold text-[var(--text-primary)]">{f.name}</h5>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1">{f.description}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0">
                    Max {f.maxScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Key Metrics Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card interactive className="border-t-2 border-t-cyan-500 bg-gradient-to-b from-cyan-500/[0.06] via-[var(--bg-surface)] to-[var(--bg-surface)]">
          <span className="text-xs text-[var(--text-muted)]">Avg Daily Spend</span>
          <div className="text-xl font-bold font-mono text-[var(--text-primary)] mt-1">
            <AnimatedNumber value={avgDailySpend} />
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">Over {metrics.daysElapsed} days elapsed</span>
        </Card>

        <Card interactive className="border-t-2 border-t-emerald-500 bg-gradient-to-b from-emerald-500/[0.06] via-[var(--bg-surface)] to-[var(--bg-surface)]">
          <span className="text-xs text-[var(--text-muted)]">Savings Rate</span>
          <div className="text-xl font-bold font-mono text-[var(--accent-primary)] mt-1">
            <AnimatedNumber value={savingsRate} isCurrency={false} suffix="%" />
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">Dedicated to future & reserve</span>
        </Card>

        <Card interactive className="border-t-2 border-t-amber-500 bg-gradient-to-b from-amber-500/[0.06] via-[var(--bg-surface)] to-[var(--bg-surface)]">
          <span className="text-xs text-[var(--text-muted)]">Largest Expense</span>
          <div className="text-xl font-bold font-mono text-[var(--text-primary)] mt-1">
            <AnimatedNumber value={largestExpense} />
          </div>
          <span className="text-[10px] text-[var(--text-muted)] truncate block">{largestExpenseNote}</span>
        </Card>

        <Card interactive className="border-t-2 border-t-purple-500 bg-gradient-to-b from-purple-500/[0.06] via-[var(--bg-surface)] to-[var(--bg-surface)]">
          <span className="text-xs text-[var(--text-muted)]">Top Merchant</span>
          <div className="text-lg font-bold text-[var(--text-primary)] mt-1 truncate">
            {mostFrequentMerchant}
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">{maxCount} transactions</span>
        </Card>
      </div>

      {/* Essential vs Discretionary Split */}
      <Card variant="surface" className="p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
              Composition
            </span>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Essential Commitments vs Discretionary Lifestyle
            </h3>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            {formatRupee(essentialSpend)} / {formatRupee(discretionarySpend)}
          </span>
        </div>

        <div className="w-full bg-[var(--bg-app)] rounded-full h-3.5 overflow-hidden flex border border-[var(--border-subtle)]">
          <div
            className="bg-[var(--accent-primary)] h-full transition-all duration-700"
            style={{ width: `${essentialPercent}%` }}
            title={`Essentials: ${essentialPercent}%`}
          />
          <div
            className="bg-cyan-500 h-full transition-all duration-700"
            style={{ width: `${discretionaryPercent}%` }}
            title={`Discretionary: ${discretionaryPercent}%`}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)]" />
            Essentials & Bills: <strong className="text-[var(--text-primary)]">{essentialPercent}%</strong> ({formatRupee(essentialSpend)})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            Discretionary: <strong className="text-[var(--text-primary)]">{discretionaryPercent}%</strong> ({formatRupee(discretionarySpend)})
          </span>
        </div>
      </Card>

      {/* Weekly Burn Rate Velocity */}
      <Card variant="surface" data-animate="chart" className="p-6 md:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
              Trajectory
            </span>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Weekly Spend Velocity
            </h3>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-mono">Month-to-date distribution</span>
        </div>

        <div className="grid grid-cols-4 gap-4 items-end h-44 pt-4">
          {weeklyTotals.map((total, idx) => {
            const heightPercent = maxWeekly > 0 ? Math.max(12, Math.round((total / maxWeekly) * 100)) : 12;
            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[11px] font-mono text-[var(--text-muted)] font-semibold tabular-nums">
                  {formatRupee(total, true)}
                </span>
                <div className="w-full max-w-[56px] bg-[var(--bg-app)] rounded-2xl overflow-hidden p-1 flex items-end h-full border border-[var(--border-subtle)]">
                  <div
                    className="w-full bg-gradient-to-t from-[var(--accent-primary)] to-emerald-400 rounded-xl transition-all duration-700 ease-out"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-[var(--text-muted)]">Week {idx + 1}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import { SafeSpendHero } from './SafeSpendHero';
import { QuickActionButtons } from './QuickActionButtons';
import { BudgetOverviewBar } from './BudgetOverviewBar';
import { AlertsBanner } from './AlertsBanner';
import { useFinance } from '../../context/FinanceContext';
import { ActiveTab } from '../layout/Sidebar';
import { ArrowRight, ChevronRight, ShoppingCart, Sparkles } from 'lucide-react';
import { formatRupee } from '../../utils/currency';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatDisplayDate } from '../../utils/dates';
import { animatePageEntrance } from '../../lib/animations/entrance';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';

interface DashboardViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenExpense: () => void;
  onOpenIncome: () => void;
  onOpenEssential: () => void;
  onOpenMoveMoney: () => void;
  onOpenSimulator: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenExpense,
  onOpenIncome,
  onOpenEssential,
  onOpenMoveMoney,
  onOpenSimulator,
}) => {
  const { transactions, essentials, activeMonth } = useFinance();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = animatePageEntrance(containerRef.current);
    return () => {
      tl?.kill();
    };
  }, []);

  // Recent transactions (last 4 for clean layout)
  const recentTransactions = transactions
    .filter((t) => t.date.startsWith(activeMonth))
    .slice(0, 4);

  // Unpurchased essentials (up to 3)
  const pendingEssentials = essentials
    .filter((e) => e.monthKey === activeMonth && !e.isPurchased)
    .slice(0, 3);

  return (
    <div ref={containerRef} className="space-y-6 max-w-6xl mx-auto">
      {/* Active Alerts */}
      <AlertsBanner onNavigateTab={onNavigateTab} />

      {/* Top Header: Simple Welcome & Main Quick Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Real-time daily guidance & monthly spending plan
          </p>
        </div>

        <QuickActionButtons
          onOpenExpense={onOpenExpense}
          onOpenIncome={onOpenIncome}
          onOpenEssential={onOpenEssential}
          onOpenMoveMoney={onOpenMoveMoney}
          onOpenSimulator={onOpenSimulator}
        />
      </div>

      {/* Hero: "How much money can I safely spend?" */}
      <SafeSpendHero />

      {/* Simple Budget Overview */}
      <BudgetOverviewBar onSelectCategory={() => onNavigateTab('expenses')} />

      {/* Split Grid: Recent Activity & Shopping Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Activity */}
        <Card className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Recent Expenses
              </h3>
              <span className="text-[11px] text-[var(--text-muted)]">
                Latest transactions this month
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('expenses')}
              className="text-xs text-[var(--accent-primary)] hover:text-[var(--accent-hover)] font-semibold flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          <div className="divide-y divide-[var(--border-subtle)]">
            {recentTransactions.length === 0 ? (
              <EmptyState
                icon={<Sparkles size={20} />}
                title="No expenses logged yet"
                description="Your recent spending timeline will appear here once you log an expense."
                actionLabel="+ Add Expense"
                onAction={onOpenExpense}
              />
            ) : (
              recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="py-2.5 flex items-center justify-between gap-3 group hover:bg-[var(--bg-surface-elevated)]/40 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CategoryIcon categoryId={tx.categoryId} size={15} showBg={true} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[var(--text-primary)]">
                          {tx.note || tx.categoryId}
                        </span>
                        {tx.merchant && (
                          <span className="text-[10px] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)] font-medium">
                            {tx.merchant}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)] font-mono">
                        {formatDisplayDate(tx.date)}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`text-xs font-mono font-bold tabular-nums ${
                      tx.type === 'income' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatRupee(tx.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Right: Upcoming Essentials Checklist Snapshot */}
        <Card className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} className="text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Upcoming Essentials
                </h3>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Planned groceries & shopping
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('essentials')}
              className="text-xs text-[var(--accent-primary)] hover:text-[var(--accent-hover)] font-semibold flex items-center gap-1 transition-colors"
            >
              Checklist <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingEssentials.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-center">
                <span className="text-xs text-[var(--accent-primary)] font-semibold">
                  All planned monthly essentials purchased! 🎉
                </span>
              </div>
            ) : (
              pendingEssentials.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigateTab('essentials')}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-all cursor-pointer hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <div>
                      <h5 className="text-xs font-semibold text-[var(--text-primary)]">{item.name}</h5>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {item.quantity} {item.unit} • via {item.preferredProvider}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[var(--text-primary)] tabular-nums">
                    {formatRupee(item.estimatedCost)}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

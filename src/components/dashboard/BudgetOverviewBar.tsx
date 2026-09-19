import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CategoryId } from '../../types';
import { CATEGORY_MAP } from '../../constants/categories';
import { formatRupee } from '../../utils/currency';
import { CategoryIcon } from '../common/CategoryIcon';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

interface BudgetOverviewBarProps {
  onSelectCategory?: (catId: CategoryId) => void;
}

export const BudgetOverviewBar: React.FC<BudgetOverviewBarProps> = ({ onSelectCategory }) => {
  const { plan, transactions, activeMonth } = useFinance();

  const categorySpent: Partial<Record<CategoryId, number>> = {};
  const monthExpenses = transactions.filter((t) => t.date.startsWith(activeMonth) && t.type === 'expense');

  for (const t of monthExpenses) {
    categorySpent[t.categoryId] = (categorySpent[t.categoryId] || 0) + t.amount;
  }

  const totalAllocated = Object.values(plan.allocations).reduce((a, b) => a + b, 0);
  const totalSpent = monthExpenses.reduce((a, b) => a + b.amount, 0);
  const totalRemaining = Math.max(0, totalAllocated - totalSpent);
  const overallPercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  // Semantic status
  const getBudgetStatus = (percentage: number) => {
    if (percentage > 100) {
      return {
        label: 'Over budget',
        icon: <AlertCircle size={13} className="text-rose-400" />,
        colorClass: 'bg-rose-500',
        badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      };
    }
    if (percentage >= 80) {
      return {
        label: 'Approaching limit',
        icon: <AlertTriangle size={13} className="text-amber-400" />,
        colorClass: 'bg-amber-500',
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      };
    }
    return {
      label: 'Healthy pace',
      icon: <CheckCircle2 size={13} className="text-[var(--accent-primary)]" />,
      colorClass: 'bg-[var(--accent-primary)]',
      badgeClass: 'bg-[var(--accent-surface)] text-[var(--accent-primary)] border-[var(--border-accent)]',
    };
  };

  const status = getBudgetStatus(overallPercentage);

  const activeCategories = (Object.keys(plan.allocations) as CategoryId[]).filter(
    (catId) => (plan.allocations[catId] || 0) > 0 || (categorySpent[catId] || 0) > 0
  );

  return (
    <div
      data-animate="chart"
      className="p-6 md:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-app)] shadow-[var(--shadow-sm)] space-y-6 relative overflow-hidden"
    >
      {/* Ambient gradient corner */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-teal-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Budget Adherence Engine
          </span>
          <h3 className="text-base font-bold text-[var(--text-primary)] mt-0.5">
            Monthly Budget & Allocations
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {formatRupee(totalSpent)} spent • {formatRupee(totalRemaining)} remaining of {formatRupee(totalAllocated)} total plan
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 shadow-sm ${status.badgeClass}`}>
            {status.icon}
            <span>{status.label}</span>
          </div>
          <span className="text-xl font-black font-mono text-[var(--text-primary)]">
            {overallPercentage}%
          </span>
        </div>
      </div>

      {/* Main Composite Progress Bar with Radiant Gradient */}
      <div className="w-full bg-[var(--bg-app)] rounded-full h-3 overflow-hidden p-0.5 border border-[var(--border-subtle)] relative z-10">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            overallPercentage > 100
              ? 'bg-gradient-to-r from-rose-500 to-red-600'
              : overallPercentage >= 80
              ? 'bg-gradient-to-r from-amber-400 to-orange-500'
              : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400'
          }`}
          style={{ width: `${Math.min(100, overallPercentage)}%` }}
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1 relative z-10">
        {activeCategories.map((catId) => {
          const cat = CATEGORY_MAP[catId] || CATEGORY_MAP.other;
          const allocated = plan.allocations[catId] || 0;
          const spent = categorySpent[catId] || 0;
          const remaining = allocated - spent;
          const percent = allocated > 0 ? Math.min(100, Math.round((spent / allocated) * 100)) : 0;
          const isOver = spent > allocated && allocated > 0;
          const catStatus = getBudgetStatus(allocated > 0 ? Math.round((spent / allocated) * 100) : 0);

          return (
            <div
              key={catId}
              onClick={() => onSelectCategory && onSelectCategory(catId)}
              className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)]/50 border border-[var(--border-subtle)] hover:border-[var(--border-accent)] hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <CategoryIcon categoryId={catId} size={15} showBg={true} />
                  <div>
                    <h4 className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                      {cat.name.split('&')[0].trim()}
                    </h4>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">
                      {formatRupee(spent)} / {formatRupee(allocated)}
                    </span>
                  </div>
                </div>
                <span className={`text-xs font-mono font-bold ${
                  isOver ? 'text-rose-400' : percent >= 80 ? 'text-amber-400' : 'text-[var(--text-muted)]'
                }`}>
                  {percent}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[var(--bg-app)] rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: isOver ? '#f43f5e' : cat.color || '#10b981',
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mt-2 font-mono">
                <span className="flex items-center gap-1">
                  {catStatus.icon}
                  <span>{isOver ? 'Over budget by' : 'Remaining'}</span>
                </span>
                <span className={isOver ? 'text-rose-400 font-bold' : 'text-[var(--text-secondary)] font-semibold'}>
                  {formatRupee(Math.abs(remaining))}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

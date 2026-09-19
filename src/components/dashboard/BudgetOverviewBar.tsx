import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CategoryId } from '../../types';
import { CATEGORY_MAP } from '../../constants/categories';
import { formatRupee } from '../../utils/currency';
import { CategoryIcon } from '../common/CategoryIcon';
import { CheckCircle2, AlertTriangle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface BudgetOverviewBarProps {
  onSelectCategory?: (catId: CategoryId) => void;
}

export const BudgetOverviewBar: React.FC<BudgetOverviewBarProps> = ({ onSelectCategory }) => {
  const { plan, transactions, activeMonth } = useFinance();
  const [showAllCategories, setShowAllCategories] = useState(false);

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
        badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      };
    }
    if (percentage >= 80) {
      return {
        label: 'Approaching limit',
        icon: <AlertTriangle size={13} className="text-amber-400" />,
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      };
    }
    return {
      label: 'On track',
      icon: <CheckCircle2 size={13} className="text-[var(--accent-primary)]" />,
      badgeClass: 'bg-[var(--accent-surface)] text-[var(--accent-primary)] border-[var(--border-accent)]',
    };
  };

  const status = getBudgetStatus(overallPercentage);

  const activeCategories = (Object.keys(plan.allocations) as CategoryId[])
    .filter((catId) => (plan.allocations[catId] || 0) > 0 || (categorySpent[catId] || 0) > 0)
    .sort((a, b) => (categorySpent[b] || 0) - (categorySpent[a] || 0));

  const visibleCategories = showAllCategories ? activeCategories : activeCategories.slice(0, 3);

  return (
    <div
      data-animate="chart"
      className="p-6 md:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-app)] shadow-[var(--shadow-sm)] space-y-5 relative overflow-hidden"
    >
      <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-[var(--text-muted)]">
            Monthly Budget
          </span>
          <h3 className="text-base font-bold text-[var(--text-primary)] mt-0.5">
            Spending & Envelopes
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {formatRupee(totalSpent)} spent • {formatRupee(totalRemaining)} remaining of {formatRupee(totalAllocated)} budget
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

      {/* Categories Grid - Focused on Top Categories */}
      {visibleCategories.length > 0 ? (
        <div className="space-y-3 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {visibleCategories.map((catId) => {
              const cat = CATEGORY_MAP[catId] || CATEGORY_MAP.other;
              const allocated = plan.allocations[catId] || 0;
              const spent = categorySpent[catId] || 0;
              const percent = allocated > 0 ? Math.min(100, Math.round((spent / allocated) * 100)) : 0;
              const isOver = spent > allocated && allocated > 0;

              return (
                <div
                  key={catId}
                  onClick={() => onSelectCategory && onSelectCategory(catId)}
                  className="p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)]/60 border border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-all cursor-pointer group hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CategoryIcon categoryId={catId} size={14} showBg={true} />
                      <h4 className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                        {cat.name.split('&')[0].trim()}
                      </h4>
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
                    <span>{formatRupee(spent)} spent</span>
                    <span>{formatRupee(allocated)} plan</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Toggle to view all categories if more than 3 */}
          {activeCategories.length > 3 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="w-full py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-primary)] bg-[var(--bg-surface-elevated)]/40 hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{showAllCategories ? 'Show top 3 categories' : `Show all ${activeCategories.length} categories`}</span>
              {showAllCategories ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-3 text-xs text-[var(--text-muted)]">
          No categories allocated yet this month.
        </div>
      )}
    </div>
  );
};

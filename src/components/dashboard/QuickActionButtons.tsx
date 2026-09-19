import React, { useState } from 'react';
import { ArrowRightLeft, Calculator, ChevronDown, MoreHorizontal, Plus, ShoppingCart, TrendingUp } from 'lucide-react';

interface QuickActionButtonsProps {
  onOpenExpense: () => void;
  onOpenIncome: () => void;
  onOpenEssential: () => void;
  onOpenMoveMoney: () => void;
  onOpenSimulator: () => void;
}

export const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  onOpenExpense,
  onOpenIncome,
  onOpenEssential,
  onOpenMoveMoney,
  onOpenSimulator,
}) => {
  const [showMoreActions, setShowMoreActions] = useState(false);

  return (
    <div className="flex items-center gap-2 relative">
      {/* Primary Prominent Action */}
      <button
        onClick={onOpenExpense}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 text-slate-950 shadow-md shadow-emerald-500/25 active:scale-95 transition-all min-h-[38px]"
      >
        <Plus size={16} strokeWidth={2.5} />
        <span>Add Expense</span>
      </button>

      {/* Secondary Common Action: Add Income */}
      <button
        onClick={onOpenIncome}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-app)] hover:border-cyan-500/40 shadow-sm active:scale-95 transition-all min-h-[38px]"
      >
        <TrendingUp size={15} className="text-cyan-400" />
        <span className="hidden sm:inline">Add</span> Income
      </button>

      {/* More Actions Dropdown Menu */}
      <div className="relative">
        <button
          onClick={() => setShowMoreActions(!showMoreActions)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-app)] transition-all min-h-[38px]"
          aria-label="More actions"
        >
          <span>More</span>
          <ChevronDown size={14} />
        </button>

        {showMoreActions && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMoreActions(false)} />
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-[var(--bg-surface)] border border-[var(--border-app)] rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  setShowMoreActions(false);
                  onOpenEssential();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] rounded-xl transition-colors"
              >
                <ShoppingCart size={15} className="text-amber-400" />
                <span>Plan Essential Item</span>
              </button>
              <button
                onClick={() => {
                  setShowMoreActions(false);
                  onOpenMoveMoney();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] rounded-xl transition-colors"
              >
                <ArrowRightLeft size={15} className="text-blue-400" />
                <span>Move Money</span>
              </button>
              <button
                onClick={() => {
                  setShowMoreActions(false);
                  onOpenSimulator();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] rounded-xl transition-colors"
              >
                <Calculator size={15} className="text-purple-400" />
                <span>"What If?" Purchase</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

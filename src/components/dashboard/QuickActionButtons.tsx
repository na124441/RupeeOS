import React from 'react';
import { ArrowRightLeft, Calculator, Plus, ShoppingCart, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';

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
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Primary Quick Expense with glowing emerald gradient */}
      <button
        onClick={onOpenExpense}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 text-slate-950 shadow-md shadow-emerald-500/25 active:scale-95 transition-all min-h-[34px]"
      >
        <Plus size={15} strokeWidth={2.5} />
        <span>Expense</span>
      </button>

      {/* Income with Cyan Tint */}
      <button
        onClick={onOpenIncome}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs bg-[var(--bg-surface-elevated)] hover:bg-cyan-500/10 text-[var(--text-primary)] border border-[var(--border-app)] hover:border-cyan-500/40 shadow-sm active:scale-95 transition-all min-h-[34px]"
      >
        <TrendingUp size={15} className="text-cyan-400" />
        <span>Income</span>
      </button>

      {/* What If Simulator with Violet Tint */}
      <button
        onClick={onOpenSimulator}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs bg-[var(--bg-surface-elevated)] hover:bg-violet-500/10 text-[var(--text-primary)] border border-[var(--border-app)] hover:border-violet-500/40 shadow-sm active:scale-95 transition-all min-h-[34px]"
      >
        <Calculator size={15} className="text-violet-400" />
        <span>What If?</span>
      </button>

      {/* Essential with Amber Tint */}
      <button
        onClick={onOpenEssential}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs bg-[var(--bg-surface-elevated)] hover:bg-amber-500/10 text-[var(--text-primary)] border border-[var(--border-app)] hover:border-amber-500/40 shadow-sm active:scale-95 transition-all min-h-[34px]"
      >
        <ShoppingCart size={15} className="text-amber-400" />
        <span>Essential</span>
      </button>

      {/* Move Money with Blue Tint */}
      <button
        onClick={onOpenMoveMoney}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs bg-[var(--bg-surface-elevated)] hover:bg-blue-500/10 text-[var(--text-primary)] border border-[var(--border-app)] hover:border-blue-500/40 shadow-sm active:scale-95 transition-all min-h-[34px]"
      >
        <ArrowRightLeft size={15} className="text-blue-400" />
        <span>Move Money</span>
      </button>
    </div>
  );
};

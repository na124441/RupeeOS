import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CategoryId } from '../../types';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import { formatRupee } from '../../utils/currency';
import { AlertCircle, AlertTriangle, ArrowRight, Calculator, CheckCircle2 } from 'lucide-react';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface WhatIfSimulatorProps {
  onRecordedExpense?: () => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ onRecordedExpense }) => {
  const { simulatePurchase, addTransaction } = useFinance();
  const [purchaseAmount, setPurchaseAmount] = useState('5000');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('shopping');
  const [purchaseNote, setPurchaseNote] = useState('');

  const numAmount = parseFloat(purchaseAmount) || 0;
  const result = simulatePurchase(numAmount, selectedCategory);

  const presets = [500, 1500, 3000, 5000, 10000];

  const handleRecordHypothetical = () => {
    if (numAmount <= 0) return;
    addTransaction({
      type: 'expense',
      amount: numAmount,
      categoryId: selectedCategory,
      note: purchaseNote.trim() || `Simulated Purchase: ${formatRupee(numAmount)}`,
      date: new Date().toISOString().split('T')[0],
    });
    alert(`Logged ${formatRupee(numAmount)} into ${selectedCategory}!`);
    if (onRecordedExpense) onRecordedExpense();
  };

  const getVerdictStyle = () => {
    switch (result.verdict) {
      case 'affordable':
        return {
          badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          border: 'border-emerald-500/30',
          bg: 'from-emerald-950/25 to-[var(--bg-surface)]',
          icon: <CheckCircle2 size={24} className="text-emerald-400" />,
          title: '🟢 Safely Affordable',
        };
      case 'tight':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          border: 'border-amber-500/30',
          bg: 'from-amber-950/25 to-[var(--bg-surface)]',
          icon: <AlertTriangle size={24} className="text-amber-400" />,
          title: '🟡 Possible, But Tight',
        };
      case 'not_recommended':
        return {
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          border: 'border-rose-500/30',
          bg: 'from-rose-950/25 to-[var(--bg-surface)]',
          icon: <AlertCircle size={24} className="text-rose-400" />,
          title: '🔴 Not Recommended',
        };
    }
  };

  const verdictStyle = getVerdictStyle();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
          Hypothetical Analysis
        </span>
        <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2.5 mt-0.5">
          <Calculator size={24} className="text-cyan-400" />
          <span>"What If?" Purchase Simulator</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Test any planned purchase before spending. Evaluate its impact on safe daily burn rate and category limits.
        </p>
      </div>

      {/* Input Form Card */}
      <Card variant="surface" className="p-6 md:p-8 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
            “I want to buy something for...”
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-mono font-black text-cyan-400 select-none">
              ₹
            </span>
            <input
              type="number"
              placeholder="0"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-2xl text-2xl md:text-3xl font-black font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/40 focus:outline-none tabular-nums"
            />
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPurchaseAmount(p.toString())}
                className="px-3.5 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs font-mono font-semibold text-[var(--text-secondary)] transition-colors min-h-[32px]"
              >
                ₹{p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Under Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as CategoryId)}
              className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-cyan-500 rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
            >
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Purchase Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Mechanical Keyboard, Headphones"
              value={purchaseNote}
              onChange={(e) => setPurchaseNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-cyan-500 rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Simulator Verdict Card */}
      <div
        className={`p-6 md:p-8 rounded-3xl bg-gradient-to-br ${verdictStyle.bg} border ${verdictStyle.border} shadow-[var(--shadow-md)] space-y-5`}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            {verdictStyle.icon}
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
                Affordability Verdict
              </span>
              <h3 className="text-lg font-black text-[var(--text-primary)]">{verdictStyle.title}</h3>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${verdictStyle.badge}`}>
            {result.verdict.toUpperCase()}
          </span>
        </div>

        <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
          {result.verdictMessage}
        </p>

        {/* Before vs After Impact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Remaining Balance Impact */}
          <div className="p-4 rounded-2xl bg-[var(--bg-app)]/80 border border-[var(--border-subtle)]">
            <span className="text-[11px] text-[var(--text-muted)]">Remaining Balance</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-mono text-[var(--text-muted)] line-through tabular-nums">
                {formatRupee(result.currentAvailable)}
              </span>
              <ArrowRight size={14} className="text-[var(--text-muted)]" />
              <AnimatedNumber
                value={result.newAvailable}
                className="text-base font-bold text-[var(--text-primary)]"
              />
            </div>
          </div>

          {/* Safe Daily Spend Impact */}
          <div className="p-4 rounded-2xl bg-[var(--bg-app)]/80 border border-[var(--border-subtle)]">
            <span className="text-[11px] text-[var(--text-muted)]">Safe Daily Burn Rate</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-mono text-[var(--text-muted)] line-through tabular-nums">
                {formatRupee(result.currentSafeDaily)}/d
              </span>
              <ArrowRight size={14} className="text-[var(--text-muted)]" />
              <span
                className={`text-base font-bold font-mono tabular-nums ${
                  result.newSafeDaily < 200 ? 'text-amber-400' : 'text-[var(--accent-primary)]'
                }`}
              >
                {formatRupee(result.newSafeDaily)}/d
              </span>
            </div>
          </div>

          {/* Category Budget Impact */}
          {result.categoryImpact && (
            <div className="p-4 rounded-2xl bg-[var(--bg-app)]/80 border border-[var(--border-subtle)]">
              <span className="text-[11px] text-[var(--text-muted)]">Category Budget</span>
              <div className="mt-1">
                <span className="text-xs font-mono font-bold text-[var(--text-secondary)] tabular-nums">
                  {formatRupee(result.categoryImpact.newTotalSpent)} / {formatRupee(result.categoryImpact.currentAllocated)}
                </span>
                <span className="text-[10px] block mt-0.5 font-semibold">
                  {result.categoryImpact.willExceed ? (
                    <span className="text-rose-400">⚠️ Will exceed allocated budget</span>
                  ) : (
                    <span className="text-[var(--accent-primary)]">✓ Within category limit</span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action button: Confirm & Record */}
        <div className="pt-2 flex justify-end">
          <Button
            variant="secondary"
            size="md"
            icon={<ArrowRight size={14} />}
            onClick={handleRecordHypothetical}
          >
            Record this {formatRupee(numAmount)} Expense
          </Button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CategoryId } from '../../types';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import { formatRupee } from '../../utils/currency';
import { formatDisplayDate } from '../../utils/dates';
import { CategoryIcon } from '../common/CategoryIcon';
import { Download, Plus, Search, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { exportTransactionsToCsv } from '../../db/exportImport';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { EmptyState } from '../ui/EmptyState';

interface TransactionsViewProps {
  onOpenQuickExpense: () => void;
  onOpenIncome: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  onOpenQuickExpense,
  onOpenIncome,
}) => {
  const { transactions, activeMonth, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'expense' | 'income'>('all');

  const monthTransactions = transactions.filter((t) => t.date.startsWith(activeMonth));

  const filtered = monthTransactions.filter((t) => {
    const matchesSearch =
      (t.note || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.merchant || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || t.categoryId === selectedCategory;
    const matchesType = selectedType === 'all' || t.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const totalSpent = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
            Audit Trail
          </span>
          <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tight mt-0.5">
            Transactions & Financial Ledger
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Complete, immutable chronological timeline of income and expense items.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => exportTransactionsToCsv(monthTransactions)}
          >
            Export CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<TrendingUp size={14} className="text-[var(--accent-primary)]" />}
            onClick={onOpenIncome}
          >
            + Income
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={15} strokeWidth={2.5} />}
            onClick={onOpenQuickExpense}
          >
            + Expense
          </Button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card variant="surface">
          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            <TrendingDown size={14} className="text-amber-500" /> Total Outflow (Expenses)
          </span>
          <div className="text-xl font-bold font-mono text-[var(--text-primary)] mt-1 tabular-nums">
            <AnimatedNumber value={totalSpent} />
          </div>
        </Card>

        <Card variant="surface">
          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            <TrendingUp size={14} className="text-[var(--accent-primary)]" /> Total Inflow (Income)
          </span>
          <div className="text-xl font-bold font-mono text-[var(--accent-primary)] mt-1 tabular-nums">
            <AnimatedNumber value={totalIncome} />
          </div>
        </Card>

        <Card variant="surface">
          <span className="text-xs text-[var(--text-muted)]">Transactions Count</span>
          <div className="text-xl font-bold font-mono text-[var(--text-primary)] mt-1 tabular-nums">
            {monthTransactions.length} items
          </div>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card variant="surface" className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by note, merchant, keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as CategoryId | 'all')}
              className="w-full px-3 py-2 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-xs text-[var(--text-secondary)] focus:outline-none"
            >
              <option value="all">All Categories</option>
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'all' | 'expense' | 'income')}
              className="w-full px-3 py-2 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-xs text-[var(--text-secondary)] focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Transactions Table / List */}
      <Card variant="surface" className="p-0 overflow-hidden shadow-[var(--shadow-sm)]">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={22} />}
            title="No transactions found"
            description="Your financial timeline will appear here once you record an expense or adjust filters."
            actionLabel="+ Add Expense"
            onAction={onOpenQuickExpense}
          />
        ) : (
          <div className="divide-y divide-[var(--border-subtle)]">
            {filtered.map((tx) => (
              <div
                key={tx.id}
                className="p-4 flex items-center justify-between gap-3 hover:bg-[var(--bg-surface-elevated)]/40 transition-colors group"
              >
                <div className="flex items-center gap-3.5">
                  <CategoryIcon categoryId={tx.categoryId} size={18} showBg={true} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        {tx.note || tx.categoryId}
                      </span>
                      {tx.merchant && (
                        <span className="text-[10px] font-medium bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">
                          {tx.merchant}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-0.5 font-mono">
                      <span>{formatDisplayDate(tx.date)}</span>
                      <span>•</span>
                      <span className="capitalize">{tx.categoryId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`text-sm md:text-base font-black font-mono text-right tabular-nums ${
                      tx.type === 'income' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatRupee(tx.amount)}
                  </div>
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="p-2 rounded-xl text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete Transaction"
                    aria-label="Delete transaction"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

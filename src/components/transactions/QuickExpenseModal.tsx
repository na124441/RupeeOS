import React, { useEffect, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CategoryId } from '../../types';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import { predictCategory } from '../../services/categorizationService';
import { CategoryIcon } from '../common/CategoryIcon';
import { Sparkles, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface QuickExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategoryId?: CategoryId;
}

export const QuickExpenseModal: React.FC<QuickExpenseModalProps> = ({
  isOpen,
  onClose,
  defaultCategoryId,
}) => {
  const { addTransaction } = useFinance();

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId>(defaultCategoryId || 'food');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [autoDetected, setAutoDetected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultCategoryId) {
      setCategoryId(defaultCategoryId);
    }
  }, [defaultCategoryId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleNoteChange = (text: string) => {
    setNote(text);
    const predicted = predictCategory(text);
    if (predicted && predicted !== categoryId) {
      setCategoryId(predicted);
      setAutoDetected(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    setIsSubmitting(true);

    addTransaction({
      type: 'expense',
      amount: parsedAmount,
      categoryId,
      note: note.trim() || DEFAULT_CATEGORIES.find((c) => c.id === categoryId)?.name || 'Expense',
      date,
    });

    setTimeout(() => {
      setAmount('');
      setNote('');
      setAutoDetected(false);
      setIsSubmitting(false);
      onClose();
    }, 120);
  };

  const quickAmounts = [50, 100, 200, 500, 1000];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Sheet on mobile (slide-up), Floating Modal on desktop */}
      <div
        className="relative z-10 w-full sm:max-w-lg bg-[var(--bg-surface)] border-t sm:border border-[var(--border-app)] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
      >
        {/* Mobile handle */}
        <div className="sm:hidden w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-[var(--border-hover)]" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">Quick Expense</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Enter amount and note for instant intelligent categorization
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors min-w-[44px] min-h-[44px]"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Big Rupee Amount Input */}
          <div>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-mono font-black text-[var(--accent-primary)] select-none">
                ₹
              </span>
              <input
                type="number"
                step="any"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-glow)] rounded-2xl text-3xl font-black font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/40 focus:outline-none tabular-nums transition-all"
                autoFocus
                required
              />
            </div>

            {/* Quick preset amount chips */}
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1">
              {quickAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset.toString())}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs font-mono font-semibold text-[var(--text-secondary)] transition-colors min-h-[32px]"
                >
                  +₹{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Note / Merchant Input with Auto-Categorization */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">
                Note or Merchant
              </label>
              {autoDetected && (
                <span className="text-[10px] text-[var(--accent-primary)] font-semibold flex items-center gap-1 animate-in fade-in">
                  <Sparkles size={11} /> Auto-detected category
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="e.g. Blinkit, Domino's, Metro, Chai..."
              value={note}
              onChange={(e) => handleNoteChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-glow)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none transition-all"
            />
          </div>

          {/* Category Chips Selector */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEFAULT_CATEGORIES.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategoryId(cat.id);
                      setAutoDetected(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-semibold transition-all min-h-[40px] ${
                      isSelected
                        ? 'bg-[var(--accent-surface)] border-[var(--accent-primary)] text-[var(--accent-primary)] shadow-sm'
                        : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                    }`}
                  >
                    <CategoryIcon categoryId={cat.id} size={14} showBg={false} />
                    <span className="truncate">{cat.name.split('&')[0].trim()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-[var(--bg-app)] border border-[var(--border-app)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--border-subtle)]">
            <Button variant="ghost" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isSubmitting || !amount}
            >
              {isSubmitting ? 'Logging...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

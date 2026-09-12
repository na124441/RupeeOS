import React, { useEffect, useState } from 'react';
import { EssentialItem } from '../../types';
import { formatRupee } from '../../utils/currency';
import { Check, CheckCircle, Minus, Plus, ShoppingCart, TrendingDown, TrendingUp, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface EssentialConfirmModalProps {
  item: EssentialItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (actualCost: number, recordExpense: boolean) => void;
}

export const EssentialConfirmModal: React.FC<EssentialConfirmModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [costInput, setCostInput] = useState<string>('');
  const [recordExpense, setRecordExpense] = useState<boolean>(true);

  useEffect(() => {
    if (item) {
      setCostInput(item.estimatedCost.toString());
      setRecordExpense(true);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const numericCost = parseFloat(costInput) || 0;
  const priceDiff = numericCost - item.estimatedCost;

  const handleConfirm = () => {
    onConfirm(Math.max(0, numericCost), recordExpense);
    onClose();
  };

  const handleMarkWithoutLogging = () => {
    onConfirm(item.estimatedCost, false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onKeyDown={handleKeyDown}
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full sm:max-w-md bg-[var(--bg-surface)] border-t sm:border border-[var(--border-app)] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 p-6 space-y-5 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <ShoppingCart size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
                Confirm Purchase
              </span>
              <h3 className="text-base font-bold text-[var(--text-primary)] leading-tight">
                {item.name}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                {item.quantity} {item.unit} • Est: {formatRupee(item.estimatedCost)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors min-w-[32px] min-h-[32px]"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Amount Input with adjustments */}
        <div className="p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Actual Price Paid</span>
            {priceDiff > 0 && (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <TrendingUp size={12} />
                +{formatRupee(priceDiff)} over estimate
              </span>
            )}
            {priceDiff < 0 && (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingDown size={12} />
                {formatRupee(Math.abs(priceDiff))} saved
              </span>
            )}
            {priceDiff === 0 && (
              <span className="text-[var(--text-muted)]">Matches estimate</span>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCostInput((prev) => Math.max(0, (parseFloat(prev) || 0) - 10).toString())}
              className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex items-center justify-center text-[var(--text-primary)] transition-all min-w-[40px] min-h-[40px]"
              title="Subtract ₹10"
            >
              <Minus size={16} />
            </button>

            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[var(--text-muted)] text-lg">
                ₹
              </span>
              <input
                type="number"
                value={costInput}
                onChange={(e) => setCostInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-center text-xl font-black font-mono bg-[var(--bg-surface)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none tabular-nums"
                autoFocus
              />
            </div>

            <button
              type="button"
              onClick={() => setCostInput((prev) => ((parseFloat(prev) || 0) + 10).toString())}
              className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex items-center justify-center text-[var(--text-primary)] transition-all min-w-[40px] min-h-[40px]"
              title="Add ₹10"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Auto Record Expense Checkbox */}
        <label className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={recordExpense}
            onChange={(e) => setRecordExpense(e.target.checked)}
            className="w-4 h-4 rounded text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] focus:ring-offset-0 bg-[var(--bg-app)] border-[var(--border-app)]"
          />
          <div className="flex-1">
            <span className="text-xs font-semibold text-[var(--text-primary)] block">
              Auto-record expense to ledger
            </span>
            <span className="text-[10px] text-[var(--text-muted)] block">
              Logs transaction under Essentials & updates safe daily spend immediately.
            </span>
          </div>
        </label>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center"
            icon={<Check size={16} />}
            onClick={handleConfirm}
          >
            Confirm & Log {formatRupee(numericCost)}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 justify-center text-xs"
              onClick={handleMarkWithoutLogging}
            >
              Mark Done Only
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 justify-center text-xs text-[var(--text-muted)]"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

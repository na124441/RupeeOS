import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CategoryId } from '../../types';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import { Modal } from '../common/Modal';
import { formatRupee } from '../../utils/currency';
import { Button } from '../ui/Button';

interface MoveMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoveMoneyModal: React.FC<MoveMoneyModalProps> = ({ isOpen, onClose }) => {
  const { plan, updatePlan } = useFinance();
  const [fromCategory, setFromCategory] = useState<CategoryId>('shopping');
  const [toCategory, setToCategory] = useState<CategoryId>('food');
  const [amount, setAmount] = useState('');

  const fromAllocated = plan.allocations[fromCategory] || 0;
  const toAllocated = plan.allocations[toCategory] || 0;

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0 || fromCategory === toCategory) return;

    if (transferAmount > fromAllocated) {
      alert(
        `Cannot transfer more than the allocated amount in ${fromCategory} (${formatRupee(
          fromAllocated
        )})`
      );
      return;
    }

    updatePlan({
      allocations: {
        ...plan.allocations,
        [fromCategory]: Math.max(0, fromAllocated - transferAmount),
        [toCategory]: toAllocated + transferAmount,
      },
    });

    setAmount('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Move Money Between Categories"
      subtitle="Rebalance your monthly budget allocations effortlessly"
    >
      <form onSubmit={handleTransfer} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          {/* From */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              From Category
            </label>
            <select
              value={fromCategory}
              onChange={(e) => setFromCategory(e.target.value as CategoryId)}
              className="w-full px-3 py-2 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
            >
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({formatRupee(plan.allocations[c.id] || 0)})
                </option>
              ))}
            </select>
          </div>

          {/* To */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              To Category
            </label>
            <select
              value={toCategory}
              onChange={(e) => setToCategory(e.target.value as CategoryId)}
              className="w-full px-3 py-2 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
            >
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({formatRupee(plan.allocations[c.id] || 0)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
            Amount to Reallocate (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[var(--text-muted)]">
              ₹
            </span>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-sm font-mono font-bold text-[var(--text-primary)] focus:outline-none tabular-nums"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--border-subtle)]">
          <Button variant="ghost" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit">
            Move Money
          </Button>
        </div>
      </form>
    </Modal>
  );
};

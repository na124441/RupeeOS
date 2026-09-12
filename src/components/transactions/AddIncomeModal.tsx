import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Modal } from '../common/Modal';
import { Button } from '../ui/Button';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction } = useFinance();
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    addTransaction({
      type: 'income',
      amount: parsedAmount,
      categoryId: 'other',
      note: source.trim() || 'Income / Stash Inflow',
      date,
    });

    setAmount('');
    setSource('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Income / Cash Inflow"
      subtitle="Record freelance earnings, salary, gifts, or top-ups"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-mono font-black text-[var(--accent-primary)] select-none">
              ₹
            </span>
            <input
              type="number"
              step="any"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-2xl text-2xl font-black font-mono text-[var(--text-primary)] focus:outline-none tabular-nums"
              autoFocus
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Source / Note</label>
          <input
            type="text"
            placeholder="e.g. Salary, Client payment, Freelance gig"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3.5 py-2 bg-[var(--bg-app)] border border-[var(--border-app)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--border-subtle)]">
          <Button variant="ghost" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit">
            Record Inflow
          </Button>
        </div>
      </form>
    </Modal>
  );
};

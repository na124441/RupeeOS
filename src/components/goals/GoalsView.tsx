import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupee } from '../../utils/currency';
import { formatDisplayDate } from '../../utils/dates';
import { ProgressBar } from '../common/ProgressBar';
import { CheckCircle2, Laptop, PiggyBank, Plane, Plus, Shield, Target, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AnimatedNumber } from '../ui/AnimatedNumber';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, contributeToGoal, deleteGoal } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contributeGoalId, setContributeGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  // New Goal form state
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('50000');
  const [initialSaved, setInitialSaved] = useState('0');
  const [targetDate, setTargetDate] = useState('2027-03-31');
  const [category, setCategory] = useState('Hardware & Workstation');

  const totalSavedAcrossGoals = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTargetAcrossGoals = goals.reduce((s, g) => s + g.targetAmount, 0);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const target = parseFloat(targetAmount) || 0;
    const current = parseFloat(initialSaved) || 0;

    addGoal({
      name: name.trim(),
      targetAmount: target,
      currentAmount: current,
      targetDate,
      category: category.trim() || 'General Goal',
      icon: 'Target',
    });

    setName('');
    setIsAddModalOpen(false);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributeGoalId) return;

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    contributeToGoal(contributeGoalId, amount);
    setDepositAmount('');
    setContributeGoalId(null);
  };

  const getGoalIcon = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('laptop') || lower.includes('hardware') || lower.includes('phone')) {
      return <Laptop size={18} className="text-cyan-400" />;
    }
    if (lower.includes('emergency') || lower.includes('safety')) {
      return <Shield size={18} className="text-emerald-400" />;
    }
    if (lower.includes('travel') || lower.includes('trip') || lower.includes('vacation')) {
      return <Plane size={18} className="text-amber-400" />;
    }
    return <Target size={18} className="text-purple-400" />;
  };

  const selectedGoalForDeposit = goals.find((g) => g.id === contributeGoalId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
            Sinking Funds
          </span>
          <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2.5 mt-0.5">
            <Target size={24} className="text-[var(--accent-primary)]" />
            <span>Savings Goals & Asset Targets</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Build funds for next-gen hardware, emergency buffers, trips, and major investments.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={15} strokeWidth={2.5} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          New Goal
        </Button>
      </div>

      {/* Aggregate Overview Card */}
      <Card variant="surface" className="p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Total Goals Progress
            </span>
            <div className="text-2xl font-black font-mono text-[var(--accent-primary)] mt-1 tabular-nums">
              <AnimatedNumber value={totalSavedAcrossGoals} />
              <span className="text-sm font-normal text-[var(--text-muted)] ml-2">
                saved of {formatRupee(totalTargetAcrossGoals)}
              </span>
            </div>
          </div>
          <span className="text-xl font-bold font-mono text-[var(--text-primary)] tabular-nums">
            {totalTargetAcrossGoals > 0
              ? Math.round((totalSavedAcrossGoals / totalTargetAcrossGoals) * 100)
              : 0}
            %
          </span>
        </div>
        <ProgressBar
          current={totalSavedAcrossGoals}
          total={totalTargetAcrossGoals}
          colorClass="bg-[var(--accent-primary)]"
          heightClass="h-3"
        />
      </Card>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
          const percent =
            goal.targetAmount > 0
              ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
              : 0;
          const isCompleted = goal.currentAmount >= goal.targetAmount;

          return (
            <Card
              key={goal.id}
              interactive
              variant="surface"
              className="p-5 space-y-4 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] shadow-sm">
                    {getGoalIcon(goal.category)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-primary)]">{goal.name}</h3>
                    <span className="text-xs text-[var(--text-muted)]">{goal.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Reached
                    </span>
                  )}
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    aria-label="Delete goal"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Progress visual */}
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between text-xs font-mono">
                  <span className="text-[var(--text-secondary)] font-bold tabular-nums">
                    {formatRupee(goal.currentAmount)}
                    <span className="text-[var(--text-muted)] font-normal ml-1">/ {formatRupee(goal.targetAmount)}</span>
                  </span>
                  <span className="text-[var(--accent-primary)] font-bold tabular-nums">{percent}%</span>
                </div>
                <ProgressBar
                  current={goal.currentAmount}
                  total={goal.targetAmount}
                  colorClass={isCompleted ? 'bg-emerald-400' : 'bg-[var(--accent-primary)]'}
                  heightClass="h-2.5"
                />
              </div>

              {/* Target Date & Remaining */}
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1 font-mono">
                <span>
                  Remaining: <strong className="text-[var(--text-primary)] tabular-nums">{formatRupee(remaining)}</strong>
                </span>
                <span>Target: {formatDisplayDate(goal.targetDate)}</span>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<PiggyBank size={14} />}
                  onClick={() => setContributeGoalId(goal.id)}
                >
                  Deposit Savings
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Deposit Modal */}
      {selectedGoalForDeposit && (
        <Modal
          isOpen={!!contributeGoalId}
          onClose={() => setContributeGoalId(null)}
          title={`Deposit into ${selectedGoalForDeposit.name}`}
          subtitle={`Current saved: ${formatRupee(selectedGoalForDeposit.currentAmount)} of ${formatRupee(selectedGoalForDeposit.targetAmount)}`}
        >
          <form onSubmit={handleDepositSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Deposit Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[var(--text-muted)]">₹</span>
                <input
                  type="number"
                  placeholder="2000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl font-mono text-sm font-bold text-[var(--text-primary)] focus:outline-none tabular-nums"
                  autoFocus
                  required
                />
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Deposits are also automatically recorded under the "Savings" expense category.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" type="button" onClick={() => setContributeGoalId(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Confirm Deposit
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Goal Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Savings Goal"
        subtitle="Set a dedicated financial target with a target date"
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Goal Name</label>
            <input
              type="text"
              placeholder="e.g. RTX Laptop, Emergency Fund, Trip"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Target Amount (₹)</label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-sm font-mono text-[var(--text-primary)] focus:outline-none tabular-nums"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Already Saved (₹)</label>
              <input
                type="number"
                value={initialSaved}
                onChange={(e) => setInitialSaved(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-sm font-mono text-[var(--text-primary)] focus:outline-none tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Category</label>
              <input
                type="text"
                placeholder="e.g. Hardware, Travel, Safety"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create Goal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

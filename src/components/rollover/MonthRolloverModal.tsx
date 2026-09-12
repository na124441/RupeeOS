import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupee } from '../../utils/currency';
import { getMonthName } from '../../utils/dates';
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Coins,
  DollarSign,
  PiggyBank,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface MonthRolloverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MonthRolloverModal: React.FC<MonthRolloverModalProps> = ({ isOpen, onClose }) => {
  const {
    activeMonth,
    plan,
    metrics,
    goals,
    templates,
    essentials,
    executeMonthRollover,
  } = useFinance();

  // Compute next month key
  const defaultTargetMonthKey = React.useMemo(() => {
    const [year, month] = activeMonth.split('-').map(Number);
    const nextDate = new Date(year, month, 1);
    return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;
  }, [activeMonth]);

  const [targetMonthKey, setTargetMonthKey] = useState<string>(defaultTargetMonthKey);
  const [surplusAction, setSurplusAction] = useState<'carryover' | 'goal' | 'none'>('carryover');
  const [selectedGoalId, setSelectedGoalId] = useState<string>(() => goals[0]?.id || '');
  const [copyAllocations, setCopyAllocations] = useState<boolean>(true);
  const [populateTemplates, setPopulateTemplates] = useState<boolean>(true);

  if (!isOpen) return null;

  const surplus = metrics.remainingMoney;
  const isSurplusPositive = surplus > 0;
  const targetMonthName = getMonthName(targetMonthKey);

  const monthEssentials = essentials.filter((e) => e.monthKey === activeMonth);
  const completedEssentials = monthEssentials.filter((e) => e.isPurchased).length;

  const handleExecute = () => {
    executeMonthRollover(targetMonthKey, {
      surplusAction,
      targetGoalId: surplusAction === 'goal' ? selectedGoalId : undefined,
      copyAllocations,
      populateEssentialsFromTemplates: populateTemplates,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-app)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[var(--accent-surface)] text-[var(--accent-primary)] border border-[var(--border-accent)] flex items-center justify-center">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Month-End Rollover
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                {plan.monthName} <span className="text-[var(--accent-primary)]">→</span> {targetMonthName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Performance Recap */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
              {plan.monthName} Performance Scorecard
            </span>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-center">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Total Inflow</span>
                <div className="text-sm sm:text-base font-bold font-mono text-[var(--text-primary)] mt-0.5">
                  {formatRupee(plan.availableMoney)}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-center">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Total Spent</span>
                <div className="text-sm sm:text-base font-bold font-mono text-amber-400 mt-0.5">
                  {formatRupee(metrics.totalSpentThisMonth)}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-center">
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">
                  {isSurplusPositive ? 'Net Surplus' : 'Overspent'}
                </span>
                <div
                  className={`text-sm sm:text-base font-bold font-mono mt-0.5 ${
                    isSurplusPositive ? 'text-[var(--accent-primary)]' : 'text-rose-400'
                  }`}
                >
                  {formatRupee(Math.abs(surplus))}
                </div>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              Essentials progress: <strong className="text-[var(--text-primary)]">{completedEssentials} of {monthEssentials.length}</strong> items purchased.
            </p>
          </div>

          {/* Surplus Allocation Strategy (If positive surplus) */}
          {isSurplusPositive ? (
            <div className="space-y-3 p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[var(--accent-primary)]" />
                <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Unspent Surplus: {formatRupee(surplus)}
                </h4>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Decide where this unspent money should go to preserve intentional allocation:
              </p>

              <div className="space-y-2 pt-1">
                {/* Option 1: Rollover to Next Month Inflow */}
                <label className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="surplusAction"
                    value="carryover"
                    checked={surplusAction === 'carryover'}
                    onChange={() => setSurplusAction('carryover')}
                    className="mt-0.5 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                      <Wallet size={13} className="text-[var(--accent-primary)]" />
                      Rollover to {targetMonthName} Spending Pool
                    </span>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      Adds {formatRupee(surplus)} directly to the starting available money for {targetMonthName}.
                    </p>
                  </div>
                </label>

                {/* Option 2: Deposit into Sinking Fund / Goal */}
                {goals.length > 0 && (
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="surplusAction"
                      value="goal"
                      checked={surplusAction === 'goal'}
                      onChange={() => setSurplusAction('goal')}
                      className="mt-0.5 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                        <PiggyBank size={13} className="text-cyan-400" />
                        Deposit into Sinking Fund / Goal
                      </span>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5 mb-2">
                        Accelerate a savings milestone by depositing the surplus.
                      </p>

                      {surplusAction === 'goal' && (
                        <select
                          value={selectedGoalId}
                          onChange={(e) => setSelectedGoalId(e.target.value)}
                          className="w-full text-xs bg-[var(--bg-app)] border border-[var(--border-app)] rounded-xl px-3 py-2 text-[var(--text-primary)] focus:outline-none"
                        >
                          {goals.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name} (Current: {formatRupee(g.currentAmount)} / {formatRupee(g.targetAmount)})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </label>
                )}

                {/* Option 3: Keep in source month without rollover */}
                <label className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="surplusAction"
                    value="none"
                    checked={surplusAction === 'none'}
                    onChange={() => setSurplusAction('none')}
                    className="mt-0.5 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      Close without moving surplus
                    </span>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      Leave {plan.monthName} as is and start {targetMonthName} from scratch.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <TrendingDown size={15} />
                <span>Month closed with budget deficit ({formatRupee(Math.abs(surplus))})</span>
              </div>
              <p className="text-[11px] text-rose-300/80">
                Consider adjusting your allocations in {targetMonthName} to compensate for the overspend.
              </p>
            </div>
          )}

          {/* Next Month Configuration Options */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
              {targetMonthName} Setup Options
            </span>

            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={copyAllocations}
                  onChange={(e) => setCopyAllocations(e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] bg-[var(--bg-surface)] border-[var(--border-app)]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-[var(--text-primary)] block">
                    Copy budget category allocations
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] block">
                    Transfers 50/30/20 category limits from {plan.monthName} to {targetMonthName}.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={populateTemplates}
                  onChange={(e) => setPopulateTemplates(e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] bg-[var(--bg-surface)] border-[var(--border-app)]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-[var(--text-primary)] block">
                    Auto-populate essentials from Recurring Templates ({templates.length} items)
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] block">
                    Seeds grocery and staple shopping lists automatically for the new month.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight size={16} />}
            onClick={handleExecute}
          >
            Complete Rollover & Open {targetMonthName}
          </Button>
        </div>
      </div>
    </div>
  );
};

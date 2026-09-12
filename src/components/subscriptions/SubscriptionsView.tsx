import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupee } from '../../utils/currency';
import { getRelativeDayDescription } from '../../utils/dates';
import { CheckCircle2, Plus, Repeat, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AnimatedNumber } from '../ui/AnimatedNumber';

export const SubscriptionsView: React.FC = () => {
  const { subscriptions, addSubscription, toggleSubscription, deleteSubscription } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('199');
  const [dueDay, setDueDay] = useState('15');

  const today = new Date().getDate();

  const sortedSubs = [...subscriptions].sort((a, b) => {
    const diffA = a.dueDay >= today ? a.dueDay - today : a.dueDay - today + 31;
    const diffB = b.dueDay >= today ? b.dueDay - today : b.dueDay - today + 31;
    return diffA - diffB;
  });

  const totalMonthlyCommitment = subscriptions
    .filter((s) => s.active)
    .reduce((sum, s) => sum + s.amount, 0);

  const upcomingRemainingCommitment = subscriptions
    .filter((s) => s.active && s.dueDay >= today)
    .reduce((sum, s) => sum + s.amount, 0);

  const handleCreateSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addSubscription({
      name: name.trim(),
      amount: parseFloat(amount) || 0,
      billingCycle: 'monthly',
      dueDay: parseInt(dueDay, 10) || 1,
      categoryId: 'bills',
      active: true,
    });

    setName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
            Recurring Commitments
          </span>
          <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2.5 mt-0.5">
            <Repeat size={24} className="text-orange-400" />
            <span>Recurring Subscriptions & Fixed Bills</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Track fixed recurring commitments like Spotify, Netflix, Cloud servers, and broadband.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={15} strokeWidth={2.5} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Subscription
        </Button>
      </div>

      {/* Commitments Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card variant="surface">
          <span className="text-xs text-[var(--text-muted)]">Monthly Recurring Commitments</span>
          <div className="text-xl font-bold font-mono text-[var(--text-primary)] mt-1 tabular-nums">
            <AnimatedNumber value={totalMonthlyCommitment} />
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">
            {subscriptions.filter((s) => s.active).length} active items
          </span>
        </Card>

        <Card variant="surface">
          <span className="text-xs text-[var(--text-muted)]">Remaining Upcoming This Month</span>
          <div className="text-xl font-bold font-mono text-orange-400 mt-1 tabular-nums">
            <AnimatedNumber value={upcomingRemainingCommitment} />
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">Deducted from safe daily spend</span>
        </Card>

        <Card variant="surface">
          <span className="text-xs text-[var(--text-muted)]">Next Due Payment</span>
          <div className="text-xl font-bold font-mono text-[var(--accent-primary)] mt-1 tabular-nums">
            {sortedSubs.length > 0 ? formatRupee(sortedSubs[0].amount) : '₹0'}
          </div>
          <span className="text-[11px] text-[var(--text-muted)] truncate block">
            {sortedSubs.length > 0
              ? `${sortedSubs[0].name} (${getRelativeDayDescription(sortedSubs[0].dueDay)})`
              : 'None'}
          </span>
        </Card>
      </div>

      {/* Subscriptions List */}
      <Card variant="surface" className="p-0 overflow-hidden">
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wider font-bold text-[var(--text-secondary)]">
            Scheduled Monthly Payments
          </h3>
          <span className="text-xs text-[var(--text-muted)] font-mono">Cycle: Every Month</span>
        </div>

        <div className="divide-y divide-[var(--border-subtle)]">
          {sortedSubs.map((sub) => {
            const isDueSoon = sub.dueDay - today >= 0 && sub.dueDay - today <= 3;
            const isDueToday = sub.dueDay === today;

            return (
              <div
                key={sub.id}
                className="p-4 flex items-center justify-between gap-3 hover:bg-[var(--bg-surface-elevated)]/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => toggleSubscription(sub.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      sub.active
                        ? 'bg-[var(--accent-primary)] text-slate-950'
                        : 'border border-[var(--border-hover)] bg-[var(--bg-app)] text-[var(--text-muted)]'
                    }`}
                    title={sub.active ? 'Active (Click to pause)' : 'Paused (Click to activate)'}
                    aria-label="Toggle active"
                  >
                    <CheckCircle2 size={16} />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm font-semibold ${
                          sub.active ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] line-through'
                        }`}
                      >
                        {sub.name}
                      </h4>
                      {isDueToday ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                          Due Today
                        </span>
                      ) : isDueSoon ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {getRelativeDayDescription(sub.dueDay)}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[var(--text-muted)] font-mono">
                          Due on {sub.dueDay}th
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                      {sub.billingCycle} billing • {getRelativeDayDescription(sub.dueDay)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-sm md:text-base font-black font-mono text-[var(--text-primary)] tabular-nums">
                    {formatRupee(sub.amount)}
                    <span className="text-xs font-normal text-[var(--text-muted)] ml-1">/mo</span>
                  </div>
                  <button
                    onClick={() => deleteSubscription(sub.id)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    aria-label="Delete subscription"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Add Subscription Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Recurring Subscription"
        subtitle="Log recurring memberships, streaming apps, or bills"
      >
        <form onSubmit={handleCreateSubscription} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Subscription Name</label>
            <input
              type="text"
              placeholder="e.g. Netflix, Spotify, AWS, WiFi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Monthly Amount (₹)</label>
              <input
                type="number"
                placeholder="149"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-sm font-mono text-[var(--text-primary)] focus:outline-none tabular-nums"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Due Day of Month</label>
              <input
                type="number"
                min="1"
                max="31"
                placeholder="1 to 31"
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-sm font-mono text-[var(--text-primary)] focus:outline-none tabular-nums"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Add Subscription
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

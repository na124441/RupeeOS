import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CategoryId } from '../../types';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import { formatRupee } from '../../utils/currency';
import { CategoryIcon } from '../common/CategoryIcon';
import { AlertTriangle, CheckCircle, Layers, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AnimatedNumber } from '../ui/AnimatedNumber';

export const MonthlyPlanning: React.FC = () => {
  const { plan, setAvailableMoney, allocateCategory, updatePlan, metrics } = useFinance();
  const [editingTotal, setEditingTotal] = useState(false);
  const [tempTotal, setTempTotal] = useState(plan.availableMoney.toString());

  const handleSaveTotal = () => {
    const val = parseFloat(tempTotal);
    if (!isNaN(val) && val >= 0) {
      setAvailableMoney(val);
    }
    setEditingTotal(false);
  };

  const handleAllocationChange = (catId: CategoryId, valStr: string) => {
    const val = parseFloat(valStr);
    allocateCategory(catId, isNaN(val) ? 0 : val);
  };

  const isOverAllocated = metrics.allocationGap < 0;
  const isPerfectZero = metrics.allocationGap === 0;

  // Mental Buckets grouping
  const essentialsBucket = (plan.allocations.essentials || 0) + (plan.allocations.bills || 0);
  const livingBucket =
    (plan.allocations.food || 0) + (plan.allocations.transport || 0) + (plan.allocations.personal || 0);
  const futureBucket = (plan.allocations.savings || 0) + (plan.allocations.emergency || 0);
  const discretionaryBucket =
    (plan.allocations.shopping || 0) + (plan.allocations.education || 0) + (plan.allocations.other || 0);
  const flexibleUnallocated = Math.max(0, metrics.allocationGap);

  const apply503020Rule = () => {
    if (plan.availableMoney <= 0) return;
    const needs = Math.round(plan.availableMoney * 0.5);
    const wants = Math.round(plan.availableMoney * 0.3);
    const savings = Math.round(plan.availableMoney * 0.2);

    updatePlan({
      allocations: {
        essentials: Math.round(needs * 0.5),
        bills: Math.round(needs * 0.25),
        transport: Math.round(needs * 0.25),
        food: Math.round(wants * 0.45),
        shopping: Math.round(wants * 0.3),
        personal: Math.round(wants * 0.15),
        education: Math.round(wants * 0.1),
        savings: Math.round(savings * 0.7),
        emergency: Math.round(savings * 0.3),
        other: 0,
      },
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
            Zero-Based Allocator
          </span>
          <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tight mt-0.5">
            Monthly Money Planning
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            "I tell the app how much money I have, and it helps me decide where every rupee should go."
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={<Sparkles size={15} className="text-[var(--accent-primary)]" />}
          onClick={apply503020Rule}
        >
          Auto-Apply 50/30/20 Rule
        </Button>
      </div>

      {/* Step 1: Available Monthly Money Editor */}
      <Card variant="surface" className="p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-surface)] border border-[var(--border-accent)] flex items-center justify-center text-[var(--accent-primary)] shadow-sm">
              <Wallet size={24} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-[var(--text-muted)]">
                Step 1: Inflow Target
              </span>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                How much money do you have for {plan.monthName}?
              </h3>
            </div>
          </div>

          {editingTotal ? (
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[var(--text-muted)]">₹</span>
                <input
                  type="number"
                  value={tempTotal}
                  onChange={(e) => setTempTotal(e.target.value)}
                  className="w-40 pl-8 pr-3 py-2 bg-[var(--bg-app)] border border-[var(--accent-primary)] rounded-xl font-mono font-bold text-[var(--text-primary)] focus:outline-none"
                  autoFocus
                />
              </div>
              <Button variant="primary" size="sm" onClick={handleSaveTotal}>
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setEditingTotal(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3.5">
              <div className="text-right">
                <div className="text-3xl font-black font-mono text-[var(--accent-primary)] tabular-nums">
                  <AnimatedNumber value={plan.availableMoney} />
                </div>
                <span className="text-[11px] text-[var(--text-muted)]">Click edit to change</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setTempTotal(plan.availableMoney.toString());
                  setEditingTotal(true);
                }}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Allocation Warning / Status Banner */}
      {isOverAllocated ? (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertTriangle size={22} className="text-rose-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-rose-300">Over-allocated Budget!</h4>
              <p className="text-xs text-rose-200/90 mt-0.5">
                ⚠️ You have allocated {formatRupee(Math.abs(metrics.allocationGap))} more than your available monthly money ({formatRupee(plan.availableMoney)}).
              </p>
            </div>
          </div>
          <div className="font-mono font-bold text-rose-400 text-lg tabular-nums">
            +{formatRupee(Math.abs(metrics.allocationGap))}
          </div>
        </div>
      ) : isPerfectZero ? (
        <div className="p-4 rounded-2xl bg-[var(--accent-surface)] border border-[var(--border-accent)] flex items-center gap-3 text-[var(--accent-primary)] animate-in fade-in">
          <ShieldCheck size={22} className="shrink-0" />
          <p className="text-xs font-medium">
            🎯 <strong>Perfect Zero-Based Allocation!</strong> Every rupee has an intentional purpose.
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-app)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <CheckCircle size={20} className="text-cyan-400 shrink-0" />
            <span className="text-xs">
              <strong>{formatRupee(metrics.allocationGap)}</strong> unallocated. You can assign it to categories or keep it as uncommitted flexible buffer.
            </span>
          </div>
          <span className="font-mono font-bold text-cyan-400 text-sm tabular-nums">
            {formatRupee(metrics.allocationGap)} left
          </span>
        </div>
      )}

      {/* Mental Money Buckets Diagram */}
      <Card variant="surface" className="p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-purple-400" />
          <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
            Mental Money Buckets Model
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Essentials</span>
            <div className="text-base font-black font-mono text-[var(--text-primary)] mt-1 tabular-nums">
              <AnimatedNumber value={essentialsBucket} />
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">Groceries & Fixed Bills</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Daily Living</span>
            <div className="text-base font-black font-mono text-[var(--text-primary)] mt-1 tabular-nums">
              <AnimatedNumber value={livingBucket} />
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">Food, Commute, Self</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
            <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Future & Safety</span>
            <div className="text-base font-black font-mono text-[var(--text-primary)] mt-1 tabular-nums">
              <AnimatedNumber value={futureBucket} />
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">Savings & Emergency</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Growth & Gear</span>
            <div className="text-base font-black font-mono text-[var(--text-primary)] mt-1 tabular-nums">
              <AnimatedNumber value={discretionaryBucket} />
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">Shopping & Education</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] col-span-2 md:col-span-1">
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Flexible Buffer</span>
            <div className="text-base font-black font-mono text-purple-300 mt-1 tabular-nums">
              <AnimatedNumber value={flexibleUnallocated} />
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">Unallocated Safety</span>
          </div>
        </div>
      </Card>

      {/* Step 2: Category Allocation Inputs Table */}
      <Card variant="surface" className="p-6 md:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Step 2: Allocate by Category
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Assign target spending limits for this month.</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-[var(--text-muted)]">Total Allocated: </span>
            <span
              className={`text-base font-mono font-bold ml-1 tabular-nums ${
                isOverAllocated ? 'text-rose-400' : 'text-[var(--accent-primary)]'
              }`}
            >
              {formatRupee(metrics.totalAllocated)} / {formatRupee(plan.availableMoney)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {DEFAULT_CATEGORIES.map((cat) => {
            const currentAllocated = plan.allocations[cat.id] || 0;
            const percentOfTotal =
              plan.availableMoney > 0
                ? Math.round((currentAllocated / plan.availableMoney) * 100)
                : 0;

            return (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 hover:border-[var(--border-hover)] transition-all"
              >
                <div className="flex items-center gap-3">
                  <CategoryIcon categoryId={cat.id} size={16} showBg={true} />
                  <div>
                    <h4 className="text-xs font-semibold text-[var(--text-primary)]">{cat.name}</h4>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono tabular-nums">
                      {percentOfTotal}% of monthly money
                    </span>
                  </div>
                </div>

                <div className="relative flex items-center">
                  <span className="absolute left-3 font-mono text-xs text-[var(--text-muted)]">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={currentAllocated === 0 ? '' : currentAllocated}
                    placeholder="0"
                    onChange={(e) => handleAllocationChange(cat.id, e.target.value)}
                    className="w-28 pl-7 pr-2.5 py-1.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl font-mono text-xs font-bold text-[var(--text-primary)] text-right focus:outline-none tabular-nums"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CategoryId } from '../../types';
import { formatRupee } from '../../utils/currency';
import {
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  Flame,
  Lock,
  PieChart,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { AnimatedNumber } from '../ui/AnimatedNumber';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { plan, metrics, completeOnboarding } = useFinance();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [inflow, setInflow] = useState<string>('50000');
  const [strategy, setStrategy] = useState<'50-30-20' | 'custom'>('50-30-20');

  // Allocation state
  const [customAllocations, setCustomAllocations] = useState<Record<CategoryId, number>>({
    essentials: 12500,
    food: 6750,
    transport: 6250,
    education: 1500,
    personal: 2250,
    shopping: 4500,
    bills: 6250,
    savings: 7000,
    emergency: 3000,
    other: 0,
  });

  if (!isOpen) return null;

  const numericInflow = Math.max(0, parseFloat(inflow) || 0);

  // Compute 50/30/20 breakdown
  const computedAllocations: Record<CategoryId, number> = React.useMemo(() => {
    if (strategy === 'custom') {
      return customAllocations;
    }
    const needs = Math.round(numericInflow * 0.5);
    const wants = Math.round(numericInflow * 0.3);
    const savings = Math.round(numericInflow * 0.2);

    return {
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
    };
  }, [numericInflow, strategy, customAllocations]);

  const totalAllocated = Object.values(computedAllocations).reduce((sum, v) => sum + v, 0);
  const estimatedNeeds =
    (computedAllocations.essentials || 0) +
    (computedAllocations.bills || 0) +
    (computedAllocations.transport || 0);
  const estimatedWants =
    (computedAllocations.food || 0) +
    (computedAllocations.shopping || 0) +
    (computedAllocations.personal || 0) +
    (computedAllocations.education || 0);
  const estimatedSavings =
    (computedAllocations.savings || 0) + (computedAllocations.emergency || 0);

  const daysRem = Math.max(1, metrics.daysRemaining || 30);
  const flexiblePool = Math.max(0, numericInflow - estimatedNeeds - estimatedSavings);
  const initialSafeDaily = Math.floor(flexiblePool / daysRem);

  const handleFinish = () => {
    completeOnboarding(numericInflow, computedAllocations, false);
    onClose();
  };

  const handleLoadDemo = () => {
    completeOnboarding(0, computedAllocations, true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-app)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Progress Steps */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--accent-primary)] to-emerald-400 flex items-center justify-center text-slate-950 font-black text-sm">
              ₹
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Welcome to RupeeOS
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Step {step} of 4 • {step === 1 ? 'Introduction' : step === 2 ? 'Monthly Inflow' : step === 3 ? 'Allocation Strategy' : 'Ready'}
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

        {/* Step Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Introduction */}
          {step === 1 && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-[var(--accent-surface)] border border-[var(--border-accent)] flex items-center justify-center mx-auto text-[var(--accent-primary)] shadow-lg shadow-emerald-500/10">
                <Sparkles size={32} />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                  Personal Financial Operating System
                </h2>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Most budgeting apps just track your past mistakes. RupeeOS is built around one forward-looking question:
                </p>
                <div className="p-3.5 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-semibold text-xs text-[var(--accent-primary)]">
                  “I tell the app how much money I have this month, and it helps me decide where every rupee should go.”
                </div>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
                <div className="p-3.5 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                    <Flame size={14} className="text-amber-400" />
                    <span>Safe Daily Burn</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Real-time safe spending threshold recalculated every time you buy.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                    <TrendingUp size={14} className="text-[var(--accent-primary)]" />
                    <span>Zero-Based Plan</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Assign intentional purpose to your money before the month begins.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                    <Lock size={14} className="text-cyan-400" />
                    <span>100% Private</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Zero telemetry. All data lives strictly in your browser storage.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  icon={<ArrowRight size={16} />}
                  onClick={() => setStep(2)}
                >
                  Set Up My Budget (1 Min)
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                  icon={<RotateCcw size={15} className="text-[var(--accent-primary)]" />}
                  onClick={handleLoadDemo}
                >
                  Explore with Demo Data
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Monthly Inflow */}
          {step === 2 && (
            <div className="space-y-6 py-2">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[var(--accent-primary)] tracking-wider">
                  Step 2 • Baseline Pool
                </span>
                <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
                  How much money do you have for this month?
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Enter your monthly salary, savings draw, or total liquid cash available to budget for {plan.monthName}.
                </p>
              </div>

              {/* Large Input Box */}
              <div className="p-6 rounded-3xl bg-[var(--bg-app)] border border-[var(--border-app)] text-center space-y-3">
                <div className="relative inline-flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-mono font-bold text-[var(--text-muted)] mr-2">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={inflow}
                    onChange={(e) => setInflow(e.target.value)}
                    placeholder="50,000"
                    className="w-64 sm:w-80 text-3xl sm:text-4xl font-black font-mono bg-transparent text-[var(--text-primary)] focus:outline-none text-center border-b-2 border-[var(--accent-primary)] pb-1"
                    autoFocus
                  />
                </div>

                <p className="text-xs text-[var(--text-muted)]">
                  Current budget pool: <span className="font-bold text-[var(--accent-primary)] font-mono">{formatRupee(numericInflow)}</span>
                </p>

                {/* Quick Presets */}
                <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
                  {[25000, 50000, 75000, 100000, 150000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setInflow(amt.toString())}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all min-h-[36px]"
                    >
                      ₹{(amt / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Allocation Strategy */}
          {step === 3 && (
            <div className="space-y-6 py-2">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[var(--accent-primary)] tracking-wider">
                  Step 3 • Allocation Strategy
                </span>
                <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
                  Where should your money go?
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Choose a proven financial framework or customize category buckets.
                </p>
              </div>

              {/* Strategy Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setStrategy('50-30-20')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    strategy === '50-30-20'
                      ? 'bg-[var(--accent-surface)] border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]'
                      : 'bg-[var(--bg-app)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                      <Sparkles size={14} className="text-[var(--accent-primary)]" />
                      50 / 30 / 20 Rule
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    50% Needs & Bills, 30% Lifestyle & Wants, 20% Savings & Reserves.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setStrategy('custom')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    strategy === 'custom'
                      ? 'bg-[var(--accent-surface)] border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]'
                      : 'bg-[var(--bg-app)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                      <PieChart size={14} className="text-cyan-400" />
                      Custom Breakdown
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Fine-tune specific allocations in the Monthly Planning tab anytime.
                  </p>
                </button>
              </div>

              {/* Live Preview of 3 Buckets */}
              <div className="space-y-3 p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Target Allocation Summary
                </span>

                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Needs (50%)</span>
                    <div className="text-sm font-bold font-mono text-[var(--text-primary)] mt-0.5">
                      {formatRupee(estimatedNeeds)}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Wants (30%)</span>
                    <div className="text-sm font-bold font-mono text-amber-400 mt-0.5">
                      {formatRupee(estimatedWants)}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Savings (20%)</span>
                    <div className="text-sm font-bold font-mono text-[var(--accent-primary)] mt-0.5">
                      {formatRupee(estimatedSavings)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 text-[var(--text-muted)] font-mono">
                  <span>Total Allocated: {formatRupee(totalAllocated)}</span>
                  <span>Pool: {formatRupee(numericInflow)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Summary & Ready */}
          {step === 4 && (
            <div className="space-y-6 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-surface)] border border-[var(--border-accent)] flex items-center justify-center mx-auto text-[var(--accent-primary)] shadow-md">
                <CheckCircle size={28} />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
                  Your Command Center is Ready
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Here is your baseline financial posture for {plan.monthName}:
                </p>
              </div>

              {/* Ready Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <Card variant="surface" className="p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Wallet size={14} className="text-[var(--accent-primary)]" />
                    <span>Monthly Money</span>
                  </div>
                  <div className="text-xl font-black font-mono text-[var(--accent-primary)]">
                    {formatRupee(numericInflow)}
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Fully assigned across essentials, lifestyle & sinking funds.
                  </p>
                </Card>

                <Card variant="surface" className="p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Flame size={14} className="text-amber-400" />
                    <span>Safe Daily Spend</span>
                  </div>
                  <div className="text-xl font-black font-mono text-amber-400">
                    {formatRupee(initialSafeDaily)}
                    <span className="text-xs font-normal text-[var(--text-muted)]"> / day</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Based on {daysRem} days remaining in this month.
                  </p>
                </Card>
              </div>

              <div className="p-3 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] text-left flex items-start gap-2.5">
                <Sparkles size={16} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Pro Tip:</strong> Add your recurring grocery items in the <strong>Essentials</strong> tab. When you check them off, RupeeOS will log the actual price and update your safe daily burn automatically.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
          {step > 1 ? (
            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronLeft size={16} />}
              onClick={() => setStep((s) => (s - 1) as any)}
            >
              Back
            </Button>
          ) : (
            <button
              type="button"
              onClick={handleLoadDemo}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors underline decoration-dotted"
            >
              Skip setup & use demo
            </button>
          )}

          {step < 4 ? (
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight size={16} />}
              onClick={() => {
                if (step === 2 && numericInflow <= 0) {
                  alert('Please enter your available money for the month.');
                  return;
                }
                setStep((s) => (s + 1) as any);
              }}
            >
              {step === 1 ? 'Get Started' : 'Next Step'}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              icon={<CheckCircle size={16} />}
              onClick={handleFinish}
            >
              Launch Command Center
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

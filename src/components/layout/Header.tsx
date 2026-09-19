import React, { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Download, Moon, Plus, RotateCcw, Sparkles, Sun, Wifi, WifiOff } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../common/BrandLogo';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenQuickExpense: () => void;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuickExpense, onOpenExportModal }) => {
  const { activeMonth, setActiveMonth, plan, metrics, resetToDemo, setIsRolloverOpen } = useFinance();
  const { theme, toggleTheme } = useTheme();

  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handlePrevMonth = () => {
    const [year, month] = activeMonth.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    const newMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    setActiveMonth(newMonthKey);
  };

  const handleNextMonth = () => {
    const [year, month] = activeMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    const newMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    setActiveMonth(newMonthKey);
  };

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-surface)]/85 backdrop-blur-xl border-b border-[var(--border-app)] px-4 lg:px-8 py-2.5 flex items-center justify-between transition-colors shadow-sm">
      {/* Brand & Month Switcher */}
      <div className="flex items-center gap-3 md:gap-6">
        <BrandLogo size="md" showText={true} showBadge={true} />

        {/* Month Selector Switcher */}
        <div className="flex items-center bg-[var(--bg-surface-elevated)] border border-[var(--border-app)] rounded-xl p-1 shadow-sm">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center"
            title="Previous Month"
            aria-label="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-0.5 select-none">
            <Calendar size={13} className="text-[var(--accent-primary)]" />
            <span className="text-xs md:text-sm font-semibold text-[var(--text-primary)] tracking-tight whitespace-nowrap">
              {plan.monthName}
            </span>
          </div>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center"
            title="Next Month"
            aria-label="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Month Rollover Trigger */}
        <button
          onClick={() => setIsRolloverOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-app)] hover:border-[var(--accent-primary)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all min-h-[36px] shadow-sm group"
          title="Close month and rollover surplus"
        >
          <Sparkles size={13} className="text-[var(--accent-primary)] group-hover:scale-110 transition-transform" />
          <span>Rollover Month</span>
        </button>
      </div>

      {/* Available Balance Pill & Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Local-First Connectivity Badge */}
        <div
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] select-none"
          title={isOnline ? '100% private. All data is saved on your device.' : 'Working offline. Changes are saved locally.'}
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
          <span>{isOnline ? 'Local-First' : 'Offline Mode'}</span>
        </div>

        {/* Available Money pill with luminous gradient & glow */}
        <div className="hidden sm:flex items-center gap-2.5 bg-gradient-to-r from-[var(--bg-surface-elevated)] to-[var(--accent-surface)] border border-[var(--border-accent)] rounded-xl px-3.5 py-1.5 shadow-sm shadow-emerald-500/10">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Available</span>
          <AnimatedNumber
            value={metrics.remainingMoney}
            className="text-sm font-extrabold text-[var(--accent-primary)] font-mono"
          />
        </div>

        {/* Luminous Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="px-2.5 py-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-app)] hover:border-[var(--border-hover)] transition-all min-h-[38px] flex items-center gap-1.5 shadow-sm group"
          title={`Currently on ${theme === 'dark' ? 'Midnight Lit' : 'Radiant Sunlight'}. Click to switch theme.`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <>
              <Sun size={15} className="text-amber-400 group-hover:rotate-45 transition-transform" />
              <span className="text-xs font-semibold hidden md:inline">Lit Dark</span>
            </>
          ) : (
            <>
              <Moon size={15} className="text-indigo-500 group-hover:-rotate-12 transition-transform" />
              <span className="text-xs font-semibold hidden md:inline">Sunlight</span>
            </>
          )}
        </button>

        {/* Demo reset button */}
        <button
          onClick={resetToDemo}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-app)] transition-all min-w-[38px] min-h-[38px] flex items-center justify-center"
          title="Reset to Demo Data (September 2026)"
          aria-label="Reset demo"
        >
          <RotateCcw size={16} />
        </button>

        {/* Backup / Export button */}
        <button
          onClick={onOpenExportModal}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-app)] transition-all min-w-[38px] min-h-[38px] flex items-center justify-center"
          title="Data Export & Portability"
          aria-label="Data export"
        >
          <Download size={16} />
        </button>

        {/* Quick Add Expense Button */}
        <Button
          variant="primary"
          size="md"
          icon={<Plus size={16} strokeWidth={2.5} />}
          onClick={onOpenQuickExpense}
        >
          <span>Expense</span>
        </Button>
      </div>
    </header>
  );
};

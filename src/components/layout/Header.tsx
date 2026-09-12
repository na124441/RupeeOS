import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Download, Moon, Plus, RotateCcw, Sun } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenQuickExpense: () => void;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuickExpense, onOpenExportModal }) => {
  const { activeMonth, setActiveMonth, plan, metrics, resetToDemo } = useFinance();
  const { theme, toggleTheme } = useTheme();

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
    <header className="sticky top-0 z-30 bg-[var(--bg-surface)]/80 backdrop-blur-md border-b border-[var(--border-app)] px-4 lg:px-8 py-3 flex items-center justify-between transition-colors">
      {/* Brand & Month Switcher */}
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--accent-primary)] to-emerald-400 flex items-center justify-center shadow-md shadow-emerald-500/20 text-slate-950 font-bold text-lg font-mono">
            ₹
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-[var(--text-primary)] text-base md:text-lg leading-none">
                RupeeOS
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[var(--accent-surface)] text-[var(--accent-primary)] border border-[var(--border-accent)]">
                Pro
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] hidden sm:block">Financial Operating System</p>
          </div>
        </div>

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
      </div>

      {/* Available Balance Pill & Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Available Money pill */}
        <div className="hidden sm:flex items-center gap-2.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-app)] rounded-xl px-3.5 py-1.5 shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium">Available</span>
          <AnimatedNumber
            value={metrics.remainingMoney}
            className="text-sm font-bold text-[var(--accent-primary)]"
          />
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-app)] transition-all min-w-[38px] min-h-[38px] flex items-center justify-center"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
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

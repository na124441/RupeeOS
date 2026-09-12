import React, { useState } from 'react';
import {
  Activity,
  Calculator,
  Calendar,
  CreditCard,
  LayoutDashboard,
  MoreHorizontal,
  PieChart,
  Plus,
  Repeat,
  Settings,
  ShoppingCart,
  Target,
  X,
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickExpense: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickExpense,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const moreTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'expenses', label: 'Expenses & Ledger', icon: <CreditCard size={18} /> },
    { id: 'goals', label: 'Savings Goals', icon: <Target size={18} /> },
    { id: 'subscriptions', label: 'Subscriptions', icon: <Repeat size={18} /> },
    { id: 'simulator', label: '"What If?" Simulator', icon: <Calculator size={18} /> },
    { id: 'calendar', label: 'Spend Calendar', icon: <Calendar size={18} /> },
    { id: 'analytics', label: 'Analytics & Health', icon: <Activity size={18} /> },
    { id: 'settings', label: 'Data & Privacy', icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* "More" Drawer Modal for Mobile */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setShowMoreMenu(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-[var(--bg-surface)] border-t border-[var(--border-app)] rounded-t-3xl p-6 z-10 animate-in slide-in-from-bottom">
            <div className="w-12 h-1.5 rounded-full bg-[var(--border-hover)] mx-auto mb-4" />
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
              <h3 className="font-bold text-[var(--text-primary)]">All Financial Tools</h3>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] min-w-[44px] min-h-[44px]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {moreTabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowMoreMenu(false);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-sm font-medium transition-all min-h-[48px] ${
                    activeTab === item.id
                      ? 'bg-[var(--accent-surface)] border-[var(--border-accent)] text-[var(--accent-primary)] font-semibold'
                      : 'bg-[var(--bg-surface-elevated)] border-[var(--border-app)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <span className="text-[var(--accent-primary)]">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-lg border-t border-[var(--border-app)] px-3 py-1.5 flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-colors min-w-[48px] min-h-[48px] ${
            activeTab === 'dashboard' ? 'text-[var(--accent-primary)] font-semibold' : 'text-[var(--text-muted)]'
          }`}
          aria-label="Home"
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Budget */}
        <button
          onClick={() => setActiveTab('planning')}
          className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-colors min-w-[48px] min-h-[48px] ${
            activeTab === 'planning' ? 'text-[var(--accent-primary)] font-semibold' : 'text-[var(--text-muted)]'
          }`}
          aria-label="Budget"
        >
          <PieChart size={20} />
          <span className="text-[10px]">Budget</span>
        </button>

        {/* Center Quick Add Expense Floating Button */}
        <button
          onClick={onOpenQuickExpense}
          className="w-12 h-12 -mt-5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform active:scale-90 border-2 border-[var(--bg-app)] min-w-[48px] min-h-[48px]"
          title="Add Expense"
          aria-label="Add Expense"
        >
          <Plus size={24} strokeWidth={3} />
        </button>

        {/* Essentials */}
        <button
          onClick={() => setActiveTab('essentials')}
          className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-colors min-w-[48px] min-h-[48px] ${
            activeTab === 'essentials' ? 'text-[var(--accent-primary)] font-semibold' : 'text-[var(--text-muted)]'
          }`}
          aria-label="Essentials"
        >
          <ShoppingCart size={20} />
          <span className="text-[10px]">Essentials</span>
        </button>

        {/* More */}
        <button
          onClick={() => setShowMoreMenu(true)}
          className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-colors min-w-[48px] min-h-[48px] ${
            showMoreMenu ? 'text-[var(--accent-primary)] font-semibold' : 'text-[var(--text-muted)]'
          }`}
          aria-label="More options"
        >
          <MoreHorizontal size={20} />
          <span className="text-[10px]">More</span>
        </button>
      </nav>
    </>
  );
};

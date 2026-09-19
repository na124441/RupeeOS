import React, { useState } from 'react';
import {
  Activity,
  Calculator,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  HeartPulse,
  LayoutDashboard,
  PieChart,
  Repeat,
  Settings,
  ShoppingCart,
  Target,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupee } from '../../utils/currency';
import { AnimatedNumber } from '../ui/AnimatedNumber';

import { BrandLogo } from '../common/BrandLogo';

export type ActiveTab =
  | 'dashboard'
  | 'planning'
  | 'expenses'
  | 'essentials'
  | 'goals'
  | 'subscriptions'
  | 'simulator'
  | 'calendar'
  | 'analytics'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { metrics, healthScore } = useFinance();
  const [collapsed, setCollapsed] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: 'planning',
      label: 'Monthly Planning',
      icon: <PieChart size={18} />,
      badge: metrics.allocationGap < 0 ? '⚠️' : undefined,
    },
    {
      id: 'expenses',
      label: 'Expenses & Ledger',
      icon: <CreditCard size={18} />,
    },
    {
      id: 'essentials',
      label: 'Essentials & Shopping',
      icon: <ShoppingCart size={18} />,
      badge: metrics.upcomingEssentialsTotal > 0 ? formatRupee(metrics.upcomingEssentialsTotal, true) : undefined,
    },
    {
      id: 'goals',
      label: 'Savings Goals',
      icon: <Target size={18} />,
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: <Repeat size={18} />,
    },
    {
      id: 'simulator',
      label: '"What If?" Simulator',
      icon: <Calculator size={18} />,
    },
    {
      id: 'calendar',
      label: 'Spend Calendar',
      icon: <Calendar size={18} />,
    },
    {
      id: 'analytics',
      label: 'Analytics & Score',
      icon: <Activity size={18} />,
      badge: `${healthScore.score}`,
    },
    {
      id: 'settings',
      label: 'Data & Privacy',
      icon: <Settings size={18} />,
    },
  ];

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-[var(--bg-surface)]/60 backdrop-blur-md border-r border-[var(--border-app)] p-3 flex flex-col justify-between hidden md:flex transition-all duration-300 ease-out select-none shadow-sm`}
    >
      <div className="space-y-3">
        {/* Collapse toggle row & brand mark */}
        <div className="flex items-center justify-between px-1 py-1">
          {collapsed ? (
            <div className="mx-auto flex flex-col items-center gap-2">
              <BrandLogo size="sm" />
              <button
                onClick={() => setCollapsed(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                title="Expand Sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          ) : (
            <>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--text-muted)]">
                Navigation
              </span>
              <button
                onClick={() => setCollapsed(true)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                title="Collapse Sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            </>
          )}
        </div>

        {/* Safe Spending Mini Widget (Expanded mode only) */}
        {!collapsed && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[var(--bg-surface-elevated)] via-[var(--bg-surface)] to-[var(--accent-surface)]/25 border border-[var(--border-accent)] shadow-sm space-y-1 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-glow)] rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold relative z-10">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                Safe Daily Burn
              </span>
              <span className="text-[var(--accent-primary)] font-mono font-bold bg-[var(--accent-surface)] px-1.5 py-0.5 rounded text-[10px]">
                {metrics.daysRemaining}d left
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-[var(--accent-primary)] flex items-baseline gap-1 relative z-10">
              <AnimatedNumber value={metrics.safeDailySpend} />
              <span className="text-xs font-normal text-[var(--text-muted)]">/day</span>
            </div>
            <div className="mt-2 text-[11px] text-[var(--text-muted)] flex items-center justify-between pt-1 border-t border-[var(--border-subtle)] relative z-10">
              <span>Committed:</span>
              <span className="font-mono text-[var(--text-secondary)] font-semibold">
                {formatRupee(metrics.upcomingEssentialsTotal + metrics.upcomingSubscriptionsTotal)}
              </span>
            </div>
          </div>
        )}

        {/* Nav item list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  collapsed ? 'justify-center px-0' : 'justify-between px-3'
                } py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-150 relative group overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-[var(--accent-surface)] via-[var(--accent-surface)]/60 to-emerald-500/5 text-[var(--accent-primary)] border border-[var(--border-accent)] font-semibold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-transparent'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-r-full shadow-sm shadow-emerald-400" />
                )}
                <div className="flex items-center gap-3">
                  <span
                    className={`transition-transform duration-150 group-hover:scale-110 ${
                      isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      item.badge === '⚠️'
                        ? 'bg-amber-500/20 text-amber-300'
                        : isActive
                        ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]'
                        : 'bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Financial Health Snapshot in Sidebar footer */}
      <div className="pt-3 border-t border-[var(--border-app)]">
        <div
          className={`flex items-center ${
            collapsed ? 'justify-center p-2' : 'justify-between p-3'
          } rounded-xl bg-gradient-to-r from-[var(--bg-surface)] to-[var(--bg-surface-elevated)] border border-[var(--border-app)] shadow-sm`}
          title={`Health Score: ${healthScore.score}/100`}
        >
          <div className="flex items-center gap-2">
            <HeartPulse
              size={16}
              className={
                healthScore.score >= 75
                  ? 'text-emerald-400 animate-pulse'
                  : healthScore.score >= 50
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }
            />
            {!collapsed && (
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Health Score</span>
            )}
          </div>
          {!collapsed && (
            <span
              className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full border ${
                healthScore.score >= 75
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : healthScore.score >= 50
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}
            >
              {healthScore.score}/100
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};

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
      } bg-[var(--bg-app)] border-r border-[var(--border-app)] p-3.5 flex flex-col justify-between hidden md:flex transition-all duration-300 ease-out select-none`}
    >
      <div className="space-y-4">
        {/* Collapse toggle row */}
        <div className="flex items-center justify-between px-1">
          {!collapsed && (
            <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
              Navigation
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors ${
              collapsed ? 'mx-auto' : ''
            }`}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Safe Spending Mini Widget (Expanded mode only) */}
        {!collapsed && (
          <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-app)] shadow-sm space-y-1 transition-all">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              <span>Safe Daily Burn</span>
              <span className="text-[var(--accent-primary)] font-mono">{metrics.daysRemaining}d left</span>
            </div>
            <div className="text-xl font-black font-mono text-[var(--accent-primary)] flex items-baseline gap-1">
              <AnimatedNumber value={metrics.safeDailySpend} />
              <span className="text-xs font-normal text-[var(--text-muted)]">/day</span>
            </div>
            <div className="mt-2 text-[11px] text-[var(--text-muted)] flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]">
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
                } py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-150 relative group ${
                  isActive
                    ? 'bg-[var(--accent-surface)] text-[var(--accent-primary)] border border-[var(--border-accent)] font-semibold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-transparent'
                }`}
              >
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
          } rounded-xl bg-[var(--bg-surface)] border border-[var(--border-app)]`}
          title={`Health Score: ${healthScore.score}/100`}
        >
          <div className="flex items-center gap-2">
            <HeartPulse size={16} className="text-[var(--accent-primary)]" />
            {!collapsed && (
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Health Score</span>
            )}
          </div>
          {!collapsed && (
            <span className="text-xs font-bold font-mono text-[var(--accent-primary)]">
              {healthScore.score}/100
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};

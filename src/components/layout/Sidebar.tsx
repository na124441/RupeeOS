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

  const [showAllTools, setShowAllTools] = useState(false);

  // 4 Core Main Navigation Tabs
  const coreNavItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: 'planning',
      label: 'Plan & Budget',
      icon: <PieChart size={18} />,
      badge: metrics.allocationGap < 0 ? '⚠️ Over' : undefined,
    },
    {
      id: 'expenses',
      label: 'Expenses',
      icon: <CreditCard size={18} />,
    },
    {
      id: 'analytics',
      label: 'Analytics & Health',
      icon: <Activity size={18} />,
      badge: `${healthScore.score}`,
    },
  ];

  // Secondary Tools
  const secondaryNavItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'essentials',
      label: 'Shopping List',
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
      id: 'settings',
      label: 'Settings & Data',
      icon: <Settings size={18} />,
    },
  ];

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeTab);

  const renderNavButton = (item: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }) => {
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
              item.badge.includes('Over')
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
  };

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-[var(--bg-surface)]/60 backdrop-blur-md border-r border-[var(--border-app)] p-3 flex flex-col justify-between hidden md:flex transition-all duration-300 ease-out select-none shadow-sm`}
    >
      <div className="space-y-4">
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
                Menu
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

        {/* Primary Core Navigation */}
        <nav className="space-y-1">
          {coreNavItems.map(renderNavButton)}
        </nav>

        {/* Secondary Tools Section */}
        <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1">
          {!collapsed && (
            <div className="flex items-center justify-between px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
              <span>More Tools</span>
              {isSecondaryActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
              )}
            </div>
          )}
          {secondaryNavItems.slice(0, collapsed ? 6 : (showAllTools || isSecondaryActive ? 6 : 2)).map(renderNavButton)}

          {!collapsed && !showAllTools && !isSecondaryActive && (
            <button
              onClick={() => setShowAllTools(true)}
              className="w-full text-left px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] font-medium transition-colors"
            >
              + More tools ({secondaryNavItems.length - 2})
            </button>
          )}
        </div>
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

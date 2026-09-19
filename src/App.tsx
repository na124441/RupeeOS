import React, { useEffect, useRef, useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { ActiveTab, Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { MonthlyPlanning } from './components/budget/MonthlyPlanning';
import { TransactionsView } from './components/transactions/TransactionsView';
import { EssentialsView } from './components/essentials/EssentialsView';
import { GoalsView } from './components/goals/GoalsView';
import { SubscriptionsView } from './components/subscriptions/SubscriptionsView';
import { WhatIfSimulator } from './components/simulator/WhatIfSimulator';
import { SpendCalendar } from './components/calendar/SpendCalendar';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { QuickExpenseModal } from './components/transactions/QuickExpenseModal';
import { AddIncomeModal } from './components/transactions/AddIncomeModal';
import { MoveMoneyModal } from './components/transactions/MoveMoneyModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { MonthRolloverModal } from './components/rollover/MonthRolloverModal';
import { animateTabTransition } from './lib/animations/transitions';

const MainAppContent: React.FC = () => {
  const {
    isOnboardingOpen,
    setIsOnboardingOpen,
    isRolloverOpen,
    setIsRolloverOpen,
  } = useFinance();

  const [activeTab, setActiveTabState] = useState<ActiveTab>('dashboard');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isMoveMoneyModalOpen, setIsMoveMoneyModalOpen] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);

  const setActiveTab = (newTab: ActiveTab) => {
    setActiveTabState(newTab);
  };

  useEffect(() => {
    if (mainContentRef.current) {
      animateTabTransition(mainContentRef.current);
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigateTab={setActiveTab}
            onOpenExpense={() => setIsExpenseModalOpen(true)}
            onOpenIncome={() => setIsIncomeModalOpen(true)}
            onOpenEssential={() => setActiveTab('essentials')}
            onOpenMoveMoney={() => setIsMoveMoneyModalOpen(true)}
            onOpenSimulator={() => setActiveTab('simulator')}
          />
        );
      case 'planning':
        return <MonthlyPlanning />;
      case 'expenses':
        return (
          <TransactionsView
            onOpenQuickExpense={() => setIsExpenseModalOpen(true)}
            onOpenIncome={() => setIsIncomeModalOpen(true)}
          />
        );
      case 'essentials':
        return <EssentialsView />;
      case 'goals':
        return <GoalsView />;
      case 'subscriptions':
        return <SubscriptionsView />;
      case 'simulator':
        return (
          <WhatIfSimulator
            onRecordedExpense={() => setActiveTab('expenses')}
          />
        );
      case 'calendar':
        return <SpendCalendar />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <DashboardView
            onNavigateTab={setActiveTab}
            onOpenExpense={() => setIsExpenseModalOpen(true)}
            onOpenIncome={() => setIsIncomeModalOpen(true)}
            onOpenEssential={() => setActiveTab('essentials')}
            onOpenMoveMoney={() => setIsMoveMoneyModalOpen(true)}
            onOpenSimulator={() => setActiveTab('simulator')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)] selection:bg-emerald-500/25 selection:text-emerald-300 transition-colors relative">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--ambient-orb-1)] blur-[120px] transition-all duration-700" />
        <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-[var(--ambient-orb-2)] blur-[140px] transition-all duration-700" />
        <div className="absolute -bottom-32 left-1/4 w-[32rem] h-[32rem] rounded-full bg-[var(--ambient-orb-3)] blur-[150px] transition-all duration-700" />
      </div>

      {/* Top sticky header */}
      <Header
        onOpenQuickExpense={() => setIsExpenseModalOpen(true)}
        onOpenExportModal={() => setActiveTab('settings')}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Desktop Collapsible Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Main View Area */}
        <main
          ref={mainContentRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8"
        >
          {renderContent()}
        </main>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickExpense={() => setIsExpenseModalOpen(true)}
      />

      {/* Global Quick Expense Modal / Mobile Bottom Sheet */}
      <QuickExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />

      {/* Global Add Income Modal */}
      <AddIncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
      />

      {/* Global Move Money Modal */}
      <MoveMoneyModal
        isOpen={isMoveMoneyModalOpen}
        onClose={() => setIsMoveMoneyModalOpen(false)}
      />

      {/* First-Time Setup Onboarding Wizard */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Month-End Rollover & Seeding Wizard */}
      <MonthRolloverModal
        isOpen={isRolloverOpen}
        onClose={() => setIsRolloverOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <MainAppContent />
      </FinanceProvider>
    </ThemeProvider>
  );
}

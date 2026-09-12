import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  CategoryId,
  EssentialItem,
  EssentialTemplate,
  FinancialAlert,
  Goal,
  HealthScore,
  MonthlyPlan,
  SimulationResult,
  Subscription,
  Transaction,
} from '../types';
import { StorageService } from '../db/storage';
import { calculateBurnRateMetrics } from '../services/burnRateService';
import { calculateHealthScore } from '../services/healthScoreService';
import { generateFinancialAlerts } from '../services/alertService';
import { RupeeOSBackupData } from '../db/exportImport';
import { getMonthName } from '../utils/dates';

interface FinanceContextType {
  activeMonth: string;
  setActiveMonth: (month: string) => void;
  plan: MonthlyPlan;
  transactions: Transaction[];
  essentials: EssentialItem[];
  templates: EssentialTemplate[];
  goals: Goal[];
  subscriptions: Subscription[];
  metrics: ReturnType<typeof calculateBurnRateMetrics>;
  healthScore: HealthScore;
  alerts: FinancialAlert[];
  
  // Actions
  setAvailableMoney: (amount: number) => void;
  allocateCategory: (categoryId: CategoryId, amount: number) => void;
  updatePlan: (updated: Partial<MonthlyPlan>) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  addEssential: (item: Omit<EssentialItem, 'id' | 'monthKey'>) => void;
  toggleEssential: (id: string, actualCost?: number, recordExpense?: boolean) => void;
  deleteEssential: (id: string) => void;
  addTemplate: (tmpl: Omit<EssentialTemplate, 'id'>) => void;
  deleteTemplate: (id: string) => void;
  populateFromTemplates: () => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  contributeToGoal: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  addSubscription: (sub: Omit<Subscription, 'id'>) => void;
  toggleSubscription: (id: string) => void;
  deleteSubscription: (id: string) => void;
  simulatePurchase: (amount: number, categoryId?: CategoryId) => SimulationResult;
  resetToDemo: () => void;
  clearAllData: () => void;
  importBackup: (backup: RupeeOSBackupData) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMonth, setActiveMonthState] = useState<string>(() => StorageService.getActiveMonth());
  const [plan, setPlan] = useState<MonthlyPlan>(() => StorageService.getPlan(activeMonth));
  const [transactions, setTransactions] = useState<Transaction[]>(() => StorageService.getTransactions());
  const [essentials, setEssentials] = useState<EssentialItem[]>(() => StorageService.getEssentials());
  const [templates, setTemplates] = useState<EssentialTemplate[]>(() => StorageService.getTemplates());
  const [goals, setGoals] = useState<Goal[]>(() => StorageService.getGoals());
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => StorageService.getSubscriptions());

  // Switch active month
  const setActiveMonth = (monthKey: string) => {
    setActiveMonthState(monthKey);
    StorageService.setActiveMonth(monthKey);
    const loadedPlan = StorageService.getPlan(monthKey);
    setPlan({
      ...loadedPlan,
      monthName: getMonthName(monthKey),
    });
  };

  // Sync state changes to storage
  useEffect(() => {
    StorageService.savePlan(plan);
  }, [plan]);

  useEffect(() => {
    StorageService.saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    StorageService.saveEssentials(essentials);
  }, [essentials]);

  useEffect(() => {
    StorageService.saveTemplates(templates);
  }, [templates]);

  useEffect(() => {
    StorageService.saveGoals(goals);
  }, [goals]);

  useEffect(() => {
    StorageService.saveSubscriptions(subscriptions);
  }, [subscriptions]);

  // Derived metrics
  const metrics = useMemo(() => {
    return calculateBurnRateMetrics(plan, transactions, essentials, subscriptions);
  }, [plan, transactions, essentials, subscriptions]);

  const healthScore = useMemo(() => {
    return calculateHealthScore(plan, metrics, transactions, goals);
  }, [plan, metrics, transactions, goals]);

  const alerts = useMemo(() => {
    return generateFinancialAlerts(plan, metrics, transactions, essentials, subscriptions);
  }, [plan, metrics, transactions, essentials, subscriptions]);

  // Action implementations
  const setAvailableMoney = (amount: number) => {
    setPlan(prev => ({
      ...prev,
      availableMoney: Math.max(0, amount),
      updatedAt: new Date().toISOString(),
    }));
  };

  const allocateCategory = (categoryId: CategoryId, amount: number) => {
    setPlan(prev => ({
      ...prev,
      allocations: {
        ...prev.allocations,
        [categoryId]: Math.max(0, amount),
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updatePlan = (updated: Partial<MonthlyPlan>) => {
    setPlan(prev => ({
      ...prev,
      ...updated,
      updatedAt: new Date().toISOString(),
    }));
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addEssential = (item: Omit<EssentialItem, 'id' | 'monthKey'>) => {
    const newItem: EssentialItem = {
      ...item,
      id: `ess-${Date.now()}`,
      monthKey: activeMonth,
    };
    setEssentials(prev => [...prev, newItem]);
  };

  const toggleEssential = (id: string, actualCost?: number, recordExpense: boolean = true) => {
    setEssentials(prev =>
      prev.map(e => {
        if (e.id === id) {
          const nextPurchased = !e.isPurchased;
          const costToRecord = actualCost !== undefined ? actualCost : e.estimatedCost;

          if (nextPurchased && recordExpense) {
            // Auto record expense
            addTransaction({
              type: 'expense',
              amount: costToRecord,
              categoryId: e.categoryId,
              note: `Essential: ${e.name} (${e.quantity} ${e.unit})`,
              merchant: e.preferredProvider.charAt(0).toUpperCase() + e.preferredProvider.slice(1),
              essentialId: e.id,
              date: new Date().toISOString().split('T')[0],
            });
          }

          return {
            ...e,
            isPurchased: nextPurchased,
            actualCost: nextPurchased ? costToRecord : undefined,
            purchasedDate: nextPurchased ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return e;
      })
    );
  };

  const deleteEssential = (id: string) => {
    setEssentials(prev => prev.filter(e => e.id !== id));
  };

  const addTemplate = (tmpl: Omit<EssentialTemplate, 'id'>) => {
    const newTmpl: EssentialTemplate = {
      ...tmpl,
      id: `tmpl-${Date.now()}`,
    };
    setTemplates(prev => [...prev, newTmpl]);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const populateFromTemplates = () => {
    const newItems: EssentialItem[] = templates.map(t => ({
      id: `ess-${Date.now()}-${t.id}`,
      name: t.name,
      quantity: t.defaultQuantity,
      unit: t.defaultUnit,
      estimatedCost: t.estimatedCost,
      isPurchased: false,
      preferredProvider: t.preferredProvider,
      categoryId: t.categoryId,
      monthKey: activeMonth,
    }));

    setEssentials(prev => [...prev, ...newItems]);
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: `goal-${Date.now()}`,
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const contributeToGoal = (id: string, amount: number) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === id) {
          const nextAmount = g.currentAmount + amount;
          return {
            ...g,
            currentAmount: nextAmount,
            isCompleted: nextAmount >= g.targetAmount,
          };
        }
        return g;
      })
    );

    // Also record transaction under Savings
    const goal = goals.find(g => g.id === id);
    if (goal) {
      addTransaction({
        type: 'expense',
        amount: amount,
        categoryId: 'savings',
        note: `Contributed to goal: ${goal.name}`,
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addSubscription = (sub: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = {
      ...sub,
      id: `sub-${Date.now()}`,
    };
    setSubscriptions(prev => [...prev, newSub]);
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions(prev =>
      prev.map(s => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  };

  const simulatePurchase = (amount: number, categoryId?: CategoryId): SimulationResult => {
    const currentAvailable = metrics.remainingMoney;
    const newAvailable = Math.max(0, currentAvailable - amount);

    // New safe daily spend with remaining commitments
    const newFlexible = Math.max(0, newAvailable - metrics.upcomingEssentialsTotal - metrics.upcomingSubscriptionsTotal);
    const newSafeDaily = metrics.daysRemaining > 0 ? Math.round(newFlexible / metrics.daysRemaining) : 0;

    let verdict: 'affordable' | 'tight' | 'not_recommended' = 'affordable';
    let verdictMessage = 'You can comfortably afford this purchase without compromising upcoming obligations.';

    if (amount > currentAvailable) {
      verdict = 'not_recommended';
      verdictMessage = 'This purchase exceeds your remaining money for this month!';
    } else if (newSafeDaily < 150) {
      verdict = 'not_recommended';
      verdictMessage = 'This will reduce your daily safe spend to an unsustainable level (< ₹150/day).';
    } else if (newSafeDaily < 300) {
      verdict = 'tight';
      verdictMessage = 'Possible, but leaves you with a tight daily budget for the rest of the month.';
    }

    let categoryImpact;
    if (categoryId) {
      const allocated = plan.allocations[categoryId] || 0;
      const spent = transactions
        .filter(t => t.date.startsWith(activeMonth) && t.type === 'expense' && t.categoryId === categoryId)
        .reduce((s, t) => s + t.amount, 0);
      const newTotalSpent = spent + amount;

      categoryImpact = {
        categoryId,
        currentAllocated: allocated,
        currentSpent: spent,
        newTotalSpent,
        willExceed: newTotalSpent > allocated,
      };
    }

    return {
      purchaseAmount: amount,
      currentAvailable,
      newAvailable,
      currentSafeDaily: metrics.safeDailySpend,
      newSafeDaily,
      daysRemaining: metrics.daysRemaining,
      verdict,
      verdictMessage,
      categoryImpact,
    };
  };

  const resetToDemo = () => {
    StorageService.resetToDemoData();
    setActiveMonth(StorageService.getActiveMonth());
    setPlan(StorageService.getPlan(StorageService.getActiveMonth()));
    setTransactions(StorageService.getTransactions());
    setEssentials(StorageService.getEssentials());
    setTemplates(StorageService.getTemplates());
    setGoals(StorageService.getGoals());
    setSubscriptions(StorageService.getSubscriptions());
  };

  const clearAllData = () => {
    StorageService.clearAll();
    setActiveMonth(activeMonth);
    setPlan(StorageService.getPlan(activeMonth));
    setTransactions([]);
    setEssentials([]);
    setGoals([]);
    setSubscriptions([]);
  };

  const importBackup = (backup: RupeeOSBackupData) => {
    if (backup.plans) {
      localStorage.setItem('rupeeos_plans_v1', JSON.stringify(backup.plans));
    }
    if (backup.transactions) {
      localStorage.setItem('rupeeos_transactions_v1', JSON.stringify(backup.transactions));
      setTransactions(backup.transactions);
    }
    if (backup.essentials) {
      localStorage.setItem('rupeeos_essentials_v1', JSON.stringify(backup.essentials));
      setEssentials(backup.essentials);
    }
    if (backup.goals) {
      localStorage.setItem('rupeeos_goals_v1', JSON.stringify(backup.goals));
      setGoals(backup.goals);
    }
    if (backup.subscriptions) {
      localStorage.setItem('rupeeos_subscriptions_v1', JSON.stringify(backup.subscriptions));
      setSubscriptions(backup.subscriptions);
    }
    if (backup.plans && backup.plans[activeMonth]) {
      setPlan(backup.plans[activeMonth]);
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        activeMonth,
        setActiveMonth,
        plan,
        transactions,
        essentials,
        templates,
        goals,
        subscriptions,
        metrics,
        healthScore,
        alerts,
        setAvailableMoney,
        allocateCategory,
        updatePlan,
        addTransaction,
        deleteTransaction,
        addEssential,
        toggleEssential,
        deleteEssential,
        addTemplate,
        deleteTemplate,
        populateFromTemplates,
        addGoal,
        contributeToGoal,
        deleteGoal,
        addSubscription,
        toggleSubscription,
        deleteSubscription,
        simulatePurchase,
        resetToDemo,
        clearAllData,
        importBackup,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

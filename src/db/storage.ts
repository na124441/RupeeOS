import {
  INITIAL_ESSENTIALS,
  INITIAL_GOALS,
  INITIAL_MONTH_KEY,
  INITIAL_PLAN,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_TEMPLATES,
  INITIAL_TRANSACTIONS,
} from './initialData';
import { EssentialItem, EssentialTemplate, Goal, MonthlyPlan, Subscription, Transaction } from '../types';

const STORAGE_KEYS = {
  PLANS: 'rupeeos_plans_v1',
  TRANSACTIONS: 'rupeeos_transactions_v1',
  ESSENTIALS: 'rupeeos_essentials_v1',
  TEMPLATES: 'rupeeos_templates_v1',
  GOALS: 'rupeeos_goals_v1',
  SUBSCRIPTIONS: 'rupeeos_subscriptions_v1',
  CURRENT_MONTH: 'rupeeos_active_month_v1',
};

export class StorageService {
  static getActiveMonth(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_MONTH) || INITIAL_MONTH_KEY;
  }

  static setActiveMonth(monthKey: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_MONTH, monthKey);
  }

  static getPlan(monthKey: string): MonthlyPlan {
    const raw = localStorage.getItem(STORAGE_KEYS.PLANS);
    if (raw) {
      try {
        const plans: Record<string, MonthlyPlan> = JSON.parse(raw);
        if (plans[monthKey]) return plans[monthKey];
      } catch (e) {
        console.error('Failed to parse plans from storage', e);
      }
    }

    if (monthKey === INITIAL_MONTH_KEY) {
      return INITIAL_PLAN;
    }

    // Default empty plan for any newly visited month
    return {
      monthKey,
      monthName: monthKey,
      availableMoney: 0,
      allocations: {
        essentials: 0,
        food: 0,
        transport: 0,
        education: 0,
        personal: 0,
        shopping: 0,
        savings: 0,
        emergency: 0,
        bills: 0,
        other: 0,
      },
      updatedAt: new Date().toISOString(),
    };
  }

  static savePlan(plan: MonthlyPlan): void {
    let plans: Record<string, MonthlyPlan> = {};
    const raw = localStorage.getItem(STORAGE_KEYS.PLANS);
    if (raw) {
      try {
        plans = JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    plans[plan.monthKey] = {
      ...plan,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }

  static getTransactions(): Transaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) return INITIAL_TRANSACTIONS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  }

  static saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  static getEssentials(): EssentialItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ESSENTIALS);
    if (!raw) return INITIAL_ESSENTIALS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ESSENTIALS;
    }
  }

  static saveEssentials(items: EssentialItem[]): void {
    localStorage.setItem(STORAGE_KEYS.ESSENTIALS, JSON.stringify(items));
  }

  static getTemplates(): EssentialTemplate[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (!raw) return INITIAL_TEMPLATES;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TEMPLATES;
    }
  }

  static saveTemplates(templates: EssentialTemplate[]): void {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  }

  static getGoals(): Goal[] {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!raw) return INITIAL_GOALS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_GOALS;
    }
  }

  static saveGoals(goals: Goal[]): void {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }

  static getSubscriptions(): Subscription[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    if (!raw) return INITIAL_SUBSCRIPTIONS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SUBSCRIPTIONS;
    }
  }

  static saveSubscriptions(subs: Subscription[]): void {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
  }

  static resetToDemoData(): void {
    const plans: Record<string, MonthlyPlan> = {
      [INITIAL_MONTH_KEY]: INITIAL_PLAN,
    };
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.ESSENTIALS, JSON.stringify(INITIAL_ESSENTIALS));
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(INITIAL_TEMPLATES));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(INITIAL_SUBSCRIPTIONS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_MONTH, INITIAL_MONTH_KEY);
  }

  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEYS.PLANS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.ESSENTIALS);
    localStorage.removeItem(STORAGE_KEYS.TEMPLATES);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTIONS);
  }
}

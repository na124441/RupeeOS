export type TransactionType = 'expense' | 'income';

export type CategoryId = 
  | 'essentials' 
  | 'food' 
  | 'transport' 
  | 'education' 
  | 'personal' 
  | 'shopping' 
  | 'savings' 
  | 'emergency' 
  | 'bills'
  | 'other';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  bgLight: string;
  isEssential: boolean;
  isSavings: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: CategoryId;
  note: string;
  date: string; // YYYY-MM-DD
  merchant?: string;
  essentialId?: string;
  isRecurring?: boolean;
  createdAt: string; // ISO string
}

export interface MonthlyPlan {
  monthKey: string; // e.g., "2026-09"
  monthName: string; // e.g., "September 2026"
  availableMoney: number;
  allocations: Record<CategoryId, number>;
  notes?: string;
  updatedAt: string;
}

export type ShoppingProvider = 'blinkit' | 'zepto' | 'instamart' | 'amazon';

export interface EssentialItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  estimatedCost: number;
  actualCost?: number;
  isPurchased: boolean;
  purchasedDate?: string;
  preferredProvider: ShoppingProvider;
  categoryId: CategoryId;
  monthKey: string; // "2026-09"
  notes?: string;
}

export interface EssentialTemplate {
  id: string;
  name: string;
  defaultQuantity: string;
  defaultUnit: string;
  estimatedCost: number;
  preferredProvider: ShoppingProvider;
  categoryId: CategoryId;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  category: string;
  icon: string;
  notes?: string;
  isCompleted?: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  dueDay: number; // 1 to 31
  categoryId: CategoryId;
  active: boolean;
  notes?: string;
}

export interface BurnRateMetrics {
  monthKey: string;
  monthName: string;
  availableMoney: number;
  totalAllocated: number;
  totalSpentThisMonth: number;
  totalIncomeThisMonth: number;
  remainingMoney: number;
  daysTotal: number;
  daysElapsed: number;
  daysRemaining: number;
  safeDailySpend: number;
  normalDailySpend: number;
  upcomingEssentialsTotal: number;
  upcomingSubscriptionsTotal: number;
  flexibleMoney: number;
  weeklyBudget: number;
  weeklySpent: number;
  projectedMonthEndSpend: number;
  isOverBudgetProjected: boolean;
  allocationGap: number; // Available - Allocated (positive = underallocated, negative = overallocated)
}

export interface HealthScoreFactor {
  name: string;
  score: number;
  maxScore: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface HealthScore {
  score: number; // 0 - 100
  rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
  factors: HealthScoreFactor[];
  summary: string;
}

export interface FinancialAlert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  actionTab?: string;
}

export interface SimulationResult {
  purchaseAmount: number;
  currentAvailable: number;
  newAvailable: number;
  currentSafeDaily: number;
  newSafeDaily: number;
  daysRemaining: number;
  verdict: 'affordable' | 'tight' | 'not_recommended';
  verdictMessage: string;
  categoryImpact?: {
    categoryId: CategoryId;
    currentAllocated: number;
    currentSpent: number;
    newTotalSpent: number;
    willExceed: boolean;
  };
}

export interface MonthRolloverOptions {
  surplusAction: 'carryover' | 'goal' | 'none';
  targetGoalId?: string;
  copyAllocations: boolean;
  populateEssentialsFromTemplates: boolean;
}

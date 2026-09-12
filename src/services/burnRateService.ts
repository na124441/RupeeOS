import { BurnRateMetrics, EssentialItem, MonthlyPlan, Subscription, Transaction } from '../types';
import { getDaysElapsedInMonth, getDaysInMonth, getDaysRemainingInMonth } from '../utils/dates';

export function calculateBurnRateMetrics(
  plan: MonthlyPlan,
  transactions: Transaction[],
  essentials: EssentialItem[],
  subscriptions: Subscription[],
  currentDateStr?: string
): BurnRateMetrics {
  const monthKey = plan.monthKey;
  const daysTotal = getDaysInMonth(monthKey);
  const daysElapsed = getDaysElapsedInMonth(monthKey, currentDateStr);
  const daysRemaining = getDaysRemainingInMonth(monthKey, currentDateStr);

  // Filter transactions for this specific month
  const monthTransactions = transactions.filter(t => t.date.startsWith(monthKey));
  
  const totalSpentThisMonth = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncomeThisMonth = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Total allocated across all categories in the plan
  const totalAllocated = Object.values(plan.allocations).reduce((sum, val) => sum + val, 0);

  // Available money minus expenses recorded
  // Note: If user set available money at start of month (e.g. ₹20,000)
  // Remaining money = availableMoney - totalSpentThisMonth (or including additional net income)
  const remainingMoney = Math.max(0, plan.availableMoney - totalSpentThisMonth);

  // Upcoming unpurchased essentials
  const upcomingEssentialsTotal = essentials
    .filter(e => e.monthKey === monthKey && !e.isPurchased)
    .reduce((sum, e) => sum + (e.estimatedCost || 0), 0);

  // Upcoming subscriptions (dueDay > currentDay)
  const currentDay = currentDateStr ? parseInt(currentDateStr.split('-')[2], 10) : new Date().getDate();
  const upcomingSubscriptionsTotal = subscriptions
    .filter(s => s.active && s.dueDay > currentDay)
    .reduce((sum, s) => sum + s.amount, 0);

  // Flexible money = Remaining money - Upcoming commitments
  const flexibleMoney = Math.max(0, remainingMoney - upcomingEssentialsTotal - upcomingSubscriptionsTotal);

  // Normal daily spend if spread evenly without upcoming commitments
  const normalDailySpend = daysRemaining > 0 ? Math.round(remainingMoney / daysRemaining) : 0;

  // Safe daily spending strictly considering essentials & subscriptions
  const safeDailySpend = daysRemaining > 0 ? Math.round(flexibleMoney / daysRemaining) : 0;

  // Weekly calculations
  // Current week spend: transactions in the last 7 days of the month
  const today = currentDateStr ? new Date(currentDateStr) : new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 6);
  const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0];

  const weeklySpent = monthTransactions
    .filter(t => t.type === 'expense' && t.date >= oneWeekAgoStr)
    .reduce((sum, t) => sum + t.amount, 0);

  // Weekly safe budget = safeDailySpend * 7
  const weeklyBudget = safeDailySpend * 7;

  // Projected month-end spending
  const avgDailySpendSoFar = daysElapsed > 0 ? totalSpentThisMonth / daysElapsed : 0;
  const projectedMonthEndSpend = Math.round(totalSpentThisMonth + (avgDailySpendSoFar * daysRemaining));
  const isOverBudgetProjected = projectedMonthEndSpend > plan.availableMoney;

  const allocationGap = plan.availableMoney - totalAllocated;

  return {
    monthKey,
    monthName: plan.monthName,
    availableMoney: plan.availableMoney,
    totalAllocated,
    totalSpentThisMonth,
    totalIncomeThisMonth,
    remainingMoney,
    daysTotal,
    daysElapsed,
    daysRemaining,
    safeDailySpend,
    normalDailySpend,
    upcomingEssentialsTotal,
    upcomingSubscriptionsTotal,
    flexibleMoney,
    weeklyBudget,
    weeklySpent,
    projectedMonthEndSpend,
    isOverBudgetProjected,
    allocationGap,
  };
}

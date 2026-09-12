import { BurnRateMetrics, CategoryId, EssentialItem, FinancialAlert, MonthlyPlan, Subscription, Transaction } from '../types';
import { CATEGORY_MAP } from '../constants/categories';
import { formatRupee } from '../utils/currency';

export function generateFinancialAlerts(
  plan: MonthlyPlan,
  metrics: BurnRateMetrics,
  transactions: Transaction[],
  essentials: EssentialItem[],
  subscriptions: Subscription[],
  currentDay: number = new Date().getDate()
): FinancialAlert[] {
  const alerts: FinancialAlert[] = [];

  // 1. Allocation Gap / Over-allocation Warning
  if (metrics.allocationGap < 0) {
    alerts.push({
      id: 'alert-overallocated',
      type: 'danger',
      title: 'Budget Over-allocated',
      message: `You have allocated ${formatRupee(Math.abs(metrics.allocationGap))} more than your available monthly money! Please adjust your category budgets.`,
      actionTab: 'planning',
    });
  }

  // 2. Projected Overspend Alert
  if (metrics.isOverBudgetProjected && metrics.daysRemaining > 0) {
    const overrun = metrics.projectedMonthEndSpend - metrics.availableMoney;
    alerts.push({
      id: 'alert-projected-overspend',
      type: 'warning',
      title: 'Month-end Overspend Projected',
      message: `At your current burn rate, you are projected to exceed your monthly money by ${formatRupee(overrun)}. Safe daily cap is ${formatRupee(metrics.safeDailySpend)}/day.`,
      actionTab: 'dashboard',
    });
  }

  // 3. Category High Utilization Check (e.g. Food, Shopping)
  const monthTransactions = transactions.filter(t => t.date.startsWith(plan.monthKey));
  const categorySpent: Partial<Record<CategoryId, number>> = {};
  for (const t of monthTransactions) {
    if (t.type === 'expense') {
      categorySpent[t.categoryId] = (categorySpent[t.categoryId] || 0) + t.amount;
    }
  }

  for (const [catId, allocated] of Object.entries(plan.allocations) as [CategoryId, number][]) {
    if (allocated > 0) {
      const spent = categorySpent[catId] || 0;
      const ratio = spent / allocated;
      const catName = CATEGORY_MAP[catId]?.name || catId;

      if (ratio >= 1.0) {
        alerts.push({
          id: `alert-cat-exceeded-${catId}`,
          type: 'danger',
          title: `${catName} Exceeded`,
          message: `You have spent ${formatRupee(spent)} of your ${formatRupee(allocated)} budget for ${catName} (${Math.round(ratio * 100)}%).`,
          actionTab: 'budget',
        });
      } else if (ratio >= 0.80 && metrics.daysRemaining >= 5) {
        alerts.push({
          id: `alert-cat-warning-${catId}`,
          type: 'warning',
          title: `${catName} Budget Alert`,
          message: `You've used ${(ratio * 100).toFixed(0)}% of your ${catName} budget with ${metrics.daysRemaining} days remaining in the month.`,
          actionTab: 'budget',
        });
      }
    }
  }

  // 4. Upcoming Subscriptions (within next 3 days)
  for (const sub of subscriptions) {
    if (sub.active) {
      const diff = sub.dueDay - currentDay;
      if (diff === 0) {
        alerts.push({
          id: `alert-sub-today-${sub.id}`,
          type: 'info',
          title: `Subscription Due Today`,
          message: `${sub.name} payment of ${formatRupee(sub.amount)} is scheduled for today.`,
          actionTab: 'subscriptions',
        });
      } else if (diff === 1) {
        alerts.push({
          id: `alert-sub-tomorrow-${sub.id}`,
          type: 'info',
          title: `Subscription Due Tomorrow`,
          message: `${sub.name} payment of ${formatRupee(sub.amount)} is scheduled for tomorrow.`,
          actionTab: 'subscriptions',
        });
      } else if (diff > 1 && diff <= 3) {
        alerts.push({
          id: `alert-sub-soon-${sub.id}`,
          type: 'info',
          title: `Upcoming Recurring Payment`,
          message: `${sub.name} (${formatRupee(sub.amount)}) is due in ${diff} days.`,
          actionTab: 'subscriptions',
        });
      }
    }
  }

  // 5. Essentials Reminder
  const unpurchasedCount = essentials.filter(e => e.monthKey === plan.monthKey && !e.isPurchased).length;
  if (unpurchasedCount > 0 && metrics.upcomingEssentialsTotal > 0) {
    alerts.push({
      id: 'alert-essentials-pending',
      type: 'info',
      title: 'Upcoming Essentials Committed',
      message: `${formatRupee(metrics.upcomingEssentialsTotal)} is reserved for ${unpurchasedCount} unpurchased monthly essentials.`,
      actionTab: 'essentials',
    });
  }

  // 6. Positive Safe-to-Spend Guidance
  if (alerts.length === 0 || (metrics.safeDailySpend > 300 && !metrics.isOverBudgetProjected)) {
    alerts.push({
      id: 'alert-safe-guidance',
      type: 'success',
      title: 'Financial Path on Track',
      message: `You can safely spend ${formatRupee(metrics.safeDailySpend)}/day while fulfilling all planned essentials, subscriptions, and savings!`,
      actionTab: 'dashboard',
    });
  }

  return alerts;
}

import { BurnRateMetrics, Goal, HealthScore, HealthScoreFactor, MonthlyPlan, Transaction } from '../types';

export function calculateHealthScore(
  plan: MonthlyPlan,
  metrics: BurnRateMetrics,
  transactions: Transaction[],
  goals: Goal[]
): HealthScore {
  const factors: HealthScoreFactor[] = [];
  let totalScore = 0;

  // 1. Budget Adherence & Allocation (Max 25 pts)
  const isOverAllocated = metrics.allocationGap < 0;
  const spendRatio = metrics.availableMoney > 0 
    ? metrics.totalSpentThisMonth / metrics.availableMoney 
    : 1;

  let budgetScore = 0;
  if (!isOverAllocated) {
    budgetScore += 10;
  }
  if (spendRatio <= (metrics.daysElapsed / metrics.daysTotal) * 1.05) {
    // Spending within linear pace
    budgetScore += 15;
    factors.push({
      name: 'Budget Adherence',
      score: budgetScore,
      maxScore: 25,
      impact: 'positive',
      description: 'Your spending pace is currently within your monthly plan.',
    });
  } else if (spendRatio <= 1.0) {
    budgetScore += 8;
    factors.push({
      name: 'Budget Adherence',
      score: budgetScore,
      maxScore: 25,
      impact: 'neutral',
      description: 'You are spending slightly faster than the elapsed days, but still under total budget.',
    });
  } else {
    budgetScore = 0;
    factors.push({
      name: 'Budget Adherence',
      score: 0,
      maxScore: 25,
      impact: 'negative',
      description: 'Current spending has exceeded your monthly budget allocation.',
    });
  }
  totalScore += budgetScore;

  // 2. Savings & Investments Rate (Max 20 pts)
  const savingsAllocated = (plan.allocations['savings'] || 0) + (plan.allocations['emergency'] || 0);
  const savingsRate = metrics.availableMoney > 0 ? savingsAllocated / metrics.availableMoney : 0;

  let savingsScore = 0;
  if (savingsRate >= 0.20) {
    savingsScore = 20;
    factors.push({
      name: 'Savings Rate',
      score: 20,
      maxScore: 20,
      impact: 'positive',
      description: `Solid ${(savingsRate * 100).toFixed(0)}% of monthly money dedicated to savings and emergency.`,
    });
  } else if (savingsRate >= 0.10) {
    savingsScore = 14;
    factors.push({
      name: 'Savings Rate',
      score: 14,
      maxScore: 20,
      impact: 'positive',
      description: `Saving ${(savingsRate * 100).toFixed(0)}% of money. Aim for 20%+ to maximize security.`,
    });
  } else if (savingsRate > 0) {
    savingsScore = 7;
    factors.push({
      name: 'Savings Rate',
      score: 7,
      maxScore: 20,
      impact: 'neutral',
      description: 'Modest savings allocation this month. Try to bump it up.',
    });
  } else {
    savingsScore = 0;
    factors.push({
      name: 'Savings Rate',
      score: 0,
      maxScore: 20,
      impact: 'negative',
      description: 'No savings allocated for this month.',
    });
  }
  totalScore += savingsScore;

  // 3. Essential Buffer & Obligations Coverage (Max 20 pts)
  const upcomingCommitted = metrics.upcomingEssentialsTotal + metrics.upcomingSubscriptionsTotal;
  let essentialScore = 0;
  if (metrics.remainingMoney >= upcomingCommitted && metrics.safeDailySpend >= 200) {
    essentialScore = 20;
    factors.push({
      name: 'Obligations Buffer',
      score: 20,
      maxScore: 20,
      impact: 'positive',
      description: 'Remaining balance comfortably covers all upcoming essentials and subscriptions.',
    });
  } else if (metrics.remainingMoney >= upcomingCommitted) {
    essentialScore = 12;
    factors.push({
      name: 'Obligations Buffer',
      score: 12,
      maxScore: 20,
      impact: 'neutral',
      description: 'Commitments are covered, but safe daily spending is tight.',
    });
  } else {
    essentialScore = 0;
    factors.push({
      name: 'Obligations Buffer',
      score: 0,
      maxScore: 20,
      impact: 'negative',
      description: 'Remaining balance cannot cover upcoming essential purchases and subscriptions.',
    });
  }
  totalScore += essentialScore;

  // 4. Burn Rate & Forecast Sustainability (Max 20 pts)
  let burnScore = 0;
  if (!metrics.isOverBudgetProjected && metrics.safeDailySpend > 300) {
    burnScore = 20;
    factors.push({
      name: 'Spending Sustainability',
      score: 20,
      maxScore: 20,
      impact: 'positive',
      description: 'Burn rate is sustainable with a strong daily safety buffer.',
    });
  } else if (!metrics.isOverBudgetProjected) {
    burnScore = 13;
    factors.push({
      name: 'Spending Sustainability',
      score: 13,
      maxScore: 20,
      impact: 'neutral',
      description: 'Projected to stay within budget, though burn rate is moderate.',
    });
  } else {
    burnScore = 2;
    factors.push({
      name: 'Spending Sustainability',
      score: 2,
      maxScore: 20,
      impact: 'negative',
      description: 'Current pace projects an overspend by month-end.',
    });
  }
  totalScore += burnScore;

  // 5. Goal Progress (Max 15 pts)
  let goalScore = 0;
  const activeGoals = goals.filter(g => !g.isCompleted);
  if (activeGoals.length > 0) {
    const fundedGoals = activeGoals.filter(g => g.currentAmount > 0);
    const avgFundingRatio = fundedGoals.length / activeGoals.length;
    goalScore = Math.round(avgFundingRatio * 15);
    factors.push({
      name: 'Goal Funding',
      score: goalScore,
      maxScore: 15,
      impact: goalScore >= 10 ? 'positive' : 'neutral',
      description: `${fundedGoals.length} of ${activeGoals.length} active goals have accumulated savings.`,
    });
  } else {
    goalScore = 8;
    factors.push({
      name: 'Goal Funding',
      score: 8,
      maxScore: 15,
      impact: 'neutral',
      description: 'No active savings goals set. Create one to level up your score.',
    });
  }
  totalScore += goalScore;

  // Clamp total to 0-100
  totalScore = Math.max(0, Math.min(100, Math.round(totalScore)));

  let rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention' = 'Fair';
  let summary = '';

  if (totalScore >= 85) {
    rating = 'Excellent';
    summary = 'Outstanding financial discipline! You have zero over-allocation, healthy savings, and smooth burn-rate control.';
  } else if (totalScore >= 70) {
    rating = 'Good';
    summary = 'Strong financial foundation. Your essential commitments are safe and your daily spending is well within limits.';
  } else if (totalScore >= 50) {
    rating = 'Fair';
    summary = 'Decent position, but watch discretionary spending or increase your emergency reserve to buffer fluctuations.';
  } else {
    rating = 'Needs Attention';
    summary = 'Warning: Spending burn rate or upcoming obligations require immediate budget rebalancing.';
  }

  return {
    score: totalScore,
    rating,
    factors,
    summary,
  };
}

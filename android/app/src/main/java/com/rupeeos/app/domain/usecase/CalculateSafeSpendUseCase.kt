package com.rupeeos.app.domain.usecase

import com.rupeeos.app.core.util.DateUtils
import com.rupeeos.app.domain.model.*
import java.util.Calendar

class CalculateSafeSpendUseCase {
    operator fun invoke(
        plan: MonthlyPlan,
        transactions: List<Transaction>,
        essentials: List<EssentialItem>,
        subscriptions: List<Subscription>
    ): BurnRateMetrics {
        val monthKey = plan.monthKey
        val daysTotal = DateUtils.getDaysInMonth(monthKey)
        val daysElapsed = DateUtils.getDaysElapsedInMonth(monthKey)
        val daysRemaining = DateUtils.getDaysRemainingInMonth(monthKey)

        val monthTransactions = transactions.filter { it.date.startsWith(monthKey) }

        val totalSpent = monthTransactions
            .filter { it.type == TransactionType.EXPENSE }
            .sumOf { it.amount }

        val totalAllocated = plan.allocations.values.sum()

        // Balance remaining
        val remainingMoney = (plan.availableMoney - totalSpent).coerceAtLeast(0L)

        // Upcoming unpurchased essentials for this month
        val upcomingEssentialsTotal = essentials
            .filter { it.monthKey == monthKey && !it.isPurchased }
            .sumOf { it.estimatedCost }

        // Upcoming subscriptions due this month after current day
        val currentDay = Calendar.getInstance().get(Calendar.DAY_OF_MONTH)
        val upcomingSubscriptionsTotal = subscriptions
            .filter { it.active && it.dueDay > currentDay }
            .sumOf { it.amount }

        // Flexible Pool = Remaining - Upcoming Commitments
        val flexibleMoney = (remainingMoney - upcomingEssentialsTotal - upcomingSubscriptionsTotal).coerceAtLeast(0L)

        // Safe daily burn rate
        val safeDailySpend = if (daysRemaining > 0) flexibleMoney / daysRemaining else 0L
        val normalDailySpend = if (daysRemaining > 0) remainingMoney / daysRemaining else 0L

        val weeklyBudget = safeDailySpend * 7
        val weeklySpent = monthTransactions
            .filter { it.type == TransactionType.EXPENSE }
            .take(7)
            .sumOf { it.amount }

        val avgDailySoFar = if (daysElapsed > 0) totalSpent.toDouble() / daysElapsed else 0.0
        val projectedMonthEndSpend = (totalSpent + (avgDailySoFar * daysRemaining)).toLong()
        val isOverBudgetProjected = projectedMonthEndSpend > plan.availableMoney

        val allocationGap = plan.availableMoney - totalAllocated

        return BurnRateMetrics(
            monthKey = monthKey,
            availableMoney = plan.availableMoney,
            totalAllocated = totalAllocated,
            totalSpent = totalSpent,
            remainingMoney = remainingMoney,
            upcomingEssentialsTotal = upcomingEssentialsTotal,
            upcomingSubscriptionsTotal = upcomingSubscriptionsTotal,
            flexibleMoney = flexibleMoney,
            daysRemaining = daysRemaining,
            safeDailySpend = safeDailySpend,
            normalDailySpend = normalDailySpend,
            weeklyBudget = weeklyBudget,
            weeklySpent = weeklySpent,
            projectedMonthEndSpend = projectedMonthEndSpend,
            isOverBudgetProjected = isOverBudgetProjected,
            allocationGap = allocationGap
        )
    }
}

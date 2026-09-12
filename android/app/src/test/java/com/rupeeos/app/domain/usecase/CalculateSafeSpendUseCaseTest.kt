package com.rupeeos.app.domain.usecase

import com.rupeeos.app.domain.model.*
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class CalculateSafeSpendUseCaseTest {

    private val useCase = CalculateSafeSpendUseCase()

    @Test
    fun testSafeDailySpendCalculation() {
        val plan = MonthlyPlan(
            monthKey = "2026-09",
            availableMoney = 50000L,
            allocations = mapOf("essentials" to 25000L, "food" to 15000L, "savings" to 10000L)
        )

        val transactions = listOf(
            Transaction(
                id = "1",
                type = TransactionType.EXPENSE,
                amount = 15000L,
                categoryId = "food",
                note = "Groceries & Dining",
                date = "2026-09-05"
            )
        )

        val essentials = listOf(
            EssentialItem(
                id = "e1",
                name = "Milk",
                quantity = "1",
                unit = "pkt",
                estimatedCost = 2500L,
                isPurchased = false,
                monthKey = "2026-09"
            )
        )

        val subscriptions = listOf(
            Subscription(
                id = "s1",
                name = "Electricity",
                amount = 1500L,
                dueDay = 28, // Future due day
                categoryId = "bills"
            )
        )

        val metrics = useCase(plan, transactions, essentials, subscriptions)

        // Remaining = 50000 - 15000 = 35000
        assertEquals(35000L, metrics.remainingMoney)

        // Upcoming commitments = 2500 + 1500 = 4000
        assertEquals(2500L, metrics.upcomingEssentialsTotal)
        assertEquals(1500L, metrics.upcomingSubscriptionsTotal)

        // Flexible = 35000 - 4000 = 31000
        assertEquals(31000L, metrics.flexibleMoney)

        // Safe daily spend must be strictly positive
        assertTrue(metrics.safeDailySpend > 0)
        assertEquals(metrics.safeDailySpend * 7, metrics.weeklyBudget)
    }

    @Test
    fun testFlexibleMoneyNeverDropsBelowZero() {
        val plan = MonthlyPlan(
            monthKey = "2026-09",
            availableMoney = 5000L,
            allocations = emptyMap()
        )

        val transactions = listOf(
            Transaction(
                id = "1",
                type = TransactionType.EXPENSE,
                amount = 10000L, // Overspent
                categoryId = "other",
                note = "Large unexpected bill",
                date = "2026-09-02"
            )
        )

        val metrics = useCase(plan, transactions, emptyList(), emptyList())

        // Negative balance floor check
        assertEquals(0L, metrics.remainingMoney)
        assertEquals(0L, metrics.flexibleMoney)
        assertEquals(0L, metrics.safeDailySpend)
    }
}

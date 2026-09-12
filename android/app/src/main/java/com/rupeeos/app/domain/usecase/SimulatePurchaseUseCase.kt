package com.rupeeos.app.domain.usecase

import com.rupeeos.app.domain.model.BurnRateMetrics
import com.rupeeos.app.domain.model.SimulationResult

class SimulatePurchaseUseCase {
    operator fun invoke(amount: Long, metrics: BurnRateMetrics): SimulationResult {
        val daysRem = metrics.daysRemaining.coerceAtLeast(1)
        val newAvailable = (metrics.remainingMoney - amount).coerceAtLeast(0L)
        val newFlexible = (metrics.flexibleMoney - amount).coerceAtLeast(0L)
        val newSafeDaily = newFlexible / daysRem

        val (verdict, message) = when {
            amount > metrics.remainingMoney -> {
                "NOT_RECOMMENDED" to "This purchase exceeds your remaining balance by ₹${amount - metrics.remainingMoney}."
            }
            amount > metrics.flexibleMoney -> {
                "TIGHT" to "Affordable only if you cannibalize reserved essentials or upcoming bills."
            }
            newSafeDaily < 200 -> {
                "TIGHT" to "Purchase will restrict your safe daily spend to ₹$newSafeDaily / day."
            }
            else -> {
                "AFFORDABLE" to "Fits cleanly within your flexible budget with ₹$newSafeDaily / day safe burn remaining."
            }
        }

        return SimulationResult(
            purchaseAmount = amount,
            currentAvailable = metrics.remainingMoney,
            newAvailable = newAvailable,
            currentSafeDaily = metrics.safeDailySpend,
            newSafeDaily = newSafeDaily,
            verdict = verdict,
            verdictMessage = message
        )
    }
}

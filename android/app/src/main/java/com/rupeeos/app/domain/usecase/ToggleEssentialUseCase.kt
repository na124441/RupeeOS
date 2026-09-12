package com.rupeeos.app.domain.usecase

import com.rupeeos.app.core.util.DateUtils
import com.rupeeos.app.domain.model.EssentialItem
import com.rupeeos.app.domain.model.Transaction
import com.rupeeos.app.domain.model.TransactionType
import com.rupeeos.app.domain.repository.FinanceRepository
import java.util.UUID

class ToggleEssentialUseCase(
    private val repository: FinanceRepository
) {
    suspend operator fun invoke(
        item: EssentialItem,
        actualCost: Long? = null,
        recordExpense: Boolean = true
    ) {
        val nextPurchased = !item.isPurchased
        val finalCost = actualCost ?: item.estimatedCost

        val updatedItem = item.copy(
            isPurchased = nextPurchased,
            actualCost = if (nextPurchased) finalCost else null,
            purchasedDate = if (nextPurchased) DateUtils.getCurrentDateString() else null
        )
        repository.updateEssential(updatedItem)

        if (nextPurchased && recordExpense) {
            val transaction = Transaction(
                id = "tx-${System.currentTimeMillis()}-${UUID.randomUUID().toString().take(5)}",
                type = TransactionType.EXPENSE,
                amount = finalCost,
                categoryId = item.categoryId,
                note = "Essential: ${item.name} (${item.quantity} ${item.unit})",
                merchant = item.preferredProvider.displayName,
                essentialId = item.id,
                date = DateUtils.getCurrentDateString()
            )
            repository.addTransaction(transaction)
        }
    }
}

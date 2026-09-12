package com.rupeeos.app.domain.usecase

import com.rupeeos.app.core.util.DateUtils
import com.rupeeos.app.domain.model.Transaction
import com.rupeeos.app.domain.model.TransactionType
import com.rupeeos.app.domain.repository.FinanceRepository
import java.util.UUID

class RecordExpenseUseCase(
    private val repository: FinanceRepository
) {
    suspend operator fun invoke(
        amount: Long,
        categoryId: String,
        note: String,
        merchant: String? = null,
        date: String = DateUtils.getCurrentDateString()
    ) {
        val transaction = Transaction(
            id = "tx-${System.currentTimeMillis()}-${UUID.randomUUID().toString().take(5)}",
            type = TransactionType.EXPENSE,
            amount = amount,
            categoryId = categoryId,
            note = note,
            merchant = merchant,
            date = date
        )
        repository.addTransaction(transaction)
    }
}

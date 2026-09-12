package com.rupeeos.app.domain.repository

import com.rupeeos.app.domain.model.*
import kotlinx.coroutines.flow.Flow

interface FinanceRepository {
    fun getTransactionsForMonth(monthKey: String): Flow<List<Transaction>>
    suspend fun addTransaction(transaction: Transaction)
    suspend fun deleteTransaction(id: String)

    fun getPlanForMonth(monthKey: String): Flow<MonthlyPlan?>
    suspend fun updatePlan(plan: MonthlyPlan)

    fun getEssentialsForMonth(monthKey: String): Flow<List<EssentialItem>>
    suspend fun addEssential(item: EssentialItem)
    suspend fun updateEssential(item: EssentialItem)
    suspend fun deleteEssential(id: String)

    fun getAllGoals(): Flow<List<Goal>>
    suspend fun addGoal(goal: Goal)
    suspend fun contributeToGoal(id: String, amount: Long)
    suspend fun deleteGoal(id: String)

    fun getActiveSubscriptions(): Flow<List<Subscription>>
    suspend fun addSubscription(subscription: Subscription)
    suspend fun deleteSubscription(id: String)

    suspend fun resetToDemoData()
    suspend fun clearAllData()
}

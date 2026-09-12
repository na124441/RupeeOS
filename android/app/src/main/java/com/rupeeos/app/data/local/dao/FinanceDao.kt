package com.rupeeos.app.data.local.dao

import androidx.room.*
import com.rupeeos.app.data.local.entity.*
import kotlinx.coroutines.flow.Flow

@Dao
interface FinanceDao {
    // Transactions
    @Query("SELECT * FROM transactions ORDER BY date DESC, createdAt DESC")
    fun getAllTransactions(): Flow<List<TransactionEntity>>

    @Query("SELECT * FROM transactions WHERE date LIKE :monthKey || '%' ORDER BY date DESC, createdAt DESC")
    fun getTransactionsForMonth(monthKey: String): Flow<List<TransactionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTransaction(transaction: TransactionEntity)

    @Delete
    suspend fun deleteTransaction(transaction: TransactionEntity)

    @Query("DELETE FROM transactions WHERE id = :id")
    suspend fun deleteTransactionById(id: String)

    // Monthly Plans
    @Query("SELECT * FROM monthly_plans WHERE monthKey = :monthKey LIMIT 1")
    fun getPlanForMonth(monthKey: String): Flow<MonthlyPlanEntity?>

    @Query("SELECT * FROM monthly_plans WHERE monthKey = :monthKey LIMIT 1")
    suspend fun getPlanForMonthSync(monthKey: String): MonthlyPlanEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdatePlan(plan: MonthlyPlanEntity)

    // Essentials
    @Query("SELECT * FROM essentials WHERE monthKey = :monthKey ORDER BY isPurchased ASC, name ASC")
    fun getEssentialsForMonth(monthKey: String): Flow<List<EssentialItemEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEssential(item: EssentialItemEntity)

    @Update
    suspend fun updateEssential(item: EssentialItemEntity)

    @Query("DELETE FROM essentials WHERE id = :id")
    suspend fun deleteEssentialById(id: String)

    // Goals
    @Query("SELECT * FROM goals ORDER BY targetDate ASC")
    fun getAllGoals(): Flow<List<GoalEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertGoal(goal: GoalEntity)

    @Update
    suspend fun updateGoal(goal: GoalEntity)

    @Query("DELETE FROM goals WHERE id = :id")
    suspend fun deleteGoalById(id: String)

    // Subscriptions
    @Query("SELECT * FROM subscriptions WHERE active = 1 ORDER BY dueDay ASC")
    fun getActiveSubscriptions(): Flow<List<SubscriptionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSubscription(sub: SubscriptionEntity)

    @Update
    suspend fun updateSubscription(sub: SubscriptionEntity)

    @Query("DELETE FROM subscriptions WHERE id = :id")
    suspend fun deleteSubscriptionById(id: String)

    // Batch Clear / Reset
    @Query("DELETE FROM transactions")
    suspend fun clearTransactions()

    @Query("DELETE FROM monthly_plans")
    suspend fun clearPlans()

    @Query("DELETE FROM essentials")
    suspend fun clearEssentials()

    @Query("DELETE FROM goals")
    suspend fun clearGoals()

    @Query("DELETE FROM subscriptions")
    suspend fun clearSubscriptions()
}

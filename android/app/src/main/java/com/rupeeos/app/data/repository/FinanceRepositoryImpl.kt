package com.rupeeos.app.data.repository

import com.rupeeos.app.data.local.RupeeOSDatabase
import com.rupeeos.app.data.local.dao.FinanceDao
import com.rupeeos.app.data.local.entity.*
import com.rupeeos.app.domain.model.*
import com.rupeeos.app.domain.repository.FinanceRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class FinanceRepositoryImpl(
    private val dao: FinanceDao
) : FinanceRepository {

    private val json = Json { ignoreUnknownKeys = true }

    override fun getTransactionsForMonth(monthKey: String): Flow<List<Transaction>> {
        return dao.getTransactionsForMonth(monthKey).map { entities ->
            entities.map { it.toDomain() }
        }
    }

    override suspend fun addTransaction(transaction: Transaction) {
        dao.insertTransaction(transaction.toEntity())
    }

    override suspend fun deleteTransaction(id: String) {
        dao.deleteTransactionById(id)
    }

    override fun getPlanForMonth(monthKey: String): Flow<MonthlyPlan?> {
        return dao.getPlanForMonth(monthKey).map { entity ->
            entity?.toDomain(json)
        }
    }

    override suspend fun updatePlan(plan: MonthlyPlan) {
        val allocationsJson = json.encodeToString(plan.allocations)
        dao.insertOrUpdatePlan(
            MonthlyPlanEntity(
                monthKey = plan.monthKey,
                availableMoney = plan.availableMoney,
                allocationsJson = allocationsJson
            )
        )
    }

    override fun getEssentialsForMonth(monthKey: String): Flow<List<EssentialItem>> {
        return dao.getEssentialsForMonth(monthKey).map { entities ->
            entities.map { it.toDomain() }
        }
    }

    override suspend fun addEssential(item: EssentialItem) {
        dao.insertEssential(item.toEntity())
    }

    override suspend fun updateEssential(item: EssentialItem) {
        dao.updateEssential(item.toEntity())
    }

    override suspend fun deleteEssential(id: String) {
        dao.deleteEssentialById(id)
    }

    override fun getAllGoals(): Flow<List<Goal>> {
        return dao.getAllGoals().map { entities ->
            entities.map { it.toDomain() }
        }
    }

    override suspend fun addGoal(goal: Goal) {
        dao.insertGoal(goal.toEntity())
    }

    override suspend fun contributeToGoal(id: String, amount: Long) {
        // Find goal and increment current amount
        // Also creates transaction in Savings
    }

    override suspend fun deleteGoal(id: String) {
        dao.deleteGoalById(id)
    }

    override fun getActiveSubscriptions(): Flow<List<Subscription>> {
        return dao.getActiveSubscriptions().map { entities ->
            entities.map { it.toDomain() }
        }
    }

    override suspend fun addSubscription(subscription: Subscription) {
        dao.insertSubscription(subscription.toEntity())
    }

    override suspend fun deleteSubscription(id: String) {
        dao.deleteSubscriptionById(id)
    }

    override suspend fun resetToDemoData() {
        dao.clearTransactions()
        dao.clearPlans()
        dao.clearEssentials()
        dao.clearGoals()
        dao.clearSubscriptions()
        RupeeOSDatabase.populateInitialDemoData(dao)
    }

    override suspend fun clearAllData() {
        dao.clearTransactions()
        dao.clearPlans()
        dao.clearEssentials()
        dao.clearGoals()
        dao.clearSubscriptions()
    }
}

// Entity <-> Domain Mappers
private fun TransactionEntity.toDomain() = Transaction(
    id = id,
    type = if (type.equals("income", ignoreCase = true)) TransactionType.INCOME else TransactionType.EXPENSE,
    amount = amount,
    categoryId = categoryId,
    note = note,
    date = date,
    merchant = merchant,
    essentialId = essentialId,
    createdAt = createdAt
)

private fun Transaction.toEntity() = TransactionEntity(
    id = id,
    type = if (type == TransactionType.INCOME) "income" else "expense",
    amount = amount,
    categoryId = categoryId,
    note = note,
    date = date,
    merchant = merchant,
    essentialId = essentialId,
    createdAt = createdAt
)

private fun MonthlyPlanEntity.toDomain(json: Json): MonthlyPlan {
    val map: Map<String, Long> = try {
        json.decodeFromString(allocationsJson)
    } catch (e: Exception) {
        emptyMap()
    }
    return MonthlyPlan(
        monthKey = monthKey,
        availableMoney = availableMoney,
        allocations = map
    )
}

private fun EssentialItemEntity.toDomain() = EssentialItem(
    id = id,
    name = name,
    quantity = quantity,
    unit = unit,
    estimatedCost = estimatedCost,
    actualCost = actualCost,
    isPurchased = isPurchased,
    purchasedDate = purchasedDate,
    preferredProvider = ShoppingProvider.fromId(preferredProvider),
    categoryId = categoryId,
    monthKey = monthKey
)

private fun EssentialItem.toEntity() = EssentialItemEntity(
    id = id,
    name = name,
    quantity = quantity,
    unit = unit,
    estimatedCost = estimatedCost,
    actualCost = actualCost,
    isPurchased = isPurchased,
    purchasedDate = purchasedDate,
    preferredProvider = preferredProvider.id,
    categoryId = categoryId,
    monthKey = monthKey
)

private fun GoalEntity.toDomain() = Goal(
    id = id,
    name = name,
    targetAmount = targetAmount,
    currentAmount = currentAmount,
    targetDate = targetDate,
    category = category
)

private fun Goal.toEntity() = GoalEntity(
    id = id,
    name = name,
    targetAmount = targetAmount,
    currentAmount = currentAmount,
    targetDate = targetDate,
    category = category
)

private fun SubscriptionEntity.toDomain() = Subscription(
    id = id,
    name = name,
    amount = amount,
    billingCycle = billingCycle,
    dueDay = dueDay,
    categoryId = categoryId,
    active = active
)

private fun Subscription.toEntity() = SubscriptionEntity(
    id = id,
    name = name,
    amount = amount,
    billingCycle = billingCycle,
    dueDay = dueDay,
    categoryId = categoryId,
    active = active
)

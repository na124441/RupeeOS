package com.rupeeos.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "transactions")
data class TransactionEntity(
    @PrimaryKey val id: String,
    val type: String, // "expense" or "income"
    val amount: Long,
    val categoryId: String,
    val note: String,
    val date: String, // YYYY-MM-DD
    val merchant: String? = null,
    val essentialId: String? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val isSynced: Boolean = true
)

@Entity(tableName = "monthly_plans")
data class MonthlyPlanEntity(
    @PrimaryKey val monthKey: String, // "2026-09"
    val availableMoney: Long,
    val allocationsJson: String, // JSON map of CategoryId -> Amount
    val updatedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "essentials")
data class EssentialItemEntity(
    @PrimaryKey val id: String,
    val name: String,
    val quantity: String,
    val unit: String,
    val estimatedCost: Long,
    val actualCost: Long? = null,
    val isPurchased: Boolean = false,
    val purchasedDate: String? = null,
    val preferredProvider: String = "blinkit",
    val categoryId: String = "essentials",
    val monthKey: String
)

@Entity(tableName = "goals")
data class GoalEntity(
    @PrimaryKey val id: String,
    val name: String,
    val targetAmount: Long,
    val currentAmount: Long,
    val targetDate: String,
    val category: String = "Gear"
)

@Entity(tableName = "subscriptions")
data class SubscriptionEntity(
    @PrimaryKey val id: String,
    val name: String,
    val amount: Long,
    val billingCycle: String = "monthly",
    val dueDay: Int, // 1 to 31
    val categoryId: String = "bills",
    val active: Boolean = true
)

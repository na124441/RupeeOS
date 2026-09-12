package com.rupeeos.app.domain.model

import androidx.compose.ui.graphics.Color
import com.rupeeos.app.core.design.theme.*

enum class TransactionType {
    EXPENSE, INCOME
}

data class Category(
    val id: String,
    val name: String,
    val color: Color,
    val isEssential: Boolean = false,
    val isSavings: Boolean = false
)

object Categories {
    val ALL = listOf(
        Category("essentials", "Essentials & Groceries", CategoryEssentials, isEssential = true),
        Category("bills", "Bills & Subscriptions", CategoryBills, isEssential = true),
        Category("food", "Food & Dining", CategoryFood),
        Category("transport", "Transport & Commute", CategoryTransport),
        Category("shopping", "Shopping & Gear", CategoryShopping),
        Category("personal", "Personal Care", CategoryPersonal),
        Category("education", "Education & Learning", CategoryEducation),
        Category("savings", "Savings & Investments", CategorySavings, isSavings = true),
        Category("emergency", "Emergency Fund", CategoryEmergency, isSavings = true),
        Category("other", "Other & Miscellaneous", CategoryOther)
    )

    fun get(id: String): Category {
        return ALL.find { it.id == id } ?: Category(id, id.replaceFirstChar { it.uppercase() }, CategoryOther)
    }
}

data class Transaction(
    val id: String,
    val type: TransactionType,
    val amount: Long,
    val categoryId: String,
    val note: String,
    val date: String, // YYYY-MM-DD
    val merchant: String? = null,
    val essentialId: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)

data class MonthlyPlan(
    val monthKey: String,
    val availableMoney: Long,
    val allocations: Map<String, Long>
)

enum class ShoppingProvider(
    val id: String,
    val displayName: String,
    val brandColor: Color
) {
    BLINKIT("blinkit", "Blinkit", Color(0xFFF7D000)),
    ZEPTO("zepto", "Zepto", Color(0xFF7C3AED)),
    INSTAMART("instamart", "Swiggy Instamart", Color(0xFFFC8019)),
    AMAZON("amazon", "Amazon Fresh", Color(0xFFFF9900));

    fun getSearchUrl(query: String): String {
        val encoded = java.net.URLEncoder.encode(query, "UTF-8")
        return when (this) {
            BLINKIT -> "https://blinkit.com/s/?q=$encoded"
            ZEPTO -> "https://www.zeptonow.com/search?query=$encoded"
            INSTAMART -> "https://www.swiggy.com/instamart/search?query=$encoded"
            AMAZON -> "https://www.amazon.in/s?k=$encoded"
        }
    }

    companion object {
        fun fromId(id: String): ShoppingProvider {
            return entries.find { it.id.equals(id, ignoreCase = true) } ?: BLINKIT
        }
    }
}

data class EssentialItem(
    val id: String,
    val name: String,
    val quantity: String,
    val unit: String,
    val estimatedCost: Long,
    val actualCost: Long? = null,
    val isPurchased: Boolean = false,
    val purchasedDate: String? = null,
    val preferredProvider: ShoppingProvider = ShoppingProvider.BLINKIT,
    val categoryId: String = "essentials",
    val monthKey: String
)

data class Goal(
    val id: String,
    val name: String,
    val targetAmount: Long,
    val currentAmount: Long,
    val targetDate: String,
    val category: String = "Gear"
) {
    val progress: Float
        get() = if (targetAmount > 0) (currentAmount.toFloat() / targetAmount.toFloat()).coerceIn(0f, 1f) else 0f

    val remainingAmount: Long
        get() = (targetAmount - currentAmount).coerceAtLeast(0)
}

data class Subscription(
    val id: String,
    val name: String,
    val amount: Long,
    val billingCycle: String = "monthly",
    val dueDay: Int,
    val categoryId: String = "bills",
    val active: Boolean = true
)

data class BurnRateMetrics(
    val monthKey: String,
    val availableMoney: Long,
    val totalAllocated: Long,
    val totalSpent: Long,
    val remainingMoney: Long,
    val upcomingEssentialsTotal: Long,
    val upcomingSubscriptionsTotal: Long,
    val flexibleMoney: Long,
    val daysRemaining: Int,
    val safeDailySpend: Long,
    val normalDailySpend: Long,
    val weeklyBudget: Long,
    val weeklySpent: Long,
    val projectedMonthEndSpend: Long,
    val isOverBudgetProjected: Boolean,
    val allocationGap: Long
)

data class SimulationResult(
    val purchaseAmount: Long,
    val currentAvailable: Long,
    val newAvailable: Long,
    val currentSafeDaily: Long,
    val newSafeDaily: Long,
    val verdict: String, // "AFFORDABLE", "TIGHT", "NOT_RECOMMENDED"
    val verdictMessage: String
)

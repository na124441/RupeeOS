package com.rupeeos.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.rupeeos.app.data.local.dao.FinanceDao
import com.rupeeos.app.data.local.entity.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        TransactionEntity::class,
        MonthlyPlanEntity::class,
        EssentialItemEntity::class,
        GoalEntity::class,
        SubscriptionEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class RupeeOSDatabase : RoomDatabase() {
    abstract fun financeDao(): FinanceDao

    companion object {
        @Volatile
        private var INSTANCE: RupeeOSDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): RupeeOSDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    RupeeOSDatabase::class.java,
                    "rupeeos.db"
                )
                    .addCallback(DatabaseCallback(scope))
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateInitialDemoData(database.financeDao())
                    }
                }
            }
        }

        suspend fun populateInitialDemoData(dao: FinanceDao) {
            val currentMonthKey = "2026-09"

            // 1. Initial Plan
            val initialAllocationsJson = """
                {
                    "essentials": 6500,
                    "bills": 3500,
                    "transport": 2500,
                    "food": 5500,
                    "shopping": 3000,
                    "personal": 1500,
                    "education": 1000,
                    "savings": 5000,
                    "emergency": 2000,
                    "other": 0
                }
            """.trimIndent()

            dao.insertOrUpdatePlan(
                MonthlyPlanEntity(
                    monthKey = currentMonthKey,
                    availableMoney = 35000,
                    allocationsJson = initialAllocationsJson
                )
            )

            // 2. Initial Transactions
            dao.insertTransaction(
                TransactionEntity(
                    id = "tx-1",
                    type = "expense",
                    amount = 620,
                    categoryId = "essentials",
                    note = "Weekly groceries (Milk, Bread, Veggies)",
                    date = "$currentMonthKey-03",
                    merchant = "Blinkit"
                )
            )
            dao.insertTransaction(
                TransactionEntity(
                    id = "tx-2",
                    type = "expense",
                    amount = 1450,
                    categoryId = "bills",
                    note = "Electricity Bill",
                    date = "$currentMonthKey-05",
                    merchant = "Bescom"
                )
            )
            dao.insertTransaction(
                TransactionEntity(
                    id = "tx-3",
                    type = "expense",
                    amount = 480,
                    categoryId = "food",
                    note = "Dinner takeout",
                    date = "$currentMonthKey-08",
                    merchant = "Swiggy"
                )
            )

            // 3. Initial Essentials
            dao.insertEssential(
                EssentialItemEntity(
                    id = "ess-1",
                    name = "Toned Milk",
                    quantity = "2",
                    unit = "packets",
                    estimatedCost = 130,
                    actualCost = 130,
                    isPurchased = true,
                    purchasedDate = "$currentMonthKey-03",
                    preferredProvider = "blinkit",
                    categoryId = "essentials",
                    monthKey = currentMonthKey
                )
            )
            dao.insertEssential(
                EssentialItemEntity(
                    id = "ess-2",
                    name = "Rolled Oats",
                    quantity = "1",
                    unit = "kg",
                    estimatedCost = 180,
                    actualCost = null,
                    isPurchased = false,
                    preferredProvider = "zepto",
                    categoryId = "essentials",
                    monthKey = currentMonthKey
                )
            )
            dao.insertEssential(
                EssentialItemEntity(
                    id = "ess-3",
                    name = "Basmati Rice",
                    quantity = "5",
                    unit = "kg",
                    estimatedCost = 450,
                    actualCost = null,
                    isPurchased = false,
                    preferredProvider = "instamart",
                    categoryId = "essentials",
                    monthKey = currentMonthKey
                )
            )

            // 4. Initial Goals
            dao.insertGoal(
                GoalEntity(
                    id = "goal-1",
                    name = "RTX 4080 Gaming Laptop",
                    targetAmount = 150000,
                    currentAmount = 45000,
                    targetDate = "2026-12-31",
                    category = "Gear"
                )
            )
            dao.insertGoal(
                GoalEntity(
                    id = "goal-2",
                    name = "Emergency Reserve",
                    targetAmount = 60000,
                    currentAmount = 28000,
                    targetDate = "2026-11-30",
                    category = "Safety"
                )
            )

            // 5. Initial Subscriptions
            dao.insertSubscription(
                SubscriptionEntity(
                    id = "sub-1",
                    name = "Spotify Premium",
                    amount = 119,
                    dueDay = 18,
                    categoryId = "bills"
                )
            )
            dao.insertSubscription(
                SubscriptionEntity(
                    id = "sub-2",
                    name = "Netflix UHD",
                    amount = 649,
                    dueDay = 24,
                    categoryId = "bills"
                )
            )
            dao.insertSubscription(
                SubscriptionEntity(
                    id = "sub-3",
                    name = "Fiber Broadband",
                    amount = 999,
                    dueDay = 5,
                    categoryId = "bills"
                )
            )
        }
    }
}

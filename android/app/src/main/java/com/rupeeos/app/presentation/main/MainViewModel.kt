package com.rupeeos.app.presentation.main

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.rupeeos.app.core.util.DateUtils
import com.rupeeos.app.domain.model.*
import com.rupeeos.app.domain.repository.FinanceRepository
import com.rupeeos.app.domain.usecase.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class MainUiState(
    val activeMonthKey: String = DateUtils.getCurrentMonthKey(),
    val activeMonthDisplayName: String = DateUtils.formatMonthName(DateUtils.getCurrentMonthKey()),
    val plan: MonthlyPlan? = null,
    val transactions: List<Transaction> = emptyList(),
    val essentials: List<EssentialItem> = emptyList(),
    val goals: List<Goal> = emptyList(),
    val subscriptions: List<Subscription> = emptyList(),
    val metrics: BurnRateMetrics? = null,
    val isLoading: Boolean = true
)

class MainViewModel(
    private val repository: FinanceRepository
) : ViewModel() {

    private val calculateSafeSpendUseCase = CalculateSafeSpendUseCase()
    private val recordExpenseUseCase = RecordExpenseUseCase(repository)
    private val toggleEssentialUseCase = ToggleEssentialUseCase(repository)
    private val simulatePurchaseUseCase = SimulatePurchaseUseCase()

    private val _activeMonthKey = MutableStateFlow(DateUtils.getCurrentMonthKey())
    val activeMonthKey: StateFlow<String> = _activeMonthKey.asStateFlow()

    val uiState: StateFlow<MainUiState> = _activeMonthKey
        .flatMapLatest { monthKey ->
            combine(
                repository.getPlanForMonth(monthKey),
                repository.getTransactionsForMonth(monthKey),
                repository.getEssentialsForMonth(monthKey),
                repository.getAllGoals(),
                repository.getActiveSubscriptions()
            ) { plan, transactions, essentials, goals, subscriptions ->
                val fallbackPlan = plan ?: MonthlyPlan(
                    monthKey = monthKey,
                    availableMoney = 0L,
                    allocations = emptyMap()
                )

                val metrics = calculateSafeSpendUseCase(
                    plan = fallbackPlan,
                    transactions = transactions,
                    essentials = essentials,
                    subscriptions = subscriptions
                )

                MainUiState(
                    activeMonthKey = monthKey,
                    activeMonthDisplayName = DateUtils.formatMonthName(monthKey),
                    plan = fallbackPlan,
                    transactions = transactions,
                    essentials = essentials,
                    goals = goals,
                    subscriptions = subscriptions,
                    metrics = metrics,
                    isLoading = false
                )
            }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = MainUiState()
        )

    fun switchMonth(newMonthKey: String) {
        _activeMonthKey.value = newMonthKey
    }

    fun setAvailableMoney(amount: Long) {
        viewModelScope.launch {
            val currentPlan = uiState.value.plan ?: return@launch
            repository.updatePlan(currentPlan.copy(availableMoney = amount))
        }
    }

    fun allocateCategory(categoryId: String, amount: Long) {
        viewModelScope.launch {
            val currentPlan = uiState.value.plan ?: return@launch
            val newAllocations = currentPlan.allocations.toMutableMap()
            newAllocations[categoryId] = amount
            repository.updatePlan(currentPlan.copy(allocations = newAllocations))
        }
    }

    fun apply503020Rule() {
        viewModelScope.launch {
            val currentPlan = uiState.value.plan ?: return@launch
            if (currentPlan.availableMoney <= 0) return@launch

            val total = currentPlan.availableMoney
            val needs = (total * 0.50).toLong()
            val wants = (total * 0.30).toLong()
            val savings = (total * 0.20).toLong()

            val allocations = mapOf(
                "essentials" to (needs * 0.50).toLong(),
                "bills" to (needs * 0.25).toLong(),
                "transport" to (needs * 0.25).toLong(),
                "food" to (wants * 0.45).toLong(),
                "shopping" to (wants * 0.30).toLong(),
                "personal" to (wants * 0.15).toLong(),
                "education" to (wants * 0.10).toLong(),
                "savings" to (savings * 0.70).toLong(),
                "emergency" to (savings * 0.30).toLong()
            )

            repository.updatePlan(currentPlan.copy(allocations = allocations))
        }
    }

    fun recordExpense(amount: Long, categoryId: String, note: String, merchant: String?) {
        viewModelScope.launch {
            recordExpenseUseCase(
                amount = amount,
                categoryId = categoryId,
                note = note,
                merchant = merchant
            )
        }
    }

    fun recordIncome(amount: Long, note: String) {
        viewModelScope.launch {
            val tx = Transaction(
                id = "tx-${System.currentTimeMillis()}",
                type = TransactionType.INCOME,
                amount = amount,
                categoryId = "other",
                note = note,
                date = DateUtils.getCurrentDateString()
            )
            repository.addTransaction(tx)
        }
    }

    fun toggleEssential(item: EssentialItem, actualCost: Long? = null, recordExpense: Boolean = true) {
        viewModelScope.launch {
            toggleEssentialUseCase(item, actualCost, recordExpense)
        }
    }

    fun addEssential(
        name: String,
        quantity: String,
        unit: String,
        estimatedCost: Long,
        provider: ShoppingProvider
    ) {
        viewModelScope.launch {
            val item = EssentialItem(
                id = "ess-${System.currentTimeMillis()}",
                name = name,
                quantity = quantity,
                unit = unit,
                estimatedCost = estimatedCost,
                preferredProvider = provider,
                monthKey = _activeMonthKey.value
            )
            repository.addEssential(item)
        }
    }

    fun deleteEssential(id: String) {
        viewModelScope.launch {
            repository.deleteEssential(id)
        }
    }

    fun deleteTransaction(id: String) {
        viewModelScope.launch {
            repository.deleteTransaction(id)
        }
    }

    fun addGoal(name: String, targetAmount: Long, targetDate: String, category: String) {
        viewModelScope.launch {
            val goal = Goal(
                id = "goal-${System.currentTimeMillis()}",
                name = name,
                targetAmount = targetAmount,
                currentAmount = 0L,
                targetDate = targetDate,
                category = category
            )
            repository.addGoal(goal)
        }
    }

    fun contributeToGoal(goal: Goal, amount: Long) {
        viewModelScope.launch {
            val updated = goal.copy(currentAmount = goal.currentAmount + amount)
            repository.addGoal(updated)
            // Also log savings expense
            recordExpense(
                amount = amount,
                categoryId = "savings",
                note = "Goal Deposit: ${goal.name}",
                merchant = "Savings Reserve"
            )
        }
    }

    fun simulatePurchase(amount: Long): SimulationResult? {
        val metrics = uiState.value.metrics ?: return null
        return simulatePurchaseUseCase(amount, metrics)
    }

    fun resetToDemo() {
        viewModelScope.launch {
            repository.resetToDemoData()
            _activeMonthKey.value = "2026-09"
        }
    }

    fun clearAll() {
        viewModelScope.launch {
            repository.clearAllData()
        }
    }

    companion object {
        fun provideFactory(repository: FinanceRepository): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return MainViewModel(repository) as T
                }
            }
    }
}

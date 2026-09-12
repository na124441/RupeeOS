package com.rupeeos.app.presentation.navigation

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.*
import com.rupeeos.app.core.design.theme.FinanceTheme
import com.rupeeos.app.core.design.theme.PillShape
import com.rupeeos.app.core.util.DateUtils
import com.rupeeos.app.presentation.budget.BudgetScreen
import com.rupeeos.app.presentation.essentials.EssentialsScreen
import com.rupeeos.app.presentation.expenses.AddExpenseSheet
import com.rupeeos.app.presentation.goals.GoalsScreen
import com.rupeeos.app.presentation.home.HomeScreen
import com.rupeeos.app.presentation.insights.InsightsScreen
import com.rupeeos.app.presentation.main.MainViewModel
import com.rupeeos.app.presentation.settings.SettingsScreen
import com.rupeeos.app.presentation.simulator.SimulatorScreen

@Composable
fun MainNavigationScaffold(
    viewModel: MainViewModel
) {
    val navController = rememberNavController()
    val uiState by viewModel.uiState.collectAsState()
    var isAddExpenseSheetOpen by remember { mutableStateOf(false) }
    var isAddIncomeDialogOpen by remember { mutableStateOf(false) }

    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    Scaffold(
        containerColor = FinanceTheme.colors.bgApp,
        topBar = {
            // Global Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .statusBarsPadding()
                    .background(FinanceTheme.colors.bgSurface)
                    .border(
                        androidx.compose.foundation.BorderStroke(
                            1.dp,
                            FinanceTheme.colors.borderApp
                        )
                    )
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Logo & Title
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(FinanceTheme.colors.accentPrimary),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("₹", color = Color.Black, fontWeight = FontWeight.Black, fontSize = 16.sp)
                    }
                    Text(
                        text = "RupeeOS",
                        fontWeight = FontWeight.Black,
                        fontSize = 18.sp,
                        color = FinanceTheme.colors.textPrimary
                    )
                }

                // Month Switcher
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    modifier = Modifier
                        .clip(PillShape)
                        .background(FinanceTheme.colors.bgElevated)
                        .border(1.dp, FinanceTheme.colors.borderSubtle, PillShape)
                        .padding(horizontal = 4.dp, vertical = 2.dp)
                ) {
                    IconButton(
                        onClick = {
                            viewModel.switchMonth(DateUtils.getPreviousMonthKey(uiState.activeMonthKey))
                        },
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(
                            Icons.Default.ChevronLeft,
                            contentDescription = "Previous Month",
                            modifier = Modifier.size(16.dp),
                            tint = FinanceTheme.colors.textSecondary
                        )
                    }

                    Text(
                        text = uiState.activeMonthDisplayName.split(" ").first(),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = FinanceTheme.colors.textPrimary,
                        modifier = Modifier.padding(horizontal = 4.dp)
                    )

                    IconButton(
                        onClick = {
                            viewModel.switchMonth(DateUtils.getNextMonthKey(uiState.activeMonthKey))
                        },
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(
                            Icons.Default.ChevronRight,
                            contentDescription = "Next Month",
                            modifier = Modifier.size(16.dp),
                            tint = FinanceTheme.colors.textSecondary
                        )
                    }
                }

                // Quick Settings Action
                IconButton(
                    onClick = { navController.navigate(Screen.Settings.route) },
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(
                        Icons.Default.Settings,
                        contentDescription = "Settings",
                        tint = FinanceTheme.colors.textSecondary
                    )
                }
            }
        },
        bottomBar = {
            NavigationBar(
                containerColor = FinanceTheme.colors.bgSurface,
                tonalElevation = 8.dp,
                modifier = Modifier.border(
                    androidx.compose.foundation.BorderStroke(
                        1.dp,
                        FinanceTheme.colors.borderApp
                    )
                )
            ) {
                // Home
                NavigationBarItem(
                    icon = { Icon(Screen.Home.selectedIcon, contentDescription = "Home") },
                    label = { Text("Home", fontSize = 11.sp) },
                    selected = currentDestination?.route == Screen.Home.route,
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = FinanceTheme.colors.accentPrimary,
                        selectedTextColor = FinanceTheme.colors.accentPrimary,
                        indicatorColor = FinanceTheme.colors.accentSurface,
                        unselectedIconColor = FinanceTheme.colors.textMuted,
                        unselectedTextColor = FinanceTheme.colors.textMuted
                    ),
                    onClick = {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )

                // Budget
                NavigationBarItem(
                    icon = { Icon(Screen.Budget.selectedIcon, contentDescription = "Budget") },
                    label = { Text("Budget", fontSize = 11.sp) },
                    selected = currentDestination?.route == Screen.Budget.route,
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = FinanceTheme.colors.accentPrimary,
                        selectedTextColor = FinanceTheme.colors.accentPrimary,
                        indicatorColor = FinanceTheme.colors.accentSurface,
                        unselectedIconColor = FinanceTheme.colors.textMuted,
                        unselectedTextColor = FinanceTheme.colors.textMuted
                    ),
                    onClick = {
                        navController.navigate(Screen.Budget.route) {
                            popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )

                // Central Quick Add Action Button
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(FinanceTheme.colors.accentPrimary)
                        .clickable { isAddExpenseSheetOpen = true },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Default.Add,
                        contentDescription = "Add Expense",
                        tint = Color.Black,
                        modifier = Modifier.size(24.dp)
                    )
                }

                // Essentials
                NavigationBarItem(
                    icon = { Icon(Screen.Essentials.selectedIcon, contentDescription = "Essentials") },
                    label = { Text("Essentials", fontSize = 11.sp) },
                    selected = currentDestination?.route == Screen.Essentials.route,
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = FinanceTheme.colors.accentPrimary,
                        selectedTextColor = FinanceTheme.colors.accentPrimary,
                        indicatorColor = FinanceTheme.colors.accentSurface,
                        unselectedIconColor = FinanceTheme.colors.textMuted,
                        unselectedTextColor = FinanceTheme.colors.textMuted
                    ),
                    onClick = {
                        navController.navigate(Screen.Essentials.route) {
                            popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )

                // Insights
                NavigationBarItem(
                    icon = { Icon(Screen.Insights.selectedIcon, contentDescription = "Insights") },
                    label = { Text("Insights", fontSize = 11.sp) },
                    selected = currentDestination?.route == Screen.Insights.route,
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = FinanceTheme.colors.accentPrimary,
                        selectedTextColor = FinanceTheme.colors.accentPrimary,
                        indicatorColor = FinanceTheme.colors.accentSurface,
                        unselectedIconColor = FinanceTheme.colors.textMuted,
                        unselectedTextColor = FinanceTheme.colors.textMuted
                    ),
                    onClick = {
                        navController.navigate(Screen.Insights.route) {
                            popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(paddingValues)
        ) {
            composable(Screen.Home.route) {
                HomeScreen(
                    uiState = uiState,
                    onOpenAddExpense = { isAddExpenseSheetOpen = true },
                    onOpenAddIncome = { isAddIncomeDialogOpen = true },
                    onNavigateToSimulator = { navController.navigate(Screen.Simulator.route) },
                    onNavigateToEssentials = { navController.navigate(Screen.Essentials.route) },
                    onDeleteTransaction = { viewModel.deleteTransaction(it) }
                )
            }

            composable(Screen.Budget.route) {
                BudgetScreen(
                    uiState = uiState,
                    onSetAvailableMoney = { viewModel.setAvailableMoney(it) },
                    onAllocateCategory = { cat, amt -> viewModel.allocateCategory(cat, amt) },
                    onApply503020Rule = { viewModel.apply503020Rule() }
                )
            }

            composable(Screen.Essentials.route) {
                EssentialsScreen(
                    uiState = uiState,
                    onToggleEssential = { item, cost, record ->
                        viewModel.toggleEssential(item, cost, record)
                    },
                    onAddEssential = { name, qty, unit, cost, provider ->
                        viewModel.addEssential(name, qty, unit, cost, provider)
                    }
                )
            }

            composable(Screen.Insights.route) {
                InsightsScreen(uiState = uiState)
            }

            composable(Screen.Goals.route) {
                GoalsScreen(
                    uiState = uiState,
                    onAddGoal = { name, target, date, cat ->
                        viewModel.addGoal(name, target, date, cat)
                    },
                    onContribute = { goal, amt ->
                        viewModel.contributeToGoal(goal, amt)
                    }
                )
            }

            composable(Screen.Simulator.route) {
                SimulatorScreen(
                    uiState = uiState,
                    onSimulate = { viewModel.simulatePurchase(it) },
                    onRecordExpense = { amt, cat, note, merch ->
                        viewModel.recordExpense(amt, cat, note, merch)
                        navController.navigate(Screen.Home.route)
                    }
                )
            }

            composable(Screen.Settings.route) {
                SettingsScreen(
                    onResetToDemo = {
                        viewModel.resetToDemo()
                        navController.navigate(Screen.Home.route)
                    },
                    onClearAll = { viewModel.clearAll() }
                )
            }
        }
    }

    // Rapid Add Expense Sheet
    if (isAddExpenseSheetOpen) {
        AddExpenseSheet(
            onDismiss = { isAddExpenseSheetOpen = false },
            onSave = { amount, categoryId, note, merchant ->
                viewModel.recordExpense(amount, categoryId, note, merchant)
            }
        )
    }

    // Add Income Dialog
    if (isAddIncomeDialogOpen) {
        var incomeAmount by remember { mutableStateOf("") }
        var incomeSource by remember { mutableStateOf("Salary / Inflow") }

        AlertDialog(
            onDismissRequest = { isAddIncomeDialogOpen = false },
            title = { Text("Record Inflow / Income", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = incomeAmount,
                        onValueChange = { if (it.all { c -> c.isDigit() }) incomeAmount = it },
                        label = { Text("Amount (₹)") },
                        singleLine = true
                    )
                    OutlinedTextField(
                        value = incomeSource,
                        onValueChange = { incomeSource = it },
                        label = { Text("Source / Note") },
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val amt = incomeAmount.toLongOrNull() ?: 0L
                        if (amt > 0) {
                            viewModel.recordIncome(amt, incomeSource)
                            isAddIncomeDialogOpen = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = FinanceTheme.colors.accentPrimary,
                        contentColor = Color.Black
                    )
                ) {
                    Text("Save Inflow", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { isAddIncomeDialogOpen = false }) {
                    Text("Cancel", color = FinanceTheme.colors.textMuted)
                }
            },
            containerColor = FinanceTheme.colors.bgSurface,
            shape = RoundedCornerShape(24.dp)
        )
    }
}

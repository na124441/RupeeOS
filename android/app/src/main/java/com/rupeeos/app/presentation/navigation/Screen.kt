package com.rupeeos.app.presentation.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    data object Home : Screen("home", "Home", Icons.Filled.Home, Icons.Outlined.Home)
    data object Budget : Screen("budget", "Budget", Icons.Filled.AccountBalanceWallet, Icons.Outlined.AccountBalanceWallet)
    data object Essentials : Screen("essentials", "Essentials", Icons.Filled.ShoppingCart, Icons.Outlined.ShoppingCart)
    data object Insights : Screen("insights", "Insights", Icons.Filled.Analytics, Icons.Outlined.Analytics)
    data object Goals : Screen("goals", "Goals", Icons.Filled.Savings, Icons.Outlined.Savings)
    data object Simulator : Screen("simulator", "Simulator", Icons.Filled.Calculate, Icons.Outlined.Calculate)
    data object Settings : Screen("settings", "Settings", Icons.Filled.Settings, Icons.Outlined.Settings)

    companion object {
        val bottomNavItems = listOf(Home, Budget, Essentials, Insights)
    }
}

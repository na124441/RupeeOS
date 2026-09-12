package com.rupeeos.app.presentation.home

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rupeeos.app.core.design.component.FinanceCard
import com.rupeeos.app.core.design.component.StatusBadge
import com.rupeeos.app.core.design.component.StatusBadgeType
import com.rupeeos.app.core.design.component.TabularCurrencyText
import com.rupeeos.app.core.design.theme.FinanceTheme
import com.rupeeos.app.core.design.theme.PillShape
import com.rupeeos.app.core.util.CurrencyFormatter
import com.rupeeos.app.domain.model.Categories
import com.rupeeos.app.domain.model.Transaction
import com.rupeeos.app.domain.model.TransactionType
import com.rupeeos.app.presentation.main.MainUiState

@Composable
fun HomeScreen(
    uiState: MainUiState,
    onOpenAddExpense: () -> Unit,
    onOpenAddIncome: () -> Unit,
    onNavigateToSimulator: () -> Unit,
    onNavigateToEssentials: () -> Unit,
    onDeleteTransaction: (String) -> Unit
) {
    var showMathExplanation by remember { mutableStateOf(false) }
    val metrics = uiState.metrics

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(FinanceTheme.colors.bgApp)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 96.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Month Header & Local-First Pill
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "FINANCIAL COMMAND CENTER",
                        style = MaterialTheme.typography.labelSmall,
                        color = FinanceTheme.colors.textMuted
                    )
                    Text(
                        text = uiState.activeMonthDisplayName,
                        style = MaterialTheme.typography.titleLarge,
                        color = FinanceTheme.colors.textPrimary
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(PillShape)
                        .background(FinanceTheme.colors.bgElevated)
                        .border(1.dp, FinanceTheme.colors.borderSubtle, PillShape)
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(6.dp)
                                .clip(CircleShape)
                                .background(FinanceTheme.colors.statusSuccess)
                        )
                        Text(
                            text = "Local-First",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = FinanceTheme.colors.textSecondary
                        )
                    }
                }
            }
        }

        // Hero: Safe Daily Spend Card
        item {
            val safeBurn = metrics?.safeDailySpend ?: 0L
            FinanceCard(
                modifier = Modifier.fillMaxWidth(),
                borderColor = FinanceTheme.colors.borderAccent,
                onClick = { showMathExplanation = true }
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Column {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocalFireDepartment,
                                contentDescription = null,
                                tint = FinanceTheme.colors.statusWarning,
                                modifier = Modifier.size(18.dp)
                            )
                            Text(
                                text = "SAFE TO SPEND TODAY",
                                style = MaterialTheme.typography.labelSmall,
                                color = FinanceTheme.colors.statusWarning
                            )
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Row(verticalAlignment = Alignment.Bottom) {
                            TabularCurrencyText(
                                amount = safeBurn,
                                fontSize = 38.sp,
                                color = FinanceTheme.colors.textPrimary,
                                fontWeight = FontWeight.Black
                            )
                            Text(
                                text = " / day",
                                fontSize = 14.sp,
                                color = FinanceTheme.colors.textMuted,
                                modifier = Modifier.padding(bottom = 6.dp, start = 4.dp)
                            )
                        }
                    }

                    StatusBadge(
                        text = "${metrics?.daysRemaining ?: 0} days left",
                        type = StatusBadgeType.NEUTRAL
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))
                Text(
                    text = "Tap to see how this is calculated from your flexible budget and upcoming commitments.",
                    fontSize = 12.sp,
                    color = FinanceTheme.colors.textSecondary
                )
            }
        }

        // 4-Stat Metric Row
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                MetricMiniCard(
                    title = "Available",
                    amount = metrics?.availableMoney ?: 0L,
                    color = FinanceTheme.colors.accentPrimary,
                    modifier = Modifier.weight(1f)
                )
                MetricMiniCard(
                    title = "Spent",
                    amount = metrics?.totalSpent ?: 0L,
                    color = FinanceTheme.colors.statusWarning,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                MetricMiniCard(
                    title = "Committed",
                    amount = (metrics?.upcomingEssentialsTotal ?: 0L) + (metrics?.upcomingSubscriptionsTotal ?: 0L),
                    color = FinanceTheme.colors.statusInfo,
                    modifier = Modifier.weight(1f)
                )
                MetricMiniCard(
                    title = "Flexible Pool",
                    amount = metrics?.flexibleMoney ?: 0L,
                    color = FinanceTheme.colors.statusSuccess,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Fast Action Buttons Row
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = onOpenAddExpense,
                    modifier = Modifier
                        .weight(1f)
                        .height(48.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = FinanceTheme.colors.accentPrimary,
                        contentColor = Color.Black
                    )
                ) {
                    Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Expense", fontWeight = FontWeight.Bold)
                }

                OutlinedButton(
                    onClick = onOpenAddIncome,
                    modifier = Modifier
                        .weight(1f)
                        .height(48.dp),
                    shape = RoundedCornerShape(14.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, FinanceTheme.colors.borderApp),
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = FinanceTheme.colors.textPrimary
                    )
                ) {
                    Icon(Icons.Default.ArrowDownward, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Income", fontWeight = FontWeight.Bold)
                }

                OutlinedButton(
                    onClick = onNavigateToSimulator,
                    modifier = Modifier
                        .weight(1f)
                        .height(48.dp),
                    shape = RoundedCornerShape(14.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, FinanceTheme.colors.borderApp),
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = FinanceTheme.colors.textPrimary
                    )
                ) {
                    Icon(Icons.Default.Calculate, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("What-If?", fontWeight = FontWeight.Bold)
                }
            }
        }

        // Pending Essentials Snapshot
        val unpurchasedCount = uiState.essentials.count { !it.isPurchased }
        if (unpurchasedCount > 0) {
            item {
                FinanceCard(
                    modifier = Modifier.fillMaxWidth(),
                    backgroundColor = FinanceTheme.colors.bgElevated,
                    onClick = onNavigateToEssentials
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Icon(
                                Icons.Default.ShoppingCart,
                                contentDescription = null,
                                tint = FinanceTheme.colors.statusWarning
                            )
                            Column {
                                Text(
                                    text = "$unpurchasedCount Essentials To Buy",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = FinanceTheme.colors.textPrimary
                                )
                                Text(
                                    text = "Reserved: ${CurrencyFormatter.format(metrics?.upcomingEssentialsTotal ?: 0L)}",
                                    fontSize = 12.sp,
                                    color = FinanceTheme.colors.textMuted
                                )
                            }
                        }
                        Icon(
                            Icons.Default.ChevronRight,
                            contentDescription = null,
                            tint = FinanceTheme.colors.textMuted
                        )
                    }
                }
            }
        }

        // Recent Activity Section
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "RECENT TRANSACTIONS",
                    style = MaterialTheme.typography.labelSmall,
                    color = FinanceTheme.colors.textMuted
                )
                Text(
                    text = "${uiState.transactions.size} total",
                    fontSize = 12.sp,
                    color = FinanceTheme.colors.textMuted
                )
            }
        }

        if (uiState.transactions.isEmpty()) {
            item {
                FinanceCard(modifier = Modifier.fillMaxWidth()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "No transactions recorded yet this month.\nTap '+ Expense' above to get started.",
                            color = FinanceTheme.colors.textMuted,
                            fontSize = 13.sp,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                    }
                }
            }
        } else {
            items(uiState.transactions.take(8)) { tx ->
                TransactionRow(transaction = tx, onDelete = { onDeleteTransaction(tx.id) })
            }
        }
    }

    // Math Explanation Dialog
    if (showMathExplanation) {
        AlertDialog(
            onDismissRequest = { showMathExplanation = false },
            title = {
                Text(
                    text = "Safe Daily Spend Formula",
                    fontWeight = FontWeight.Bold,
                    color = FinanceTheme.colors.textPrimary
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "RupeeOS ensures you never run out of money by reserving your known obligations before dividing:",
                        fontSize = 13.sp,
                        color = FinanceTheme.colors.textSecondary
                    )

                    FinanceCard(backgroundColor = FinanceTheme.colors.bgApp) {
                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text(
                                text = "1. Remaining Balance = Available (₹${metrics?.availableMoney ?: 0}) - Spent (₹${metrics?.totalSpent ?: 0}) = ₹${metrics?.remainingMoney ?: 0}",
                                fontSize = 12.sp,
                                fontFamily = FontFamily.Monospace,
                                color = FinanceTheme.colors.textPrimary
                            )
                            Text(
                                text = "2. Commitments = Essentials (₹${metrics?.upcomingEssentialsTotal ?: 0}) + Bills (₹${metrics?.upcomingSubscriptionsTotal ?: 0})",
                                fontSize = 12.sp,
                                fontFamily = FontFamily.Monospace,
                                color = FinanceTheme.colors.statusInfo
                            )
                            Text(
                                text = "3. Flexible Pool = Balance - Commitments = ₹${metrics?.flexibleMoney ?: 0}",
                                fontSize = 12.sp,
                                fontFamily = FontFamily.Monospace,
                                color = FinanceTheme.colors.statusSuccess
                            )
                            Text(
                                text = "4. Safe Burn = Flexible Pool ÷ ${metrics?.daysRemaining ?: 1} days = ₹${metrics?.safeDailySpend ?: 0} / day",
                                fontSize = 12.sp,
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Bold,
                                color = FinanceTheme.colors.accentPrimary
                            )
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showMathExplanation = false }) {
                    Text("Got it", color = FinanceTheme.colors.accentPrimary)
                }
            },
            containerColor = FinanceTheme.colors.bgSurface,
            shape = RoundedCornerShape(24.dp)
        )
    }
}

@Composable
fun MetricMiniCard(
    title: String,
    amount: Long,
    color: Color,
    modifier: Modifier = Modifier
) {
    FinanceCard(
        modifier = modifier,
        backgroundColor = FinanceTheme.colors.bgSurface,
        contentPadding = PaddingValues(12.dp)
    ) {
        Text(
            text = title.uppercase(),
            style = MaterialTheme.typography.labelSmall,
            color = FinanceTheme.colors.textMuted
        )
        Spacer(modifier = Modifier.height(2.dp))
        TabularCurrencyText(
            amount = amount,
            fontSize = 18.sp,
            color = color,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
fun TransactionRow(
    transaction: Transaction,
    onDelete: () -> Unit
) {
    val category = Categories.get(transaction.categoryId)
    val isExpense = transaction.type == TransactionType.EXPENSE

    FinanceCard(
        modifier = Modifier.fillMaxWidth(),
        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(category.color.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(category.color)
                    )
                }

                Column {
                    Text(
                        text = transaction.note.ifBlank { category.name },
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = FinanceTheme.colors.textPrimary
                    )
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = category.name,
                            fontSize = 11.sp,
                            color = FinanceTheme.colors.textMuted
                        )
                        if (!transaction.merchant.isNullOrBlank()) {
                            Text(text = "•", fontSize = 11.sp, color = FinanceTheme.colors.textMuted)
                            Text(
                                text = transaction.merchant,
                                fontSize = 11.sp,
                                color = FinanceTheme.colors.accentPrimary
                            )
                        }
                    }
                }
            }

            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = "${if (isExpense) "-" else "+"}${CurrencyFormatter.format(transaction.amount)}",
                    fontSize = 15.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = if (isExpense) FinanceTheme.colors.textPrimary else FinanceTheme.colors.accentPrimary
                )
                Text(
                    text = transaction.date,
                    fontSize = 10.sp,
                    color = FinanceTheme.colors.textMuted
                )
            }
        }
    }
}

package com.rupeeos.app.presentation.insights

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rupeeos.app.core.design.component.FinanceCard
import com.rupeeos.app.core.design.component.SmoothProgressBar
import com.rupeeos.app.core.design.component.StatusBadge
import com.rupeeos.app.core.design.component.StatusBadgeType
import com.rupeeos.app.core.design.theme.FinanceTheme
import com.rupeeos.app.core.util.CurrencyFormatter
import com.rupeeos.app.domain.model.Categories
import com.rupeeos.app.domain.model.TransactionType
import com.rupeeos.app.presentation.main.MainUiState

@Composable
fun InsightsScreen(
    uiState: MainUiState
) {
    val metrics = uiState.metrics
    val totalSpent = metrics?.totalSpent ?: 0L
    val available = metrics?.availableMoney ?: 1L

    // Compute Health Score (0-100)
    val savingsRate = if (available > 0) ((available - totalSpent).toFloat() / available.toFloat()).coerceIn(0f, 1f) else 0f
    val budgetAdherenceScore = if (metrics != null && !metrics.isOverBudgetProjected) 40 else 15
    val savingsScore = (savingsRate * 40).toInt()
    val essentialsCompleted = uiState.essentials.count { it.isPurchased }
    val essentialsTotal = uiState.essentials.size
    val essentialsScore = if (essentialsTotal > 0) ((essentialsCompleted.toFloat() / essentialsTotal.toFloat()) * 20).toInt() else 20
    val totalHealthScore = (budgetAdherenceScore + savingsScore + essentialsScore).coerceIn(0, 100)

    val (ratingText, ratingType) = when {
        totalHealthScore >= 80 -> "Excellent" to StatusBadgeType.SUCCESS
        totalHealthScore >= 60 -> "Good" to StatusBadgeType.INFO
        totalHealthScore >= 40 -> "Fair" to StatusBadgeType.WARNING
        else -> "Needs Attention" to StatusBadgeType.DANGER
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(FinanceTheme.colors.bgApp)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 96.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header
        item {
            Column {
                Text(
                    text = "ANALYTICS & ADVISORY",
                    style = MaterialTheme.typography.labelSmall,
                    color = FinanceTheme.colors.textMuted
                )
                Text(
                    text = "Financial Insights",
                    style = MaterialTheme.typography.titleLarge,
                    color = FinanceTheme.colors.textPrimary
                )
            }
        }

        // Financial Health Score Card
        item {
            FinanceCard(modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "FINANCIAL HEALTH SCORE",
                            style = MaterialTheme.typography.labelSmall,
                            color = FinanceTheme.colors.textMuted
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Row(verticalAlignment = Alignment.Bottom) {
                            Text(
                                text = "$totalHealthScore",
                                fontSize = 38.sp,
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Black,
                                color = FinanceTheme.colors.accentPrimary
                            )
                            Text(
                                text = " / 100",
                                fontSize = 14.sp,
                                color = FinanceTheme.colors.textMuted,
                                modifier = Modifier.padding(bottom = 6.dp)
                            )
                        }
                    }

                    StatusBadge(text = ratingText, type = ratingType)
                }

                Spacer(modifier = Modifier.height(12.dp))
                SmoothProgressBar(
                    progress = totalHealthScore / 100f,
                    progressColor = FinanceTheme.colors.accentPrimary
                )

                Spacer(modifier = Modifier.height(14.dp))
                Text(
                    text = "Based on budget adherence, savings rate (${(savingsRate * 100).toInt()}%), and essentials completion pace.",
                    fontSize = 12.sp,
                    color = FinanceTheme.colors.textSecondary
                )
            }
        }

        // Spending Breakdown Summary
        item {
            FinanceCard(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "SPENDING VELOCITY",
                    style = MaterialTheme.typography.labelSmall,
                    color = FinanceTheme.colors.textMuted
                )
                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Last 7 Days Spend:",
                        fontSize = 13.sp,
                        color = FinanceTheme.colors.textSecondary
                    )
                    Text(
                        text = CurrencyFormatter.format(metrics?.weeklySpent ?: 0L),
                        fontSize = 13.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold,
                        color = FinanceTheme.colors.textPrimary
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Weekly Safe Target:",
                        fontSize = 13.sp,
                        color = FinanceTheme.colors.textSecondary
                    )
                    Text(
                        text = CurrencyFormatter.format(metrics?.weeklyBudget ?: 0L),
                        fontSize = 13.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold,
                        color = FinanceTheme.colors.accentPrimary
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Projected Month-End:",
                        fontSize = 13.sp,
                        color = FinanceTheme.colors.textSecondary
                    )
                    Text(
                        text = CurrencyFormatter.format(metrics?.projectedMonthEndSpend ?: 0L),
                        fontSize = 13.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold,
                        color = if (metrics?.isOverBudgetProjected == true) FinanceTheme.colors.statusDanger else FinanceTheme.colors.statusSuccess
                    )
                }
            }
        }

        // Top Categories
        item {
            Text(
                text = "SPENDING BY CATEGORY",
                style = MaterialTheme.typography.labelSmall,
                color = FinanceTheme.colors.textMuted
            )
        }

        val spentByCategory = uiState.transactions
            .filter { it.type == TransactionType.EXPENSE }
            .groupBy { it.categoryId }
            .mapValues { (_, txs) -> txs.sumOf { it.amount } }
            .toList()
            .sortedByDescending { it.second }

        if (spentByCategory.isEmpty()) {
            item {
                FinanceCard(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = "No expenses recorded this month yet.",
                        fontSize = 13.sp,
                        color = FinanceTheme.colors.textMuted
                    )
                }
            }
        } else {
            items(spentByCategory) { (catId, amount) ->
                val category = Categories.get(catId)
                val share = if (totalSpent > 0) (amount.toFloat() / totalSpent.toFloat()) else 0f

                FinanceCard(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = category.name,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 14.sp,
                            color = FinanceTheme.colors.textPrimary
                        )
                        Text(
                            text = "${CurrencyFormatter.format(amount)} (${(share * 100).toInt()}%)",
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = category.color
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    SmoothProgressBar(progress = share, progressColor = category.color)
                }
            }
        }
    }
}

package com.rupeeos.app.presentation.budget

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
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
fun BudgetScreen(
    uiState: MainUiState,
    onSetAvailableMoney: (Long) -> Unit,
    onAllocateCategory: (String, Long) -> Unit,
    onApply503020Rule: () -> Unit
) {
    var isEditingInflow by remember { mutableStateOf(false) }
    var inflowInput by remember { mutableStateOf(uiState.plan?.availableMoney?.toString() ?: "0") }

    val plan = uiState.plan
    val availableMoney = plan?.availableMoney ?: 0L
    val allocations = plan?.allocations ?: emptyMap()
    val totalAllocated = allocations.values.sum()
    val gap = availableMoney - totalAllocated

    // Group transactions by category to calculate spent
    val spentByCategory = uiState.transactions
        .filter { it.type == TransactionType.EXPENSE }
        .groupBy { it.categoryId }
        .mapValues { (_, txs) -> txs.sumOf { it.amount } }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(FinanceTheme.colors.bgApp)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 96.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header & 50/30/20 Action
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "ZERO-BASED BUDGETING",
                        style = MaterialTheme.typography.labelSmall,
                        color = FinanceTheme.colors.textMuted
                    )
                    Text(
                        text = "Monthly Planning",
                        style = MaterialTheme.typography.titleLarge,
                        color = FinanceTheme.colors.textPrimary
                    )
                }

                Button(
                    onClick = onApply503020Rule,
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = FinanceTheme.colors.bgElevated,
                        contentColor = FinanceTheme.colors.accentPrimary
                    ),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.AutoAwesome,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = "50/30/20", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }
        }

        // Available Inflow Target Card
        item {
            FinanceCard(modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "MONTHLY MONEY AVAILABLE",
                            style = MaterialTheme.typography.labelSmall,
                            color = FinanceTheme.colors.textMuted
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = CurrencyFormatter.format(availableMoney),
                            fontSize = 28.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Black,
                            color = FinanceTheme.colors.accentPrimary
                        )
                    }

                    IconButton(onClick = {
                        inflowInput = availableMoney.toString()
                        isEditingInflow = true
                    }) {
                        Icon(
                            imageVector = Icons.Default.Edit,
                            contentDescription = "Edit Inflow",
                            tint = FinanceTheme.colors.textSecondary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Allocated: ${CurrencyFormatter.format(totalAllocated)}",
                        fontSize = 12.sp,
                        color = FinanceTheme.colors.textSecondary
                    )
                    val gapText = when {
                        gap > 0 -> "Left to allocate: ${CurrencyFormatter.format(gap)}"
                        gap < 0 -> "Overallocated: ${CurrencyFormatter.format(-gap)}"
                        else -> "Zero-Based Perfect"
                    }
                    val gapColor = when {
                        gap > 0 -> FinanceTheme.colors.statusInfo
                        gap < 0 -> FinanceTheme.colors.statusDanger
                        else -> FinanceTheme.colors.statusSuccess
                    }
                    Text(
                        text = gapText,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = gapColor
                    )
                }
            }
        }

        // Category Budget Items
        item {
            Text(
                text = "CATEGORY ALLOCATIONS",
                style = MaterialTheme.typography.labelSmall,
                color = FinanceTheme.colors.textMuted
            )
        }

        items(Categories.ALL) { category ->
            val allocated = allocations[category.id] ?: 0L
            val spent = spentByCategory[category.id] ?: 0L
            val remaining = allocated - spent
            val progress = if (allocated > 0) (spent.toFloat() / allocated.toFloat()) else 0f
            val isOver = spent > allocated && allocated > 0

            FinanceCard(
                modifier = Modifier.fillMaxWidth(),
                borderColor = if (isOver) FinanceTheme.colors.statusDanger.copy(alpha = 0.5f) else FinanceTheme.colors.borderApp
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(10.dp)
                                .background(category.color, RoundedCornerShape(2.dp))
                        )
                        Text(
                            text = category.name,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = FinanceTheme.colors.textPrimary
                        )
                    }

                    StatusBadge(
                        text = if (isOver) "Over Budget" else "₹${CurrencyFormatter.format(remaining).replace("₹", "")} left",
                        type = if (isOver) StatusBadgeType.DANGER else if (progress > 0.85f) StatusBadgeType.WARNING else StatusBadgeType.SUCCESS
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))
                SmoothProgressBar(
                    progress = progress,
                    progressColor = if (isOver) FinanceTheme.colors.statusDanger else category.color
                )

                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Spent: ${CurrencyFormatter.format(spent)}",
                        fontSize = 12.sp,
                        color = FinanceTheme.colors.textMuted
                    )
                    Text(
                        text = "Limit: ${CurrencyFormatter.format(allocated)}",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = FinanceTheme.colors.textSecondary
                    )
                }
            }
        }
    }

    // Inflow Edit Dialog
    if (isEditingInflow) {
        AlertDialog(
            onDismissRequest = { isEditingInflow = false },
            title = {
                Text(
                    text = "Edit Monthly Money",
                    fontWeight = FontWeight.Bold,
                    color = FinanceTheme.colors.textPrimary
                )
            },
            text = {
                OutlinedTextField(
                    value = inflowInput,
                    onValueChange = { if (it.all { c -> c.isDigit() }) inflowInput = it },
                    label = { Text("Available Amount (₹)") },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = FinanceTheme.colors.accentPrimary,
                        unfocusedBorderColor = FinanceTheme.colors.borderApp
                    )
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        val amt = inflowInput.toLongOrNull() ?: 0L
                        onSetAvailableMoney(amt)
                        isEditingInflow = false
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = FinanceTheme.colors.accentPrimary,
                        contentColor = Color.Black
                    )
                ) {
                    Text("Save", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { isEditingInflow = false }) {
                    Text("Cancel", color = FinanceTheme.colors.textMuted)
                }
            },
            containerColor = FinanceTheme.colors.bgSurface,
            shape = RoundedCornerShape(24.dp)
        )
    }
}

package com.rupeeos.app.presentation.goals

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Savings
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
import com.rupeeos.app.domain.model.Goal
import com.rupeeos.app.presentation.main.MainUiState

@Composable
fun GoalsScreen(
    uiState: MainUiState,
    onAddGoal: (name: String, target: Long, date: String, category: String) -> Unit,
    onContribute: (goal: Goal, amount: Long) -> Unit
) {
    var isAddModalOpen by remember { mutableStateOf(false) }
    var goalToContribute by remember { mutableStateOf<Goal?>(null) }

    val goals = uiState.goals

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(FinanceTheme.colors.bgApp)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 96.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "SINKING FUNDS & TARGETS",
                        style = MaterialTheme.typography.labelSmall,
                        color = FinanceTheme.colors.textMuted
                    )
                    Text(
                        text = "Savings Goals",
                        style = MaterialTheme.typography.titleLarge,
                        color = FinanceTheme.colors.textPrimary
                    )
                }

                Button(
                    onClick = { isAddModalOpen = true },
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = FinanceTheme.colors.accentPrimary,
                        contentColor = Color.Black
                    ),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp)
                ) {
                    Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("New Goal", fontWeight = FontWeight.Bold)
                }
            }
        }

        if (goals.isEmpty()) {
            item {
                FinanceCard(modifier = Modifier.fillMaxWidth()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "No active savings goals set.\nCreate a sinking fund (e.g. Laptop, Emergency Reserve, Travel) to track intentional savings.",
                            color = FinanceTheme.colors.textMuted,
                            fontSize = 13.sp,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                    }
                }
            }
        } else {
            items(goals) { goal ->
                FinanceCard(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = goal.name,
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                color = FinanceTheme.colors.textPrimary
                            )
                            Text(
                                text = "Target: ${goal.targetDate} • ${goal.category}",
                                fontSize = 12.sp,
                                color = FinanceTheme.colors.textMuted
                            )
                        }

                        StatusBadge(
                            text = "${(goal.progress * 100).toInt()}%",
                            type = if (goal.progress >= 1f) StatusBadgeType.SUCCESS else StatusBadgeType.INFO
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    SmoothProgressBar(
                        progress = goal.progress,
                        progressColor = FinanceTheme.colors.accentPrimary
                    )

                    Spacer(modifier = Modifier.height(10.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Saved: ${CurrencyFormatter.format(goal.currentAmount)}",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = FinanceTheme.colors.accentPrimary
                            )
                            Text(
                                text = "Remaining: ${CurrencyFormatter.format(goal.remainingAmount)}",
                                fontSize = 11.sp,
                                color = FinanceTheme.colors.textMuted
                            )
                        }

                        OutlinedButton(
                            onClick = { goalToContribute = goal },
                            shape = RoundedCornerShape(10.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text("Deposit", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }

    // Deposit Modal
    goalToContribute?.let { goal ->
        var depositAmount by remember { mutableStateOf("1000") }

        AlertDialog(
            onDismissRequest = { goalToContribute = null },
            title = {
                Text("Deposit to ${goal.name}", fontWeight = FontWeight.Bold)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Current saved: ${CurrencyFormatter.format(goal.currentAmount)} of ${CurrencyFormatter.format(goal.targetAmount)}",
                        fontSize = 12.sp,
                        color = FinanceTheme.colors.textSecondary
                    )
                    OutlinedTextField(
                        value = depositAmount,
                        onValueChange = { if (it.all { c -> c.isDigit() }) depositAmount = it },
                        label = { Text("Deposit Amount (₹)") },
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val amt = depositAmount.toLongOrNull() ?: 0L
                        if (amt > 0) {
                            onContribute(goal, amt)
                            goalToContribute = null
                        }
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = FinanceTheme.colors.accentPrimary,
                        contentColor = Color.Black
                    )
                ) {
                    Text("Confirm Deposit", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { goalToContribute = null }) {
                    Text("Cancel", color = FinanceTheme.colors.textMuted)
                }
            },
            containerColor = FinanceTheme.colors.bgSurface,
            shape = RoundedCornerShape(24.dp)
        )
    }

    // Create Goal Dialog
    if (isAddModalOpen) {
        var name by remember { mutableStateOf("") }
        var target by remember { mutableStateOf("50000") }
        var targetDate by remember { mutableStateOf("2026-12-31") }
        var category by remember { mutableStateOf("Gear") }

        AlertDialog(
            onDismissRequest = { isAddModalOpen = false },
            title = { Text("Create Savings Goal", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Goal Name (e.g. Laptop, Trip)") },
                        singleLine = true
                    )
                    OutlinedTextField(
                        value = target,
                        onValueChange = { if (it.all { c -> c.isDigit() }) target = it },
                        label = { Text("Target Amount (₹)") },
                        singleLine = true
                    )
                    OutlinedTextField(
                        value = targetDate,
                        onValueChange = { targetDate = it },
                        label = { Text("Target Date (YYYY-MM-DD)") },
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (name.isNotBlank()) {
                            onAddGoal(name.trim(), target.toLongOrNull() ?: 50000L, targetDate, category)
                            isAddModalOpen = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = FinanceTheme.colors.accentPrimary,
                        contentColor = Color.Black
                    )
                ) {
                    Text("Create Goal", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { isAddModalOpen = false }) {
                    Text("Cancel", color = FinanceTheme.colors.textMuted)
                }
            },
            containerColor = FinanceTheme.colors.bgSurface,
            shape = RoundedCornerShape(24.dp)
        )
    }
}

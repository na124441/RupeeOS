package com.rupeeos.app.presentation.simulator

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Calculate
import androidx.compose.material.icons.filled.CheckCircle
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
import com.rupeeos.app.core.design.component.StatusBadge
import com.rupeeos.app.core.design.component.StatusBadgeType
import com.rupeeos.app.core.design.component.TabularCurrencyText
import com.rupeeos.app.core.design.theme.FinanceTheme
import com.rupeeos.app.core.util.CurrencyFormatter
import com.rupeeos.app.domain.model.SimulationResult
import com.rupeeos.app.presentation.main.MainUiState

@Composable
fun SimulatorScreen(
    uiState: MainUiState,
    onSimulate: (Long) -> SimulationResult?,
    onRecordExpense: (amount: Long, categoryId: String, note: String, merchant: String?) -> Unit
) {
    var amountInput by remember { mutableStateOf("5000") }
    var noteInput by remember { mutableStateOf("Simulated Purchase") }

    val amountLong = amountInput.toLongOrNull() ?: 0L
    val simulation = remember(amountLong, uiState.metrics) {
        if (amountLong > 0) onSimulate(amountLong) else null
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
                    text = "DECISION INTELLIGENCE",
                    style = MaterialTheme.typography.labelSmall,
                    color = FinanceTheme.colors.textMuted
                )
                Text(
                    text = "\"What-If?\" Purchase Simulator",
                    style = MaterialTheme.typography.titleLarge,
                    color = FinanceTheme.colors.textPrimary
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Test the real-world impact of a purchase on your safe daily spend before committing any money.",
                    fontSize = 12.sp,
                    color = FinanceTheme.colors.textSecondary
                )
            }
        }

        // Input Card
        item {
            FinanceCard(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "TEST A PURCHASE AMOUNT",
                    style = MaterialTheme.typography.labelSmall,
                    color = FinanceTheme.colors.textMuted
                )
                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = amountInput,
                    onValueChange = { if (it.all { c -> c.isDigit() }) amountInput = it },
                    label = { Text("Purchase Amount (₹)") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = FinanceTheme.colors.accentPrimary,
                        unfocusedBorderColor = FinanceTheme.colors.borderApp
                    )
                )

                Spacer(modifier = Modifier.height(8.dp))
                // Quick Presets
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf(1000L, 2500L, 5000L, 15000L, 50000L).forEach { preset ->
                        OutlinedButton(
                            onClick = { amountInput = preset.toString() },
                            modifier = Modifier.weight(1f),
                            contentPadding = PaddingValues(horizontal = 4.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "₹${preset / 1000}k",
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace,
                                color = FinanceTheme.colors.textSecondary
                            )
                        }
                    }
                }
            }
        }

        // Impact Analysis
        if (simulation != null) {
            item {
                val (badgeText, badgeType) = when (simulation.verdict) {
                    "AFFORDABLE" -> "Affordable" to StatusBadgeType.SUCCESS
                    "TIGHT" -> "Tight" to StatusBadgeType.WARNING
                    else -> "Not Recommended" to StatusBadgeType.DANGER
                }

                FinanceCard(
                    modifier = Modifier.fillMaxWidth(),
                    borderColor = when (simulation.verdict) {
                        "AFFORDABLE" -> FinanceTheme.colors.statusSuccess.copy(alpha = 0.5f)
                        "TIGHT" -> FinanceTheme.colors.statusWarning.copy(alpha = 0.5f)
                        else -> FinanceTheme.colors.statusDanger.copy(alpha = 0.5f)
                    }
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "AFFORDABILITY VERDICT",
                            style = MaterialTheme.typography.labelSmall,
                            color = FinanceTheme.colors.textMuted
                        )
                        StatusBadge(text = badgeText, type = badgeType)
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = simulation.verdictMessage,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = FinanceTheme.colors.textPrimary
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Before vs After Grid
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        // Current
                        FinanceCard(
                            modifier = Modifier.weight(1f),
                            backgroundColor = FinanceTheme.colors.bgApp,
                            contentPadding = PaddingValues(10.dp)
                        ) {
                            Text("CURRENT SAFE BURN", style = MaterialTheme.typography.labelSmall, color = FinanceTheme.colors.textMuted)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "${CurrencyFormatter.format(simulation.currentSafeDaily)} / day",
                                fontSize = 16.sp,
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Bold,
                                color = FinanceTheme.colors.textSecondary
                            )
                        }

                        // After
                        FinanceCard(
                            modifier = Modifier.weight(1f),
                            backgroundColor = FinanceTheme.colors.bgApp,
                            contentPadding = PaddingValues(10.dp)
                        ) {
                            Text("AFTER PURCHASE", style = MaterialTheme.typography.labelSmall, color = FinanceTheme.colors.textMuted)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "${CurrencyFormatter.format(simulation.newSafeDaily)} / day",
                                fontSize = 16.sp,
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Black,
                                color = if (simulation.newSafeDaily > 250) FinanceTheme.colors.accentPrimary else FinanceTheme.colors.statusWarning
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = {
                            onRecordExpense(amountLong, "shopping", noteInput, null)
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = FinanceTheme.colors.accentPrimary,
                            contentColor = Color.Black
                        )
                    ) {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Proceed & Record Expense (₹$amountLong)", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

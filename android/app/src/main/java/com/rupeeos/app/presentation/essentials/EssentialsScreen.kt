package com.rupeeos.app.presentation.essentials

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.OpenInNew
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rupeeos.app.core.design.component.FinanceCard
import com.rupeeos.app.core.design.component.SmoothProgressBar
import com.rupeeos.app.core.design.theme.FinanceTheme
import com.rupeeos.app.core.design.theme.PillShape
import com.rupeeos.app.core.util.CurrencyFormatter
import com.rupeeos.app.domain.model.EssentialItem
import com.rupeeos.app.domain.model.ShoppingProvider
import com.rupeeos.app.presentation.main.MainUiState

@Composable
fun EssentialsScreen(
    uiState: MainUiState,
    onToggleEssential: (item: EssentialItem, actualCost: Long?, recordExpense: Boolean) -> Unit,
    onAddEssential: (name: String, quantity: String, unit: String, cost: Long, provider: ShoppingProvider) -> Unit
) {
    val context = LocalContext.current
    var itemToConfirm by remember { mutableStateOf<EssentialItem?>(null) }
    var isAddModalOpen by remember { mutableStateOf(false) }

    val essentials = uiState.essentials
    val purchasedCount = essentials.count { it.isPurchased }
    val totalCount = essentials.size
    val progress = if (totalCount > 0) purchasedCount.toFloat() / totalCount.toFloat() else 0f

    val totalEstimated = essentials.sumOf { it.estimatedCost }
    val totalRemaining = essentials.filter { !it.isPurchased }.sumOf { it.estimatedCost }

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
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "QUICK COMMERCE & STAPLES",
                        style = MaterialTheme.typography.labelSmall,
                        color = FinanceTheme.colors.textMuted
                    )
                    Text(
                        text = "Essentials Checklist",
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
                    Text("Add", fontWeight = FontWeight.Bold)
                }
            }
        }

        // Progress Hero Card
        item {
            FinanceCard(modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "$purchasedCount of $totalCount Completed (${(progress * 100).toInt()}%)",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = FinanceTheme.colors.textPrimary
                        )
                        Text(
                            text = "Reserved: ${CurrencyFormatter.format(totalRemaining)} remaining",
                            fontSize = 12.sp,
                            color = FinanceTheme.colors.statusWarning
                        )
                    }

                    Text(
                        text = CurrencyFormatter.format(totalEstimated),
                        fontSize = 18.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold,
                        color = FinanceTheme.colors.accentPrimary
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))
                SmoothProgressBar(progress = progress)
            }
        }

        // Checklist Items
        items(essentials) { item ->
            FinanceCard(
                modifier = Modifier.fillMaxWidth(),
                backgroundColor = if (item.isPurchased) FinanceTheme.colors.bgApp.copy(alpha = 0.6f) else FinanceTheme.colors.bgSurface,
                borderColor = if (item.isPurchased) FinanceTheme.colors.borderSubtle else FinanceTheme.colors.borderApp
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        // Checkbox
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .clip(RoundedCornerShape(6.dp))
                                .border(
                                    1.5.dp,
                                    if (item.isPurchased) FinanceTheme.colors.accentPrimary else FinanceTheme.colors.borderApp,
                                    RoundedCornerShape(6.dp)
                                )
                                .background(if (item.isPurchased) FinanceTheme.colors.accentPrimary else Color.Transparent)
                                .clickable {
                                    if (item.isPurchased) {
                                        onToggleEssential(item, null, false)
                                    } else {
                                        itemToConfirm = item
                                    }
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            if (item.isPurchased) {
                                Icon(
                                    Icons.Default.Check,
                                    contentDescription = "Purchased",
                                    tint = Color.Black,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }

                        Column {
                            Text(
                                text = item.name,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = if (item.isPurchased) FinanceTheme.colors.textMuted else FinanceTheme.colors.textPrimary,
                                textDecoration = if (item.isPurchased) TextDecoration.LineThrough else TextDecoration.None
                            )
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "${item.quantity} ${item.unit}",
                                    fontSize = 11.sp,
                                    color = FinanceTheme.colors.textMuted
                                )
                                Text(
                                    text = "•",
                                    fontSize = 11.sp,
                                    color = FinanceTheme.colors.textMuted
                                )
                                Text(
                                    text = CurrencyFormatter.format(item.actualCost ?: item.estimatedCost),
                                    fontSize = 11.sp,
                                    fontFamily = FontFamily.Monospace,
                                    fontWeight = FontWeight.Bold,
                                    color = FinanceTheme.colors.accentPrimary
                                )
                            }
                        }
                    }

                    // Shop Provider Deep Link
                    Box(
                        modifier = Modifier
                            .clip(PillShape)
                            .background(item.preferredProvider.brandColor.copy(alpha = 0.15f))
                            .border(1.dp, item.preferredProvider.brandColor.copy(alpha = 0.4f), PillShape)
                            .clickable {
                                val url = item.preferredProvider.getSearchUrl(item.name)
                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                                context.startActivity(intent)
                            }
                            .padding(horizontal = 10.dp, vertical = 5.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Text(
                                text = item.preferredProvider.displayName,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = item.preferredProvider.brandColor
                            )
                            Icon(
                                Icons.Default.OpenInNew,
                                contentDescription = "Open App",
                                modifier = Modifier.size(12.dp),
                                tint = item.preferredProvider.brandColor
                            )
                        }
                    }
                }
            }
        }
    }

    // Price Confirmation Dialog
    itemToConfirm?.let { item ->
        var actualPriceInput by remember { mutableStateOf(item.estimatedCost.toString()) }
        var autoRecordExpense by remember { mutableStateOf(true) }

        AlertDialog(
            onDismissRequest = { itemToConfirm = null },
            title = {
                Text(
                    text = "Confirm Purchase: ${item.name}",
                    fontWeight = FontWeight.Bold,
                    color = FinanceTheme.colors.textPrimary
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text(
                        text = "Estimated price was ${CurrencyFormatter.format(item.estimatedCost)}. Adjust if actual supermarket bill differed:",
                        fontSize = 12.sp,
                        color = FinanceTheme.colors.textSecondary
                    )

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Button(
                            onClick = {
                                val curr = actualPriceInput.toLongOrNull() ?: 0L
                                actualPriceInput = (curr - 10).coerceAtLeast(0L).toString()
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = FinanceTheme.colors.bgElevated),
                            contentPadding = PaddingValues(horizontal = 8.dp)
                        ) {
                            Text("-10", color = FinanceTheme.colors.textPrimary)
                        }

                        OutlinedTextField(
                            value = actualPriceInput,
                            onValueChange = { if (it.all { c -> c.isDigit() }) actualPriceInput = it },
                            label = { Text("Actual Price (₹)") },
                            modifier = Modifier.weight(1f),
                            singleLine = true
                        )

                        Button(
                            onClick = {
                                val curr = actualPriceInput.toLongOrNull() ?: 0L
                                actualPriceInput = (curr + 10).toString()
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = FinanceTheme.colors.bgElevated),
                            contentPadding = PaddingValues(horizontal = 8.dp)
                        ) {
                            Text("+10", color = FinanceTheme.colors.textPrimary)
                        }
                    }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.clickable { autoRecordExpense = !autoRecordExpense }
                    ) {
                        Checkbox(
                            checked = autoRecordExpense,
                            onCheckedChange = { autoRecordExpense = it }
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Auto-record to Expenses Ledger",
                            fontSize = 12.sp,
                            color = FinanceTheme.colors.textPrimary
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val cost = actualPriceInput.toLongOrNull() ?: item.estimatedCost
                        onToggleEssential(item, cost, autoRecordExpense)
                        itemToConfirm = null
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = FinanceTheme.colors.accentPrimary,
                        contentColor = Color.Black
                    )
                ) {
                    Text("Confirm & Log", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { itemToConfirm = null }) {
                    Text("Cancel", color = FinanceTheme.colors.textMuted)
                }
            },
            containerColor = FinanceTheme.colors.bgSurface,
            shape = RoundedCornerShape(24.dp)
        )
    }

    // Add Item Dialog
    if (isAddModalOpen) {
        var nameInput by remember { mutableStateOf("") }
        var quantityInput by remember { mutableStateOf("1") }
        var unitInput by remember { mutableStateOf("kg") }
        var costInput by remember { mutableStateOf("150") }
        var selectedProvider by remember { mutableStateOf(ShoppingProvider.BLINKIT) }

        AlertDialog(
            onDismissRequest = { isAddModalOpen = false },
            title = {
                Text("Add Essential Staple", fontWeight = FontWeight.Bold)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = nameInput,
                        onValueChange = { nameInput = it },
                        label = { Text("Item Name (e.g. Milk, Rice)") },
                        singleLine = true
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = quantityInput,
                            onValueChange = { quantityInput = it },
                            label = { Text("Qty") },
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = unitInput,
                            onValueChange = { unitInput = it },
                            label = { Text("Unit (kg, pkt)") },
                            modifier = Modifier.weight(1f)
                        )
                    }
                    OutlinedTextField(
                        value = costInput,
                        onValueChange = { if (it.all { c -> c.isDigit() }) costInput = it },
                        label = { Text("Expected Cost (₹)") }
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (nameInput.isNotBlank()) {
                            onAddEssential(
                                nameInput.trim(),
                                quantityInput.trim(),
                                unitInput.trim(),
                                costInput.toLongOrNull() ?: 150L,
                                selectedProvider
                            )
                            isAddModalOpen = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = FinanceTheme.colors.accentPrimary,
                        contentColor = Color.Black
                    )
                ) {
                    Text("Add Item", fontWeight = FontWeight.Bold)
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

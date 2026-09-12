package com.rupeeos.app.presentation.expenses

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rupeeos.app.core.design.component.CategoryChip
import com.rupeeos.app.core.design.theme.FinanceTheme
import com.rupeeos.app.core.design.theme.PillShape
import com.rupeeos.app.domain.model.Categories

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddExpenseSheet(
    onDismiss: () -> Unit,
    onSave: (amount: Long, categoryId: String, note: String, merchant: String?) -> Unit
) {
    var amountInput by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf(Categories.ALL.first().id) }
    var noteInput by remember { mutableStateOf("") }
    var merchantInput by remember { mutableStateOf("") }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        containerColor = FinanceTheme.colors.bgSurface,
        dragHandle = { BottomSheetDefaults.DragHandle(color = FinanceTheme.colors.borderApp) },
        shape = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp)
                .padding(bottom = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Quick Expense",
                    style = MaterialTheme.typography.titleLarge,
                    color = FinanceTheme.colors.textPrimary
                )
                IconButton(onClick = onDismiss) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Close",
                        tint = FinanceTheme.colors.textMuted
                    )
                }
            }

            // Big Numeric Input
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "₹",
                    fontFamily = FontFamily.Monospace,
                    fontSize = 36.sp,
                    fontWeight = FontWeight.Bold,
                    color = FinanceTheme.colors.textMuted
                )
                Spacer(modifier = Modifier.width(6.dp))
                TextField(
                    value = amountInput,
                    onValueChange = { input ->
                        if (input.all { it.isDigit() }) amountInput = input
                    },
                    placeholder = {
                        Text(
                            text = "0",
                            fontSize = 36.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Black,
                            color = FinanceTheme.colors.textMuted
                        )
                    },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Number,
                        imeAction = ImeAction.Done
                    ),
                    textStyle = MaterialTheme.typography.displayLarge.copy(
                        fontFamily = FontFamily.Monospace,
                        color = FinanceTheme.colors.accentPrimary
                    ),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = Color.Transparent,
                        unfocusedContainerColor = Color.Transparent,
                        focusedIndicatorColor = Color.Transparent,
                        unfocusedIndicatorColor = Color.Transparent
                    )
                )
            }

            // Quick Amount Presets (+50, +100, +200, +500, +1000)
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(listOf(50, 100, 200, 500, 1000)) { delta ->
                    Box(
                        modifier = Modifier
                            .clip(PillShape)
                            .background(FinanceTheme.colors.bgElevated)
                            .border(1.dp, FinanceTheme.colors.borderSubtle, PillShape)
                            .clickable {
                                val current = amountInput.toLongOrNull() ?: 0L
                                amountInput = (current + delta).toString()
                            }
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "+₹$delta",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace,
                            color = FinanceTheme.colors.textSecondary
                        )
                    }
                }
            }

            // Category Chips Row
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "SELECT CATEGORY",
                    style = MaterialTheme.typography.labelSmall,
                    color = FinanceTheme.colors.textMuted
                )
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(Categories.ALL) { cat ->
                        CategoryChip(
                            name = cat.name,
                            color = cat.color,
                            selected = selectedCategory == cat.id,
                            onClick = { selectedCategory = cat.id }
                        )
                    }
                }
            }

            // Optional Note & Merchant
            OutlinedTextField(
                value = noteInput,
                onValueChange = { noteInput = it },
                label = { Text("Note / Description (Optional)") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = FinanceTheme.colors.accentPrimary,
                    unfocusedBorderColor = FinanceTheme.colors.borderApp,
                    focusedLabelColor = FinanceTheme.colors.accentPrimary,
                    unfocusedLabelColor = FinanceTheme.colors.textMuted
                )
            )

            OutlinedTextField(
                value = merchantInput,
                onValueChange = { merchantInput = it },
                label = { Text("Merchant / Place (e.g. Blinkit, Swiggy)") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = FinanceTheme.colors.accentPrimary,
                    unfocusedBorderColor = FinanceTheme.colors.borderApp,
                    focusedLabelColor = FinanceTheme.colors.accentPrimary,
                    unfocusedLabelColor = FinanceTheme.colors.textMuted
                )
            )

            // Submit Button
            val amountLong = amountInput.toLongOrNull() ?: 0L
            Button(
                onClick = {
                    if (amountLong > 0) {
                        onSave(
                            amountLong,
                            selectedCategory,
                            noteInput.ifBlank { Categories.get(selectedCategory).name },
                            merchantInput.ifBlank { null }
                        )
                        onDismiss()
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                enabled = amountLong > 0,
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = FinanceTheme.colors.accentPrimary,
                    contentColor = Color.Black
                )
            ) {
                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Save Expense (₹$amountLong)",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
            }
        }
    }
}

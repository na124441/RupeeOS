package com.rupeeos.app.presentation.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DeleteForever
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.RotateLeft
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rupeeos.app.core.design.component.FinanceCard
import com.rupeeos.app.core.design.theme.FinanceTheme

@Composable
fun SettingsScreen(
    onResetToDemo: () -> Unit,
    onClearAll: () -> Unit
) {
    var showConfirmClear by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(FinanceTheme.colors.bgApp)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 96.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Column {
                Text(
                    text = "DATA SOVEREIGNTY & CONTROLS",
                    style = MaterialTheme.typography.labelSmall,
                    color = FinanceTheme.colors.textMuted
                )
                Text(
                    text = "Settings & Privacy",
                    style = MaterialTheme.typography.titleLarge,
                    color = FinanceTheme.colors.textPrimary
                )
            }
        }

        // Privacy Guarantee Card
        item {
            FinanceCard(
                modifier = Modifier.fillMaxWidth(),
                borderColor = FinanceTheme.colors.borderAccent
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Icon(
                        Icons.Default.Lock,
                        contentDescription = null,
                        tint = FinanceTheme.colors.accentPrimary,
                        modifier = Modifier.size(24.dp)
                    )
                    Column {
                        Text(
                            text = "Local-First Architecture",
                            style = MaterialTheme.typography.titleMedium,
                            color = FinanceTheme.colors.textPrimary
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "All financial transactions, monthly plans, and goals live strictly in your device's private SQLite database. Zero external server telemetry or data mining.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = FinanceTheme.colors.textSecondary
                        )
                    }
                }
            }
        }

        // Data Management Controls
        item {
            Text(
                text = "DATA MANAGEMENT",
                style = MaterialTheme.typography.labelSmall,
                color = FinanceTheme.colors.textMuted
            )
        }

        item {
            FinanceCard(modifier = Modifier.fillMaxWidth()) {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Button(
                        onClick = onResetToDemo,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = FinanceTheme.colors.bgElevated,
                            contentColor = FinanceTheme.colors.accentPrimary
                        )
                    ) {
                        Icon(Icons.Default.RotateLeft, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Load September 2026 Demo Data")
                    }

                    OutlinedButton(
                        onClick = { showConfirmClear = true },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = FinanceTheme.colors.statusDanger
                        )
                    ) {
                        Icon(Icons.Default.DeleteForever, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Clear All Local Data")
                    }
                }
            }
        }

        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 16.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "RupeeOS Android v1.0.0 • Native Jetpack Compose",
                    fontSize = 11.sp,
                    color = FinanceTheme.colors.textMuted
                )
            }
        }
    }

    if (showConfirmClear) {
        AlertDialog(
            onDismissRequest = { showConfirmClear = false },
            title = { Text("Clear All Data?", color = FinanceTheme.colors.statusDanger) },
            text = { Text("This will erase all transactions, plans, and goals from this device. This action cannot be undone.") },
            confirmButton = {
                Button(
                    onClick = {
                        onClearAll()
                        showConfirmClear = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = FinanceTheme.colors.statusDanger)
                ) {
                    Text("Delete Everything")
                }
            },
            dismissButton = {
                TextButton(onClick = { showConfirmClear = false }) {
                    Text("Cancel", color = FinanceTheme.colors.textMuted)
                }
            },
            containerColor = FinanceTheme.colors.bgSurface,
            shape = RoundedCornerShape(24.dp)
        )
    }
}

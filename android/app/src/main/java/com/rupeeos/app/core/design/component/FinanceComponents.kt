package com.rupeeos.app.core.design.component

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rupeeos.app.core.design.theme.FinanceTheme
import com.rupeeos.app.core.design.theme.PillShape
import com.rupeeos.app.core.util.CurrencyFormatter

@Composable
fun FinanceCard(
    modifier: Modifier = Modifier,
    backgroundColor: Color = FinanceTheme.colors.bgSurface,
    borderColor: Color = FinanceTheme.colors.borderApp,
    shape: RoundedCornerShape = RoundedCornerShape(20.dp),
    contentPadding: PaddingValues = PaddingValues(16.dp),
    onClick: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    val clickableModifier = if (onClick != null) {
        Modifier.clickable { onClick() }
    } else Modifier

    Surface(
        modifier = modifier
            .clip(shape)
            .border(BorderStroke(1.dp, borderColor), shape)
            .then(clickableModifier),
        color = backgroundColor,
        shape = shape
    ) {
        Column(
            modifier = Modifier.padding(contentPadding),
            content = content
        )
    }
}

@Composable
fun TabularCurrencyText(
    amount: Long,
    modifier: Modifier = Modifier,
    fontSize: TextUnit = 24.sp,
    color: Color = FinanceTheme.colors.textPrimary,
    fontWeight: FontWeight = FontWeight.Bold,
    prefix: String = "₹"
) {
    Text(
        text = "$prefix${CurrencyFormatter.format(amount).replace("₹", "").trim()}",
        modifier = modifier,
        color = color,
        fontSize = fontSize,
        fontWeight = fontWeight,
        fontFamily = FontFamily.Monospace,
        letterSpacing = 0.5.sp
    )
}

enum class StatusBadgeType {
    SUCCESS, WARNING, DANGER, INFO, NEUTRAL
}

@Composable
fun StatusBadge(
    text: String,
    modifier: Modifier = Modifier,
    type: StatusBadgeType = StatusBadgeType.NEUTRAL
) {
    val (bg, textColor, borderColor) = when (type) {
        StatusBadgeType.SUCCESS -> Triple(
            FinanceTheme.colors.statusSuccess.copy(alpha = 0.15f),
            FinanceTheme.colors.statusSuccess,
            FinanceTheme.colors.statusSuccess.copy(alpha = 0.3f)
        )
        StatusBadgeType.WARNING -> Triple(
            FinanceTheme.colors.statusWarning.copy(alpha = 0.15f),
            FinanceTheme.colors.statusWarning,
            FinanceTheme.colors.statusWarning.copy(alpha = 0.3f)
        )
        StatusBadgeType.DANGER -> Triple(
            FinanceTheme.colors.statusDanger.copy(alpha = 0.15f),
            FinanceTheme.colors.statusDanger,
            FinanceTheme.colors.statusDanger.copy(alpha = 0.3f)
        )
        StatusBadgeType.INFO -> Triple(
            FinanceTheme.colors.statusInfo.copy(alpha = 0.15f),
            FinanceTheme.colors.statusInfo,
            FinanceTheme.colors.statusInfo.copy(alpha = 0.3f)
        )
        StatusBadgeType.NEUTRAL -> Triple(
            FinanceTheme.colors.bgElevated,
            FinanceTheme.colors.textSecondary,
            FinanceTheme.colors.borderSubtle
        )
    }

    Box(
        modifier = modifier
            .clip(PillShape)
            .background(bg)
            .border(BorderStroke(1.dp, borderColor), PillShape)
            .padding(horizontal = 8.dp, vertical = 3.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            color = textColor,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
fun CategoryChip(
    name: String,
    color: Color,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val bg = if (selected) FinanceTheme.colors.accentSurface else FinanceTheme.colors.bgElevated
    val border = if (selected) FinanceTheme.colors.accentPrimary else FinanceTheme.colors.borderSubtle

    Row(
        modifier = modifier
            .clip(PillShape)
            .background(bg)
            .border(BorderStroke(1.dp, border), PillShape)
            .clickable { onClick() }
            .padding(horizontal = 12.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        Box(
            modifier = Modifier
                .size(8.dp)
                .clip(CircleShape)
                .background(color)
        )
        Text(
            text = name,
            fontSize = 12.sp,
            fontWeight = if (selected) FontWeight.Bold else FontWeight.Medium,
            color = if (selected) FinanceTheme.colors.textPrimary else FinanceTheme.colors.textSecondary
        )
    }
}

@Composable
fun SmoothProgressBar(
    progress: Float,
    modifier: Modifier = Modifier,
    height: Dp = 8.dp,
    progressColor: Color = FinanceTheme.colors.accentPrimary,
    backgroundColor: Color = FinanceTheme.colors.bgElevated
) {
    val coercedProgress = progress.coerceIn(0f, 1f)
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(height)
            .clip(PillShape)
            .background(backgroundColor)
            .border(BorderStroke(1.dp, FinanceTheme.colors.borderSubtle), PillShape)
    ) {
        Box(
            modifier = Modifier
                .fillMaxHeight()
                .fillMaxWidth(coercedProgress)
                .clip(PillShape)
                .background(progressColor)
        )
    }
}

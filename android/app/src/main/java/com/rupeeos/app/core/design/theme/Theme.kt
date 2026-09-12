package com.rupeeos.app.core.design.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

data class FinanceColorScheme(
    val bgApp: Color,
    val bgSurface: Color,
    val bgElevated: Color,
    val bgHover: Color,
    val borderApp: Color,
    val borderSubtle: Color,
    val borderAccent: Color,
    val textPrimary: Color,
    val textSecondary: Color,
    val textMuted: Color,
    val accentPrimary: Color,
    val accentHover: Color,
    val accentSurface: Color,
    val accentGlow: Color,
    val statusSuccess: Color,
    val statusWarning: Color,
    val statusDanger: Color,
    val statusInfo: Color
)

val DarkFinanceColors = FinanceColorScheme(
    bgApp = FintechObsidian,
    bgSurface = SurfaceDark,
    bgElevated = ElevatedDark,
    bgHover = HoverDark,
    borderApp = BorderAppDark,
    borderSubtle = BorderSubtleDark,
    borderAccent = BorderAccentDark,
    textPrimary = TextPrimaryDark,
    textSecondary = TextSecondaryDark,
    textMuted = TextMutedDark,
    accentPrimary = AccentEmerald,
    accentHover = AccentEmeraldHover,
    accentSurface = AccentEmeraldSurface,
    accentGlow = AccentEmeraldGlow,
    statusSuccess = StatusSuccess,
    statusWarning = StatusWarningAmber,
    statusDanger = StatusDangerRose,
    statusInfo = StatusInfoCyan
)

val LightFinanceColors = FinanceColorScheme(
    bgApp = SlateWhite,
    bgSurface = SurfaceLight,
    bgElevated = ElevatedLight,
    bgHover = HoverLight,
    borderApp = BorderAppLight,
    borderSubtle = BorderSubtleLight,
    borderAccent = BorderAccentLight,
    textPrimary = TextPrimaryLight,
    textSecondary = TextSecondaryLight,
    textMuted = TextMutedLight,
    accentPrimary = AccentEmerald,
    accentHover = AccentEmeraldHover,
    accentSurface = AccentEmeraldSurface,
    accentGlow = AccentEmeraldGlow,
    statusSuccess = StatusSuccess,
    statusWarning = StatusWarningAmber,
    statusDanger = StatusDangerRose,
    statusInfo = StatusInfoCyan
)

val LocalFinanceColors = staticCompositionLocalOf { DarkFinanceColors }

private val MaterialDarkColorScheme = darkColorScheme(
    primary = AccentEmerald,
    onPrimary = Color.Black,
    surface = SurfaceDark,
    onSurface = TextPrimaryDark,
    background = FintechObsidian,
    onBackground = TextPrimaryDark
)

private val MaterialLightColorScheme = lightColorScheme(
    primary = AccentEmerald,
    onPrimary = Color.White,
    surface = SurfaceLight,
    onSurface = TextPrimaryLight,
    background = SlateWhite,
    onBackground = TextPrimaryLight
)

@Composable
fun RupeeOSTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val financeColors = if (darkTheme) DarkFinanceColors else LightFinanceColors
    val materialColors = if (darkTheme) MaterialDarkColorScheme else MaterialLightColorScheme

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = financeColors.bgApp.toArgb()
            window.navigationBarColor = financeColors.bgSurface.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
            WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = !darkTheme
        }
    }

    CompositionLocalProvider(LocalFinanceColors provides financeColors) {
        MaterialTheme(
            colorScheme = materialColors,
            typography = Typography,
            shapes = Shapes,
            content = content
        )
    }
}

object FinanceTheme {
    val colors: FinanceColorScheme
        @Composable
        @ReadOnlyComposable
        get() = LocalFinanceColors.current
}

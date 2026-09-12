package com.rupeeos.app.core.util

import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

object DateUtils {
    private val monthKeyFormat = SimpleDateFormat("yyyy-MM", Locale.ENGLISH)
    private val fullDateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH)
    private val displayMonthFormat = SimpleDateFormat("MMMM yyyy", Locale.ENGLISH)

    fun getCurrentMonthKey(): String {
        return monthKeyFormat.format(Date())
    }

    fun getCurrentDateString(): String {
        return fullDateFormat.format(Date())
    }

    fun formatMonthName(monthKey: String): String {
        return try {
            val date = monthKeyFormat.parse(monthKey)
            if (date != null) displayMonthFormat.format(date) else monthKey
        } catch (e: Exception) {
            monthKey
        }
    }

    fun getDaysInMonth(monthKey: String): Int {
        val cal = Calendar.getInstance()
        try {
            val date = monthKeyFormat.parse(monthKey)
            if (date != null) {
                cal.time = date
                return cal.getActualMaximum(Calendar.DAY_OF_MONTH)
            }
        } catch (e: Exception) {
            // fallback
        }
        return 30
    }

    fun getDaysElapsedInMonth(monthKey: String): Int {
        val cal = Calendar.getInstance()
        val currentMonthKey = getCurrentMonthKey()
        if (monthKey == currentMonthKey) {
            return cal.get(Calendar.DAY_OF_MONTH)
        } else if (monthKey < currentMonthKey) {
            return getDaysInMonth(monthKey)
        }
        return 0
    }

    fun getDaysRemainingInMonth(monthKey: String): Int {
        val total = getDaysInMonth(monthKey)
        val elapsed = getDaysElapsedInMonth(monthKey)
        return (total - elapsed).coerceAtLeast(1)
    }

    fun getNextMonthKey(monthKey: String): String {
        val cal = Calendar.getInstance()
        try {
            val date = monthKeyFormat.parse(monthKey)
            if (date != null) {
                cal.time = date
                cal.add(Calendar.MONTH, 1)
                return monthKeyFormat.format(cal.time)
            }
        } catch (e: Exception) {
            // fallback
        }
        return monthKey
    }

    fun getPreviousMonthKey(monthKey: String): String {
        val cal = Calendar.getInstance()
        try {
            val date = monthKeyFormat.parse(monthKey)
            if (date != null) {
                cal.time = date
                cal.add(Calendar.MONTH, -1)
                return monthKeyFormat.format(cal.time)
            }
        } catch (e: Exception) {
            // fallback
        }
        return monthKey
    }
}

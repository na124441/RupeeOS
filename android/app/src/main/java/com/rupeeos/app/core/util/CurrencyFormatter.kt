package com.rupeeos.app.core.util

import java.text.NumberFormat
import java.util.Locale

object CurrencyFormatter {
    private val indiaLocale = Locale("en", "IN")
    private val formatter = NumberFormat.getCurrencyInstance(indiaLocale).apply {
        maximumFractionDigits = 0
    }

    fun format(amount: Long): String {
        return try {
            formatter.format(amount)
        } catch (e: Exception) {
            "₹$amount"
        }
    }

    fun format(amount: Double): String {
        return try {
            formatter.format(amount)
        } catch (e: Exception) {
            "₹${amount.toLong()}"
        }
    }
}

package com.rupeeos.app

import android.app.Application
import com.rupeeos.app.data.local.RupeeOSDatabase
import com.rupeeos.app.data.repository.FinanceRepositoryImpl
import com.rupeeos.app.domain.repository.FinanceRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob

class RupeeOSApp : Application() {

    private val applicationScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    val database by lazy {
        RupeeOSDatabase.getDatabase(this, applicationScope)
    }

    val repository: FinanceRepository by lazy {
        FinanceRepositoryImpl(database.financeDao())
    }
}

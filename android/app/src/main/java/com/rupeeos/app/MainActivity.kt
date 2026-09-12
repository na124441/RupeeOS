package com.rupeeos.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import com.rupeeos.app.core.design.theme.RupeeOSTheme
import com.rupeeos.app.presentation.main.MainViewModel
import com.rupeeos.app.presentation.navigation.MainNavigationScaffold

class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels {
        val app = application as RupeeOSApp
        MainViewModel.provideFactory(app.repository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            RupeeOSTheme {
                MainNavigationScaffold(viewModel = viewModel)
            }
        }
    }
}

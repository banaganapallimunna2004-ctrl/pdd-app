package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.activity.viewModels
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.theme.AIPoweredPrecisionCropDiseaseDetectionSmartAgroMonitoringSystemTheme
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.navigation.AppNavigation
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.viewmodel.AgroViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : AppCompatActivity() {
    private val viewModel: AgroViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        enableEdgeToEdge()
        setContent {
            val isDarkMode by viewModel.isDarkMode.collectAsState()
            
            AIPoweredPrecisionCropDiseaseDetectionSmartAgroMonitoringSystemTheme(darkTheme = isDarkMode) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = Color(0xFF010801)
                ) {
                    AppNavigation()
                }
            }
        }
    }
}

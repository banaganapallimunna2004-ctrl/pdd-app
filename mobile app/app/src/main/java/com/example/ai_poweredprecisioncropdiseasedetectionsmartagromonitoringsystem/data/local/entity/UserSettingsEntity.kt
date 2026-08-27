package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

@Serializable
@Entity(tableName = "user_settings")
data class UserSettingsEntity(
    @PrimaryKey val id: Int = 1,
    val selectedLanguage: String = "en",
    val customLogoUri: String? = null,
    val isDarkMode: Boolean = false,
    val notificationsEnabled: Boolean = true,
    val aiSensitivity: Float = 0.5f,
    val twoFactorEnabled: Boolean = false,
    val biometricLoginEnabled: Boolean = false,
    val isOnboardingCompleted: Boolean = false
)

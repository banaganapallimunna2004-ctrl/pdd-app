package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

@Serializable
@Entity(tableName = "user_otps")
data class UserOtpEntity(
    @PrimaryKey val phoneNumber: String,
    val otpCode: String,
    val expiryTime: Long
)

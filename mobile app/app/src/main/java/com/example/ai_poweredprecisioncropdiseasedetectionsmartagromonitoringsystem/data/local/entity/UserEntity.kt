package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

@Serializable
@Entity(
    tableName = "users",
    indices = [
        Index(value = ["email"], unique = true),
        Index(value = ["phone"]),
        Index(value = ["isLoggedIn"])
    ]
)
data class UserEntity(
    @PrimaryKey val email: String = "farmer@agroai.com",
    val passwordHash: String = "",
    val fullName: String = "Smart Farmer",
    val phone: String = "+91 9876543210",
    val farmName: String? = "Green Valley Agro Farm",
    val farmLocation: String? = "Field Zone 1",
    val farmSize: Float? = 5.0f,
    val profileImageUri: String? = null,
    val isLoggedIn: Boolean = false,
    val experienceYears: Int = 3,
    val primaryCrops: String? = "Rice, Tomato, Cotton",
    val soilType: String? = "Black Soil",
    val irrigationSystem: String? = "Drip Irrigation",
    val waterSource: String? = "Borewell",
    val farmingMethod: String? = "Precision / Smart Farming",
    val stateRegion: String? = "Karnataka",
    val farmBio: String? = "Dedicated to high-yield sustainable agriculture using AgroAI smart diagnostics.",
    val annualYieldTarget: String? = "60 Quintals / Acre",
    val latitude: Double? = 11.0168,
    val longitude: Double? = 76.9558
)

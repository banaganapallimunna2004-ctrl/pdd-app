package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model

import kotlinx.serialization.Serializable

@Serializable
data class SensorData(
    val temperature: Float,
    val humidity: Float,
    val soilMoisture: Float,
    val soilPh: Float,
    val nitrogen: Float = 0f,
    val phosphorus: Float = 0f,
    val potassium: Float = 0f,
    val timestamp: Long = System.currentTimeMillis()
)

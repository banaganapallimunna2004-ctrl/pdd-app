package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

@Serializable
@Entity(
    tableName = "sensor_data",
    indices = [
        Index(value = ["timestamp"])
    ]
)
data class SensorDataEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val timestamp: Long = System.currentTimeMillis(),
    val temperature: Float,
    val humidity: Float,
    val soilMoisture: Float,
    val soilPh: Float,
    val nitrogen: Float = 0f,
    val phosphorus: Float = 0f,
    val potassium: Float = 0f
)

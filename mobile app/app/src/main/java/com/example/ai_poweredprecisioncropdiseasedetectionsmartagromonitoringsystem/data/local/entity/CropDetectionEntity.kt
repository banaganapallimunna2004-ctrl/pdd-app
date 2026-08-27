package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

@Serializable
@Entity(
    tableName = "crop_detections",
    indices = [
        Index(value = ["timestamp"])
    ]
)
data class CropDetectionEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val diseaseName: String,
    val scientificName: String,
    val severity: String,
    val confidence: Float,
    val imageUrl: String,
    val symptoms: List<String> = emptyList(),
    val treatmentSuggestions: List<String> = emptyList(),
    val preventionTips: List<String> = emptyList(),
    val timestamp: Long = System.currentTimeMillis()
)

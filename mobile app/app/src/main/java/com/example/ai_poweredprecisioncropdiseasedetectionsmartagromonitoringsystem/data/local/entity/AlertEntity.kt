package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

@Serializable
@Entity(
    tableName = "alerts",
    indices = [
        Index(value = ["timestamp"]),
        Index(value = ["isRead"])
    ]
)
data class AlertEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val timestamp: Long,
    val type: String,
    val severity: String,
    val isRead: Boolean = false
)

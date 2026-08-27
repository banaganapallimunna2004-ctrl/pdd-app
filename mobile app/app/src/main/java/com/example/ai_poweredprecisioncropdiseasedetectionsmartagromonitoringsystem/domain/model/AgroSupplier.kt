package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model

import kotlinx.serialization.Serializable

@Serializable
data class AgroSupplier(
    val id: Int,
    val name: String,
    val latitude: Double,
    val longitude: Double,
    val address: String,
    val type: String,
    val category: String, // "fertilizer", "protection", "lab", "equipment"
    val rating: Double,
    val phone: String,
    val status: String,
    val stock: List<String> = emptyList()
)

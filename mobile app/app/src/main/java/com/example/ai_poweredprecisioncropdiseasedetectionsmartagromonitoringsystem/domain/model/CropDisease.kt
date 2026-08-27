package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model

import kotlinx.serialization.Serializable

@Serializable
data class CropDisease(
    val id: String = "",
    val name: String = "",
    val scientificName: String = "",
    val severity: String = "", // Low, Medium, High
    val symptoms: List<String> = emptyList(),
    val treatmentSuggestions: List<String> = emptyList(),
    val preventionTips: List<String> = emptyList(),
    val imageUrl: String = "",
    val treatment: String = "",
    val prevention: String = ""
) {
    fun isValidCropDisease(): Boolean {
        val mandatoryPlantTerms = listOf("crop", "plant", "leaf", "fruit", "stem", "root", "flower", "agriculture", "tree", "vegetable")
        val specificDiseases = listOf(
            "rust", "blight", "mold", "smut", "spot", "mildew", "rot", "mosaic", "wilt", "canker", "scab", "blast"
        )

        val lowerName = name.lowercase()
        val lowerSciName = scientificName.lowercase()

        val nameMatches = mandatoryPlantTerms.any { lowerName.contains(it) } || 
                          specificDiseases.any { lowerName.contains(it) }
        
        val sciNameMatches = mandatoryPlantTerms.any { lowerSciName.contains(it) } || 
                             specificDiseases.any { lowerSciName.contains(it) }

        val mandatorySymptomTerms = listOf("leaf", "leaves", "stem", "root", "fruit", "branch", "soil", "petal", "bloom")
        val symptomsMatch = symptoms.any { symptom ->
            val lowSymptom = symptom.lowercase()
            mandatorySymptomTerms.any { lowSymptom.contains(it) }
        }

        return (nameMatches || sciNameMatches) && symptomsMatch
    }
}

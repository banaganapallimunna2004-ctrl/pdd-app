package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.remote.model

import com.google.gson.annotations.SerializedName

data class KindwiseRequest(
    val images: List<String>,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val similar_images: Boolean = true,
    val language: String? = null
)

data class KindwiseResponse(
    @SerializedName("access_token") val accessToken: String?,
    @SerializedName("result") val result: IdentificationResult?
)

data class IdentificationResult(
    @SerializedName("is_plant") val isPlant: IsPlantResult?,
    @SerializedName("disease") val disease: DiseaseResult?
)

data class IsPlantResult(
    val probability: Float,
    val binary: Boolean
)

data class DiseaseResult(
    val suggestions: List<DiseaseSuggestion>?
)

data class DiseaseSuggestion(
    val id: String?,
    val name: String,
    @SerializedName("scientific_name") val scientificName: String?,
    val probability: Float,
    val details: DiseaseDetails?
)

data class DiseaseDetails(
    val description: String?,
    val symptoms: String?,
    val treatment: TreatmentInfo?,
    val classification: List<String>?
)

data class TreatmentInfo(
    val biological: List<String>?,
    val chemical: List<String>?,
    val prevention: List<String>?
)

package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model

data class WeatherInfo(
    val temperature: Double,
    val condition: String,
    val humidity: Int,
    val windSpeed: Double,
    val locationName: String
)

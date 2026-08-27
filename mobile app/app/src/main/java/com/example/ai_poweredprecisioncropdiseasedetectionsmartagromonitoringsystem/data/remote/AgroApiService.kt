package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.remote

import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.CropDisease
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.SensorData
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.WeatherInfo
import retrofit2.http.*

interface AgroApiService {
    // Note: Integration with live OpenWeatherMap API can be done by providing an API key
    // in the @Query parameters for the getWeather endpoint.

    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): GenericResponse

    @POST("api/auth/update")
    suspend fun updateProfile(@Body user: com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity.UserEntity): GenericResponse

    @POST("api/auth/login")
    suspend fun login(@Body credentials: LoginRequest): LoginResponse

    @POST("api/sync/sensors")
    suspend fun syncSensors(@Body data: Map<String, List<com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity.SensorDataEntity>>): GenericResponse

    @POST("api/sync/detections")
    suspend fun syncDetections(@Body data: Map<String, List<com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity.CropDetectionEntity>>): GenericResponse

    @GET("api/sensors/current")
    suspend fun getLatestSensorData(): SensorData

    @POST("api/reports/scan")
    suspend fun detectDisease(@Body request: DetectRequest): CropDisease

    @GET("api/alerts")
    suspend fun getAlerts(): List<String>

    @GET("api/weather")
    suspend fun getWeather(
        @Query("lat") lat: Double,
        @Query("lng") lng: Double
    ): WeatherInfo

    @POST("api/sync/cloud")
    suspend fun syncCloudData(@Body data: Map<String, String>): SyncResponse

    @POST("api/reports/export")
    suspend fun exportReport(): ExportResponse

    @POST("api/sensors/calibrate")
    suspend fun calibrateSensors(): CalibrationResponse

    @POST("api/ai/chat")
    suspend fun chatWithAi(@Body message: Map<String, String>): ChatResponse

    @GET("api/recommendations")
    suspend fun getAiRecommendations(): List<String>

    @GET("api/map/suppliers")
    suspend fun getNearbySuppliers(
        @Query("lat") lat: Double,
        @Query("lng") lng: Double,
        @Query("category") category: String? = null,
        @Query("query") query: String? = null
    ): List<com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.AgroSupplier>

    @POST("api/map/location")
    suspend fun saveFarmLocation(
        @Body locationData: Map<String, @JvmSuppressWildcards Any>
    ): GenericResponse
}

data class DetectRequest(
    val image: String,
    val cropType: String? = "Tomato",
    val symptoms: String? = ""
)
data class RegisterRequest(
    val email: String,
    val passwordHash: String,
    val fullName: String,
    val phone: String,
    val farmName: String? = null,
    val farmLocation: String? = null
)
data class LoginRequest(val email: String, val passwordHash: String)
data class SyncResponse(val status: String, val progress: Int)
data class ExportResponse(val fileName: String, val downloadUrl: String)
data class CalibrationResponse(val success: Boolean, val message: String)
data class ChatResponse(val reply: String)
data class GenericResponse(
    val success: Boolean = false, 
    val message: String? = null,
    val error: String? = null
) {
    fun getMessageOrError(): String = message ?: error ?: "Unknown Server Error"
}
data class LoginResponse(val success: Boolean, val user: com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity.UserEntity?)

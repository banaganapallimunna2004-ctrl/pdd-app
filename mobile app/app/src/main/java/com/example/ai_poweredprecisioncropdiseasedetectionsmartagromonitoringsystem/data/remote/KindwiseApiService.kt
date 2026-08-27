package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.remote

import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.remote.model.KindwiseRequest
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.remote.model.KindwiseResponse
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

interface KindwiseApiService {
    
    @POST("health_assessment")
    suspend fun identifyDisease(
        @Header("Api-Key") apiKey: String,
        @Body request: KindwiseRequest
    ): KindwiseResponse
}

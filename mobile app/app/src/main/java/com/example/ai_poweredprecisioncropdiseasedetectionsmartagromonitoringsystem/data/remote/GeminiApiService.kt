package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.remote

import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.Query

interface GeminiApiService {
    @POST("v1beta/models/gemini-flash-latest:generateContent")
    suspend fun generateContent(
        @Query("key") apiKey: String,
        @Body request: GeminiRequest
    ): GeminiResponse

    @POST("v1beta/models/{model}:generateContent")
    suspend fun generateContentWithModel(
        @retrofit2.http.Path("model") model: String,
        @Query("key") apiKey: String,
        @Body request: GeminiRequest
    ): GeminiResponse
}

data class GeminiRequest(val contents: List<GeminiContent>)
data class GeminiContent(val parts: List<GeminiPart>)
data class GeminiPart(val text: String? = null, val inline_data: GeminiInlineData? = null)
data class GeminiInlineData(val mime_type: String = "image/jpeg", val data: String)

data class GeminiResponse(val candidates: List<GeminiCandidate>)
data class GeminiCandidate(val content: GeminiContentResponse)
data class GeminiContentResponse(val parts: List<GeminiPartResponse>)
data class GeminiPartResponse(val text: String)

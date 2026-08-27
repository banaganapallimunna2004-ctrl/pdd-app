package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model

import kotlinx.serialization.Serializable

/**
 * Data class representing a single chat message in the chatbot
 */
@Serializable
data class ChatMessage(
    val id: String = System.currentTimeMillis().toString() + (1000..9999).random(),
    val text: String,
    val isUser: Boolean,
    val time: String = java.text.SimpleDateFormat("HH:mm", java.util.Locale.getDefault()).format(java.util.Date())
)

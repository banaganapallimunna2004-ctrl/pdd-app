package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.screens

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Help
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.SubcomposeAsyncImage
import coil.compose.SubcomposeAsyncImageContent
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.R
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.CropDisease
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetectionResultScreen(
    detectionResult: DetectionResult,
    onBack: () -> Unit,
    onShare: () -> Unit,
    onRetry: () -> Unit
) {
    val backgroundUrl = remember(detectionResult) {
        if (detectionResult is DetectionResult.Success) {
            val name = detectionResult.disease.name.lowercase()
            when {
                name.contains("potato") -> "https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=2000&q=80"
                name.contains("tomato") -> "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=2000&q=80"
                name.contains("rice") || name.contains("paddy") -> "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=2000&q=80"
                name.contains("corn") || name.contains("maize") -> "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=2000&q=80"
                name.contains("wheat") -> "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=2000&q=80"
                name.contains("cotton") -> "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&w=2000&q=80"
                name.contains("soybean") -> "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=2000&q=80"
                name.contains("sugarcane") -> "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=2000&q=80"
                name.contains("peanut") -> "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=2000&q=80"
                name.contains("strawberry") -> "https://images.unsplash.com/photo-1543528176-61b239494933?auto=format&fit=crop&w=2000&q=80"
                name.contains("chilli") -> "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=2000&q=80"
                name.contains("apple") -> "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=2000&q=80"
                name.contains("grape") -> "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=2000&q=80"
                else -> "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000&auto=format&fit=crop"
            }
        } else {
            "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000&auto=format&fit=crop"
        }
    }

    com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.LuxuryBackground(
        imageUrl = backgroundUrl
    ) {
        Scaffold(
            topBar = {
                ProfessionalTopBar(
                    titleRes = R.string.analysis_report,
                    onBack = onBack,
                    onShare = { if (detectionResult is DetectionResult.Success) onShare() }
                )
            },
            containerColor = Color.Transparent
        ) { paddingValues ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .verticalScroll(rememberScrollState())
                    .padding(bottom = 24.dp)
            ) {
                when (detectionResult) {
                    is DetectionResult.Success -> ValidCropDiseaseDetection(
                        disease = detectionResult.disease,
                        confidence = detectionResult.confidence,
                        onShare = onShare
                    )
                    is DetectionResult.PlantMismatch -> PlantMismatchError(
                        expectedCrop = detectionResult.expectedCrop,
                        message = detectionResult.message,
                        onRetry = onRetry
                    )
                    is DetectionResult.NonCropDetected -> NonCropDetectionError(onRetry)
                    is DetectionResult.LowConfidence -> LowConfidenceError(onRetry)
                    is DetectionResult.UnknownError -> UnknownDetectionError(onRetry)
                }
            }
        }
    }
}

sealed class DetectionResult {
    data class Success(val disease: CropDisease, val confidence: Float) : DetectionResult()
    data class PlantMismatch(val expectedCrop: String? = null, val message: String? = null) : DetectionResult()
    object NonCropDetected : DetectionResult()
    object LowConfidence : DetectionResult()
    object UnknownError : DetectionResult()
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ProfessionalTopBar(titleRes: Int, onBack: () -> Unit, onShare: () -> Unit) {
    CenterAlignedTopAppBar(
        title = { Text(text = stringResource(titleRes), fontWeight = FontWeight.Bold, color = Color.White) },
        navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color.White) } },
        actions = { IconButton(onClick = onShare) { Icon(Icons.Default.Share, contentDescription = null, tint = Color.White) } },
        colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = Color.Transparent)
    )
}

@Composable
private fun ValidCropDiseaseDetection(disease: CropDisease, confidence: Float, onShare: () -> Unit) {
    Column(modifier = Modifier.padding(horizontal = 20.dp)) {
        CropDiseaseHeroSection(disease = disease, confidence = confidence)
        Spacer(modifier = Modifier.height(24.dp))
        DiseaseAnalysisSections(disease = disease)
        Spacer(modifier = Modifier.height(32.dp))
        ActionButtonsSection(onShare = onShare)
        Spacer(modifier = Modifier.height(16.dp))
        AiVerificationDisclaimer()
    }
}

@Composable
private fun CropDiseaseHeroSection(disease: CropDisease, confidence: Float) {
    com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.GlassCard(modifier = Modifier.fillMaxWidth()) {
        Column {
            DiseaseImageWithSeverity(disease = disease)
            Spacer(modifier = Modifier.height(16.dp))
            DiseaseHeaderInfo(disease = disease, confidence = confidence)
        }
    }
}

@Composable
private fun DiseaseImageWithSeverity(disease: CropDisease) {
    val imageModel = remember(disease.imageUrl) {
        if (disease.imageUrl.startsWith("http")) disease.imageUrl else java.io.File(disease.imageUrl)
    }
    Box(modifier = Modifier.height(240.dp).clip(RoundedCornerShape(16.dp))) {
        SubcomposeAsyncImage(
            model = imageModel,
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop,
            loading = {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Color(0xFF81C784))
                }
            },
            error = {
                Box(modifier = Modifier.fillMaxSize().background(Color.DarkGray), contentAlignment = Alignment.Center) {
                    Icon(Icons.Default.BrokenImage, contentDescription = null, tint = Color.LightGray)
                }
            }
        )
        SeverityBadge(severity = disease.severity, modifier = Modifier.align(Alignment.TopEnd).padding(12.dp))
    }
}

@Composable
private fun SeverityBadge(severity: String, modifier: Modifier = Modifier) {
    val config = SeverityConfig.from(severity)
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(20.dp),
        color = config.color.copy(alpha = 0.2f),
        border = BorderStroke(1.dp, config.color.copy(alpha = 0.5f))
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(config.icon, contentDescription = null, tint = config.color, modifier = Modifier.size(14.dp))
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = stringResource(config.labelRes).uppercase(),
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = config.color
            )
        }
    }
}

@Composable
private fun DiseaseHeaderInfo(disease: CropDisease, confidence: Float) {
    Text(
        text = disease.name,
        fontSize = 24.sp,
        fontWeight = FontWeight.Black,
        color = Color.White,
        lineHeight = 28.sp
    )
    if (disease.scientificName.isNotBlank() && disease.scientificName != "Unknown" && disease.scientificName != "N/A") {
        Text(
            text = disease.scientificName,
            fontSize = 14.sp,
            fontStyle = FontStyle.Italic,
            color = Color.White.copy(alpha = 0.7f)
        )
    }
    Spacer(modifier = Modifier.height(12.dp))
    ConfidenceIndicator(confidence = confidence)
}

@Composable
private fun ConfidenceIndicator(confidence: Float) {
    val animatedProgress by animateFloatAsState(
        targetValue = confidence.coerceIn(0f, 1f),
        animationSpec = tween(durationMillis = 1000),
        label = "ConfidenceProgress"
    )
    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "CONFIDENCE",
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = Color.White.copy(alpha = 0.8f)
            )
            Text(
                text = "${(animatedProgress * 100f).toInt()}%",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF81C784)
            )
        }
        Spacer(modifier = Modifier.height(6.dp))
        LinearProgressIndicator(
            progress = { animatedProgress },
            modifier = Modifier.fillMaxWidth().height(6.dp).clip(RoundedCornerShape(3.dp)),
            color = Color(0xFF81C784),
            trackColor = Color.White.copy(alpha = 0.1f)
        )
    }
}

@Composable
private fun DiseaseAnalysisSections(disease: CropDisease) {
    if (disease.symptoms.isNotEmpty()) {
        AnalysisSectionCard(
            title = "Symptoms",
            icon = Icons.Default.Visibility,
            items = disease.symptoms
        )
        Spacer(modifier = Modifier.height(16.dp))
    }
    if (disease.treatmentSuggestions.isNotEmpty()) {
        AnalysisSectionCard(
            title = "Treatment Protocol",
            icon = Icons.Default.MedicalServices,
            items = disease.treatmentSuggestions
        )
        Spacer(modifier = Modifier.height(16.dp))
    }
    if (disease.preventionTips.isNotEmpty()) {
        AnalysisSectionCard(
            title = "Prevention Guidelines",
            icon = Icons.Default.Shield,
            items = disease.preventionTips
        )
    }
}

@Composable
private fun AnalysisSectionCard(title: String, icon: ImageVector, items: List<String>) {
    com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.GlassCard(modifier = Modifier.fillMaxWidth()) {
        Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(icon, contentDescription = null, tint = Color(0xFF81C784), modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(10.dp))
                Text(text = title, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
            Spacer(modifier = Modifier.height(12.dp))
            items.forEach { item ->
                Row(modifier = Modifier.padding(vertical = 4.dp), verticalAlignment = Alignment.Top) {
                    Text(text = "•", color = Color(0xFF81C784), fontWeight = FontWeight.Bold, modifier = Modifier.padding(end = 8.dp))
                    Text(text = item, fontSize = 13.sp, color = Color.White.copy(alpha = 0.85f), lineHeight = 18.sp)
                }
            }
        }
    }
}

@Composable
private fun ActionButtonsSection(onShare: () -> Unit) {
    Button(
        onClick = onShare,
        modifier = Modifier.fillMaxWidth().height(52.dp),
        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32), contentColor = Color.White),
        shape = RoundedCornerShape(14.dp)
    ) {
        Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(18.dp))
        Spacer(modifier = Modifier.width(8.dp))
        Text("Share Report", fontWeight = FontWeight.Bold)
    }
}

@Composable
private fun AiVerificationDisclaimer() {
    com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.GlassCard(modifier = Modifier.fillMaxWidth()) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.Info, contentDescription = null, tint = Color.White.copy(alpha = 0.4f), modifier = Modifier.size(16.dp))
            Spacer(modifier = Modifier.width(12.dp))
            Text(text = stringResource(R.string.ai_verification_message), fontSize = 10.sp, color = Color.White.copy(alpha = 0.5f))
        }
    }
}

@Composable
private fun PlantMismatchError(expectedCrop: String?, message: String?, onRetry: () -> Unit) {
    ErrorState(
        icon = Icons.Default.Warning,
        title = "Plant Species Mismatch",
        message = message ?: "The scanned image does not match the selected crop (${expectedCrop ?: "Crop"}). Please recheck your image or scan the correct plant.",
        onRetry = onRetry
    )
}

@Composable
private fun NonCropDetectionError(onRetry: () -> Unit) {
    ErrorState(
        icon = Icons.Default.Close,
        title = "Invalid Image Detected",
        message = "The AI identified this image as a non-crop object. Please scan a clear photo of plant leaves or foliage.",
        onRetry = onRetry
    )
}

@Composable
private fun LowConfidenceError(onRetry: () -> Unit) {
    ErrorState(icon = Icons.Default.Warning, title = "Low Confidence", message = "The AI is unsure about this result. Try scanning again with better lighting.", onRetry = onRetry)
}

@Composable
private fun UnknownDetectionError(onRetry: () -> Unit) {
    ErrorState(icon = Icons.Default.Error, title = "System Failure", message = "An internal error occurred during neural processing. Please try again.", onRetry = onRetry)
}

@Composable
private fun ErrorState(icon: ImageVector, title: String, message: String, onRetry: () -> Unit) {
    Column(modifier = Modifier.fillMaxSize().padding(32.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
        Icon(icon, contentDescription = null, modifier = Modifier.size(80.dp), tint = Color.White.copy(alpha = 0.5f))
        Spacer(modifier = Modifier.height(24.dp))
        Text(text = title, fontSize = 22.sp, fontWeight = FontWeight.Black, color = Color.White, textAlign = TextAlign.Center)
        Spacer(modifier = Modifier.height(8.dp))
        Text(text = message, textAlign = TextAlign.Center, color = Color.White.copy(alpha = 0.7f), lineHeight = 20.sp)
        Spacer(modifier = Modifier.height(32.dp))
        Button(onClick = onRetry, colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = Color.Black), shape = RoundedCornerShape(12.dp)) {
            Text("SCAN AGAIN / RECHECK")
        }
    }
}

private data class SeverityConfig(val color: Color, val icon: ImageVector, val labelRes: Int) {
    companion object {
        fun from(severity: String): SeverityConfig = when (severity.uppercase()) {
            "HIGH", "CRITICAL" -> SeverityConfig(Color(0xFFEF9A9A), Icons.Default.PriorityHigh, R.string.severity_high)
            "MEDIUM" -> SeverityConfig(Color(0xFFFFCC80), Icons.Default.Warning, R.string.severity_medium)
            else -> SeverityConfig(Color(0xFFA5D6A7), Icons.Default.CheckCircle, R.string.severity_low)
        }
    }
}

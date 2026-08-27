package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.R

object AgroColors {
    val PrimaryGreen = Color(0xFF1B5E20) // Deep Forest
    val DarkGreen = Color(0xFF0A1F0B) // Obsidian Deep
    val AccentGreen = Color(0xFF81C784) // Luminous Mint
    val LightGreen = Color(0xFFC8E6C9) // Tea Green
    val EmeraldTeal = Color(0xFF00BFA5)
    val DarkBackground = Color(0xFF010801) // True Black-Green
    val CardGlassBg = Color.Black.copy(alpha = 0.55f) // Darker for text contrast
    val GlassBorder = Color.White.copy(alpha = 0.15f)
}

@Composable
fun LuxuryBackground(
    imageUrl: Any? = null,
    alpha: Float = 0.95f,
    overlayColor: Color = Color.Black.copy(alpha = 0.55f),
    content: @Composable () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(AgroColors.DarkBackground)
    ) {
        val imageModel = imageUrl ?: R.drawable.smart_agro_bg
        AsyncImage(
            model = ImageRequest.Builder(LocalContext.current)
                .data(imageModel)
                .crossfade(true)
                .build(),
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop,
            alpha = alpha
        )
        
        // Multi-stage Professional Agriculture Contrast Scrim
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color.Black.copy(alpha = 0.60f), // Protect status bar
                            Color.Black.copy(alpha = 0.30f), // Crisp wallpaper visibility
                            Color.Black.copy(alpha = 0.75f)  // Protect navigation bar
                        )
                    )
                )
        )
        
        // Subtle Atmospheric Emerald Radial Glow
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.radialGradient(
                        colors = listOf(AgroColors.PrimaryGreen.copy(alpha = 0.15f), Color.Transparent),
                        radius = 2800f
                    )
                )
        )

        content()
    }
}

@Composable
fun GlassCard(
    modifier: Modifier = Modifier,
    cornerRadius: Dp = 24.dp,
    backgroundColor: Color = AgroColors.CardGlassBg,
    borderColor: Color = AgroColors.GlassBorder,
    contentPadding: Dp = 20.dp,
    onClick: (() -> Unit)? = null,
    content: @Composable () -> Unit
) {
    val cardModifier = if (onClick != null) {
        modifier
            .clip(RoundedCornerShape(cornerRadius))
            .clickable { onClick() }
            .border(
                width = 1.dp,
                brush = Brush.linearGradient(
                    colors = listOf(borderColor, Color.Transparent)
                ),
                shape = RoundedCornerShape(cornerRadius)
            )
    } else {
        modifier
            .clip(RoundedCornerShape(cornerRadius))
            .border(
                width = 1.dp,
                brush = Brush.linearGradient(
                    colors = listOf(borderColor, Color.Transparent)
                ),
                shape = RoundedCornerShape(cornerRadius)
            )
    }

    Surface(
        modifier = cardModifier,
        color = backgroundColor,
        shape = RoundedCornerShape(cornerRadius),
        tonalElevation = 0.dp
    ) {
        Box(modifier = Modifier.padding(contentPadding)) {
            content()
        }
    }
}

@Composable
fun AgroBadge(
    text: String,
    containerColor: Color = AgroColors.PrimaryGreen.copy(alpha = 0.25f),
    contentColor: Color = AgroColors.AccentGreen,
    modifier: Modifier = Modifier
) {
    Surface(
        color = containerColor,
        shape = RoundedCornerShape(12.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, contentColor.copy(alpha = 0.4f)),
        modifier = modifier
    ) {
        Text(
            text = text.uppercase(),
            color = contentColor,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 1.sp,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
        )
    }
}

@Composable
fun StatCard(
    title: String,
    value: String,
    unit: String = "",
    icon: ImageVector,
    statusText: String = "Optimal",
    statusColor: Color = AgroColors.AccentGreen,
    onClick: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    GlassCard(
        modifier = modifier,
        cornerRadius = 20.dp,
        contentPadding = 16.dp,
        onClick = onClick
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(statusColor.copy(alpha = 0.20f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = title,
                        tint = statusColor,
                        modifier = Modifier.size(20.dp)
                    )
                }
                AgroBadge(text = statusText, containerColor = statusColor.copy(alpha = 0.15f), contentColor = statusColor)
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = title,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White.copy(alpha = 0.7f)
            )

            Spacer(modifier = Modifier.height(2.dp))

            Row(verticalAlignment = Alignment.Bottom) {
                Text(
                    text = value,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
                if (unit.isNotBlank()) {
                    Text(
                        text = " $unit",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = AgroColors.AccentGreen,
                        modifier = Modifier.padding(bottom = 2.dp)
                    )
                }
            }
        }
    }
}

@Composable
fun SectionHeader(
    title: String,
    subtitle: String? = null,
    actionText: String? = null,
    onActionClick: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(
                text = title.uppercase(),
                fontSize = 12.sp,
                fontWeight = FontWeight.Black,
                color = AgroColors.AccentGreen,
                letterSpacing = 1.5.sp
            )
            if (!subtitle.isNullOrBlank()) {
                Text(
                    text = subtitle,
                    fontSize = 11.sp,
                    color = Color.White.copy(alpha = 0.6f),
                    fontWeight = FontWeight.Medium
                )
            }
        }

        if (!actionText.isNullOrBlank() && onActionClick != null) {
            Text(
                text = actionText,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = AgroColors.LightGreen,
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .clickable { onActionClick() }
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            )
        }
    }
}

package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Agriculture
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.R
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.LuxuryBackground
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(onTimeout: () -> Unit) {
    var startAnimation by remember { mutableStateOf(false) }
    
    val alphaAnim by animateFloatAsState(
        targetValue = if (startAnimation) 1f else 0f,
        animationSpec = tween(1500, easing = LinearOutSlowInEasing), label = "alpha"
    )
    
    val scaleAnim by animateFloatAsState(
        targetValue = if (startAnimation) 1f else 0.8f,
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessLow), label = "scale"
    )

    LaunchedEffect(Unit) {
        startAnimation = true
        delay(3000) // Professional duration
        onTimeout()
    }

    Box(
        modifier = Modifier.fillMaxSize()
    ) {
        // PREMIUM BACKGROUND: Cinematic Agricultural Landscape
        LuxuryBackground(imageUrl = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920&auto=format&fit=crop", alpha = 0.9f) {
            Column(
                modifier = Modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Box(contentAlignment = Alignment.Center) {
                    val infiniteTransition = rememberInfiniteTransition(label = "Pulse")
                    val pulseScale by infiniteTransition.animateFloat(
                        initialValue = 1f,
                        targetValue = 1.3f,
                        animationSpec = infiniteRepeatable(
                            animation = tween(2500, easing = LinearOutSlowInEasing),
                            repeatMode = RepeatMode.Restart
                        ), label = "pulse"
                    )
                    
                    Box(
                        modifier = Modifier
                            .size(120.dp)
                            .scale(pulseScale)
                            .background(Color(0xFF81C784).copy(alpha = 0.1f), CircleShape)
                            .border(1.dp, Color(0xFF81C784).copy(alpha = 0.2f), CircleShape)
                    )

                    Box(
                        modifier = Modifier
                            .size(96.dp)
                            .scale(scaleAnim)
                            .alpha(alphaAnim)
                            .background(Color.White.copy(alpha = 0.15f), CircleShape)
                            .border(2.dp, Color(0xFF81C784), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Agriculture,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(52.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(40.dp))

                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.alpha(alphaAnim)
                ) {
                    Text(
                        text = "AGRO AI",
                        fontSize = 40.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White,
                        letterSpacing = 8.sp
                    )
                    Text(
                        text = "PRECISION NEURAL AGRICULTURE",
                        fontSize = 11.sp,
                        color = Color(0xFF81C784),
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 3.sp
                    )
                    
                    Spacer(modifier = Modifier.height(60.dp))
                    
                    LinearProgressIndicator(
                        modifier = Modifier
                            .width(160.dp)
                            .height(3.dp)
                            .clip(CircleShape),
                        color = Color(0xFF81C784),
                        trackColor = Color.White.copy(alpha = 0.1f)
                    )
                }
            }
        }
    }
}

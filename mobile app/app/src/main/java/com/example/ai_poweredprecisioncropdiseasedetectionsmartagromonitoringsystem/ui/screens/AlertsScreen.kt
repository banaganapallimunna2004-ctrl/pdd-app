package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.R
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity.AlertEntity
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.GlassCard
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.LuxuryBackground
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.viewmodel.AgroViewModel
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class AgroAlert(
    val id: String,
    val title: String,
    val description: String,
    val time: String,
    val type: AlertType,
    val severity: AlertSeverity,
    val isRead: Boolean = false
)

enum class AlertType {
    DISEASE, WEATHER, IRRIGATION, SYSTEM
}

enum class AlertSeverity {
    CRITICAL, WARNING, INFO
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AlertsScreen(viewModel: AgroViewModel) {
    val dbAlerts by viewModel.alerts.collectAsState()
    
    val allAlerts = dbAlerts.map { entity ->
        AgroAlert(
            id = entity.id,
            title = entity.title,
            description = entity.description,
            time = formatTimestamp(entity.timestamp),
            type = try { AlertType.valueOf(entity.type) } catch (e: Exception) { AlertType.SYSTEM },
            severity = try { AlertSeverity.valueOf(entity.severity) } catch (e: Exception) { AlertSeverity.INFO },
            isRead = entity.isRead
        )
    }

    var selectedFilter by remember { mutableStateOf("All") }
    val filters = listOf("All", "Disease", "Weather", "Irrigation")

    // PREMIUM BACKGROUND: Field Surveillance & Atmospheric Weather Advisory
    LuxuryBackground(imageUrl = "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1920&auto=format&fit=crop") {
        Scaffold(
            topBar = {
                CenterAlignedTopAppBar(
                    title = { 
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("AGROAI RISK RADAR", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.AgroColors.AccentGreen, letterSpacing = 1.sp)
                            Text("Field Alerts & Warnings 🌾", fontWeight = FontWeight.Black, color = Color.White, fontSize = 18.sp)
                        }
                    },
                    actions = {
                        IconButton(onClick = { viewModel.markAlertsRead() }) {
                            Icon(Icons.Default.DoneAll, contentDescription = "Mark all read", tint = Color.White)
                        }
                    },
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = Color.Transparent)
                )
            },
            containerColor = Color.Transparent
        ) { padding ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
            ) {
                LazyRow(
                    modifier = Modifier.fillMaxWidth(),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(filters) { filter ->
                        val isSelected = selectedFilter == filter
                        Surface(
                            onClick = { selectedFilter = filter },
                            color = if (isSelected) com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.AgroColors.PrimaryGreen else Color.White.copy(alpha = 0.10f),
                            shape = RoundedCornerShape(14.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, if (isSelected) com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.AgroColors.AccentGreen else Color.White.copy(alpha = 0.2f))
                        ) {
                            Text(
                                text = filter.uppercase(),
                                modifier = Modifier.padding(horizontal = 18.dp, vertical = 10.dp),
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 11.sp,
                                letterSpacing = 1.sp
                            )
                        }
                    }
                }

                val filteredAlerts = remember(selectedFilter, allAlerts) {
                    if (selectedFilter == "All") allAlerts
                    else allAlerts.filter { it.type.name.equals(selectedFilter, ignoreCase = true) }
                }

                if (filteredAlerts.isEmpty()) {
                    EmptyAlertsState()
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        items(filteredAlerts, key = { it.id }) { alert ->
                            ProfessionalAlertItem(alert)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ProfessionalAlertItem(alert: AgroAlert) {
    val severityColor = when (alert.severity) {
        AlertSeverity.CRITICAL -> Color(0xFFEF9A9A)
        AlertSeverity.WARNING -> Color(0xFFFFCC80)
        AlertSeverity.INFO -> Color(0xFF90CAF9)
    }

    GlassCard(
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(18.dp),
            verticalAlignment = Alignment.Top
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .background(severityColor.copy(alpha = 0.15f), CircleShape)
                    .border(1.dp, severityColor.copy(alpha = 0.3f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = when (alert.type) {
                        AlertType.DISEASE -> Icons.Default.BugReport
                        AlertType.WEATHER -> Icons.Default.Cloud
                        AlertType.IRRIGATION -> Icons.Default.WaterDrop
                        AlertType.SYSTEM -> Icons.Default.Settings
                    },
                    contentDescription = null,
                    tint = severityColor,
                    modifier = Modifier.size(22.dp)
                )
            }

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Text(
                        text = alert.title,
                        fontWeight = FontWeight.Black,
                        fontSize = 16.sp,
                        color = Color.White
                    )
                    Text(
                        text = alert.time.uppercase(),
                        fontSize = 9.sp,
                        color = Color.White.copy(alpha = 0.4f),
                        fontWeight = FontWeight.Black
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = alert.description,
                    fontSize = 14.sp,
                    color = Color.White.copy(alpha = 0.85f),
                    lineHeight = 20.sp
                )
                
                if (!alert.isRead) {
                    Spacer(modifier = Modifier.height(10.dp))
                    Box(
                        modifier = Modifier
                            .size(6.dp)
                            .background(Color.White, CircleShape)
                    )
                }
            }
        }
    }
}

@Composable
fun EmptyAlertsState() {
    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            Icons.Default.NotificationsNone,
            contentDescription = null,
            modifier = Modifier.size(64.dp),
            tint = Color.White.copy(alpha = 0.3f)
        )
        Spacer(modifier = Modifier.height(24.dp))
        Text(
            text = "SYSTEM SECURE",
            fontWeight = FontWeight.Black,
            fontSize = 18.sp,
            color = Color.White,
            letterSpacing = 2.sp
        )
        Text(
            text = "No active threats detected in field nodes.",
            color = Color.White.copy(alpha = 0.6f),
            fontSize = 14.sp
        )
    }
}

private fun formatTimestamp(timestamp: Long): String {
    val now = System.currentTimeMillis()
    val diff = now - timestamp
    return when {
        diff < 60000 -> "Just now"
        diff < 3600000 -> "${diff / 60000}m ago"
        diff < 86400000 -> "${diff / 3600000}h ago"
        else -> SimpleDateFormat("dd MMM", Locale.getDefault()).format(Date(timestamp))
    }
}

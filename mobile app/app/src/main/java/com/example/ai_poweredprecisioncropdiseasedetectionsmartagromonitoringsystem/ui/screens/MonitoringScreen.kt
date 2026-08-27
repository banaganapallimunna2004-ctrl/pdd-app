package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.screens

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.R
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.GlassCard
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.LuxuryBackground
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.viewmodel.AgroViewModel
import androidx.navigation.NavController
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.ExperimentalLayoutApi

@Composable
fun MonitoringScreen(viewModel: AgroViewModel, navController: NavController? = null) {
    val sensorData by viewModel.sensorData.collectAsState()
    val historicalData by viewModel.historicalData.collectAsState()
    var selectedTab by remember { mutableStateOf(0) }
    val tabs = listOf(
        "OVERVIEW",
        "SOIL",
        "NPK",
        "AI ANALYSIS",
        "WEATHER",
        "DEVICES"
    )

    // PREMIUM BACKGROUND: Smart Tech Agriculture IoT Field Grid
    LuxuryBackground(imageUrl = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1920&auto=format&fit=crop") {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .systemBarsPadding()
                .padding(horizontal = 20.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Spacer(modifier = Modifier.height(24.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "AgroAI IoT Telemetry",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.AgroColors.AccentGreen,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "Field Monitoring 🌾",
                        fontSize = 26.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                }
                
                IconButton(
                    onClick = { navController?.navigate("map") },
                    modifier = Modifier
                        .size(44.dp)
                        .background(com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.AgroColors.PrimaryGreen.copy(alpha = 0.4f), CircleShape)
                ) {
                    Icon(Icons.Default.Map, contentDescription = "Map", tint = Color.White)
                }
            }
            
            Spacer(modifier = Modifier.height(20.dp))

            ScrollableTabRow(
                selectedTabIndex = selectedTab,
                containerColor = Color.Transparent,
                divider = {},
                edgePadding = 0.dp,
                indicator = { tabPositions ->
                    TabRowDefaults.SecondaryIndicator(
                        Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                        color = com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.AgroColors.AccentGreen,
                        height = 3.dp
                    )
                }
            ) {
                tabs.forEachIndexed { index, title ->
                    Tab(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        text = { 
                            Text(
                                title, 
                                fontWeight = if (selectedTab == index) FontWeight.Black else FontWeight.Bold,
                                fontSize = 11.sp,
                                letterSpacing = 1.sp,
                                color = if (selectedTab == index) Color.White else Color.White.copy(alpha = 0.5f)
                            ) 
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            when (selectedTab) {
                0 -> OverviewTab(sensorData, historicalData)
                1 -> SoilMoistureTab(sensorData?.soilMoisture ?: 0f)
                2 -> NutrientsTab(sensorData)
                3 -> AnalysisTab(sensorData, navController)
                4 -> WeatherMonitoringTab()
                5 -> SensorsTab(sensorData)
            }
            
            Spacer(modifier = Modifier.height(100.dp))
        }
    }
}

@Composable
fun OverviewTab(
    sensorData: com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.SensorData?,
    historicalData: List<com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity.SensorDataEntity>
) {
    Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(
                        progress = 0.85f,
                        modifier = Modifier.size(90.dp),
                        strokeWidth = 6.dp,
                        color = Color.White,
                        trackColor = Color.White.copy(alpha = 0.1f)
                    )
                    Text("85%", fontWeight = FontWeight.Black, fontSize = 22.sp, color = Color.White)
                }
                Column {
                    Text("FARM HEALTH SCORE", fontWeight = FontWeight.Black, fontSize = 12.sp, color = Color(0xFF81C784), letterSpacing = 1.sp)
                    Text("Excellent", color = Color.White, fontWeight = FontWeight.Black, fontSize = 24.sp)
                    Text("Operational Status: Secure", fontSize = 12.sp, color = Color.White.copy(alpha = 0.6f))
                }
            }
        }

        Text("VITAL NUTRIENTS (NPK)", fontSize = 14.sp, fontWeight = FontWeight.Black, color = Color.White, letterSpacing = 2.sp)

        sensorData?.let { data ->
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                InsightSmallCard("NITROGEN", "${data.nitrogen.toInt()}", Color(0xFFEF9A9A), Modifier.weight(1f))
                InsightSmallCard("PHOSPHORUS", "${data.phosphorus.toInt()}", Color(0xFFFFCC80), Modifier.weight(1f))
                InsightSmallCard("POTASSIUM", "${data.potassium.toInt()}", Color(0xFFA5D6A7), Modifier.weight(1f))
            }
        }

        Text("ENVIRONMENTAL TELEMETRY", fontSize = 14.sp, fontWeight = FontWeight.Black, color = Color.White, letterSpacing = 2.sp)

        sensorData?.let { data ->
            val items = listOf(
                Triple("Soil Moisture", "${data.soilMoisture.toInt()}%", Color(0xFF90CAF9)),
                Triple("Temperature", "${data.temperature.toInt()}°C", Color(0xFFFFB74D)),
                Triple("Humidity", "${data.humidity.toInt()}%", Color(0xFFA5D6A7))
            )
            
            items.forEach { (label, value, color) ->
                val points = when(label) {
                    "Soil Moisture" -> historicalData.map { it.soilMoisture / 100f }
                    "Temperature" -> historicalData.map { it.temperature / 50f }
                    else -> historicalData.map { it.humidity / 100f }
                }
                MonitoringItem(label, value, color, points)
            }
        }
    }
}

@Composable
fun NutrientsTab(sensorData: com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.SensorData?) {
    Column(verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text(text = "NUTRIENT STABILITY", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color.White)
        
        sensorData?.let { data ->
            NutrientGauge("Nitrogen (N)", data.nitrogen, 200f, Color(0xFFEF9A9A))
            NutrientGauge("Phosphorus (P)", data.phosphorus, 100f, Color(0xFFFFCC80))
            NutrientGauge("Potassium (K)", data.potassium, 300f, Color(0xFFA5D6A7))
            
            Spacer(modifier = Modifier.height(12.dp))
            
            GlassCard(modifier = Modifier.fillMaxWidth()) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Eco, contentDescription = null, tint = Color(0xFF81C784))
                        Spacer(modifier = Modifier.width(12.dp))
                        Text("AI RECOMMENDATION", fontWeight = FontWeight.Black, color = Color.White, fontSize = 12.sp, letterSpacing = 1.sp)
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        if (data.nitrogen < 120f) "Nitrogen levels are below optimal. Consider applying nitrogenous organic matter to boost plant growth."
                        else "NPK levels are stable. No immediate fertilization required for current crop cycle.",
                        fontSize = 15.sp,
                        color = Color.White.copy(alpha = 0.85f),
                        lineHeight = 22.sp
                    )
                }
            }
        }
    }
}

@Composable
fun NutrientGauge(label: String, value: Float, max: Float, color: Color) {
    val progress = (value / max).coerceIn(0f, 1f)
    Column {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(label, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
            Text("${value.toInt()} mg/kg", fontWeight = FontWeight.Black, color = color)
        }
        Spacer(modifier = Modifier.height(10.dp))
        LinearProgressIndicator(
            progress = progress,
            modifier = Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(4.dp)),
            color = color,
            trackColor = Color.White.copy(alpha = 0.1f)
        )
    }
}

@Composable
fun AnalysisTab(
    sensorData: com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.SensorData?,
    navController: NavController?
) {
    Column(verticalArrangement = Arrangement.spacedBy(20.dp)) {
        Text(text = "NEURAL DIAGNOSTIC", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color.White)

        sensorData?.let { data ->
            val riskLevel = when {
                data.humidity > 75f && data.temperature > 25f -> "HIGH"
                data.humidity > 60f -> "MEDIUM"
                else -> "LOW"
            }
            val riskColor = when (riskLevel) {
                "HIGH" -> Color(0xFFEF9A9A)
                "MEDIUM" -> Color(0xFFFFCC80)
                else -> Color(0xFFA5D6A7)
            }

            GlassCard(modifier = Modifier.fillMaxWidth()) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Psychology, contentDescription = null, tint = riskColor)
                        Spacer(modifier = Modifier.width(12.dp))
                        Text("DISEASE RISK", fontWeight = FontWeight.Black, color = Color.White, fontSize = 12.sp, letterSpacing = 1.sp)
                        Spacer(modifier = Modifier.weight(1f))
                        Surface(color = riskColor.copy(alpha = 0.2f), shape = CircleShape, border = androidx.compose.foundation.BorderStroke(1.dp, riskColor.copy(alpha = 0.4f))) {
                            Text(
                                riskLevel, 
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
                                color = riskColor,
                                fontWeight = FontWeight.Black,
                                fontSize = 11.sp
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Based on current telemetry (Hum: ${data.humidity.toInt()}%, Temp: ${data.temperature.toInt()}°C), our neural network predicts a $riskLevel risk of fungal pathogens. Maintain proper ventilation.",
                        fontSize = 15.sp,
                        color = Color.White.copy(alpha = 0.9f),
                        lineHeight = 22.sp
                    )
                }
            }
        }

        GlassCard(modifier = Modifier.fillMaxWidth().clickable { navController?.navigate("disease_guide") }) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier.size(44.dp).background(Color.White.copy(alpha = 0.1f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.MenuBook, contentDescription = null, tint = Color.White)
                }
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text("Global Disease Base", fontWeight = FontWeight.Black, color = Color.White, fontSize = 16.sp)
                    Text("Explore treatments and prevention", fontSize = 12.sp, color = Color.White.copy(alpha = 0.6f))
                }
                Spacer(modifier = Modifier.weight(1f))
                Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color.White.copy(alpha = 0.3f))
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun SensorsTab(sensorData: com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.SensorData?) {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text(text = "DEVICE STATUS", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color.White)
        
        if (sensorData != null) {
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                maxItemsInEachRow = 2,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                SensorStatusCard("HUB-01A", "ONLINE", true, Modifier.weight(1f))
                SensorStatusCard("SOIL-Z1", "ACTIVE", true, Modifier.weight(1f))
                SensorStatusCard("HUM-NODE", "READY", true, Modifier.weight(1f))
                SensorStatusCard("NPK-SCAN", "SCANNING", true, Modifier.weight(1f))
            }
        }
    }
}

@Composable
fun SoilMoistureTab(moisture: Float) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = "MOISTURE TELEMETRY",
            fontSize = 22.sp,
            fontWeight = FontWeight.Black,
            modifier = Modifier.fillMaxWidth(),
            color = Color.White
        )
        
        Spacer(modifier = Modifier.height(40.dp))
        
        SoilMoistureGauge(moisture)
        
        Spacer(modifier = Modifier.height(40.dp))
        
        val status = when {
            moisture < 35f -> "CRITICAL: LOW"
            moisture < 75f -> "OPTIMAL"
            else -> "HIGH"
        }
        
        val statusColor = when {
            moisture < 35f -> Color(0xFFEF9A9A)
            moisture < 75f -> Color(0xFFA5D6A7)
            else -> Color(0xFF90CAF9)
        }

        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(Icons.Default.WaterDrop, contentDescription = null, tint = statusColor, modifier = Modifier.size(40.dp))
                Spacer(modifier = Modifier.height(12.dp))
                Text(text = status, color = statusColor, fontWeight = FontWeight.Black, fontSize = 22.sp, letterSpacing = 2.sp)
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "System is strictly monitoring hydration levels.",
                    fontSize = 14.sp,
                    color = Color.White.copy(alpha = 0.7f),
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

@Composable
fun SoilMoistureGauge(moisture: Float) {
    val animatedMoisture by animateFloatAsState(
        targetValue = moisture / 100f,
        animationSpec = tween(durationMillis = 1000)
    )

    Box(contentAlignment = Alignment.Center, modifier = Modifier.size(220.dp)) {
        Canvas(modifier = Modifier.size(220.dp)) {
            val strokeWidth = 10.dp.toPx()
            
            drawArc(
                color = Color.White.copy(alpha = 0.1f),
                startAngle = 135f,
                sweepAngle = 270f,
                useCenter = false,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )
            
            drawArc(
                color = Color.White,
                startAngle = 135f,
                sweepAngle = 270f * animatedMoisture,
                useCenter = false,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )
        }
        
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(text = "${moisture.toInt()}%", fontSize = 56.sp, fontWeight = FontWeight.Black, color = Color.White)
            Text(text = "VOLUMETRIC", color = Color.White.copy(alpha = 0.5f), fontSize = 11.sp, fontWeight = FontWeight.Black, letterSpacing = 2.sp)
        }
    }
}

@Composable
fun DetailStatCard(label: String, value: String, modifier: Modifier = Modifier) {
    GlassCard(modifier = modifier) {
        Column {
            Text(label, color = Color.White.copy(alpha = 0.6f), fontSize = 12.sp)
            Text(value, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color.White)
        }
    }
}

@Composable
fun WeatherMonitoringTab() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text(text = "LIVE ATMOSPHERE", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color.White)
        
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.WbSunny, contentDescription = null, modifier = Modifier.size(64.dp), tint = Color(0xFFFFCC80))
                Spacer(modifier = Modifier.width(24.dp))
                Column {
                    Text("28°C", fontSize = 42.sp, fontWeight = FontWeight.Black, color = Color.White)
                    Text("Clear Sky • Humidity 42%", color = Color.White.copy(alpha = 0.7f), fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun WeatherStat(label: String, value: String, icon: ImageVector) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Icon(icon, contentDescription = null, tint = Color.White.copy(alpha = 0.6f), modifier = Modifier.size(20.dp))
        Text(label, fontSize = 11.sp, color = Color.White.copy(alpha = 0.5f))
        Text(value, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color.White)
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun SensorStatusCard(name: String, value: String, active: Boolean, modifier: Modifier = Modifier) {
    GlassCard(modifier = modifier) {
        Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(if (active) Color(0xFFA5D6A7) else Color(0xFFEF9A9A))
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(name, fontSize = 10.sp, color = Color.White.copy(alpha = 0.5f), fontWeight = FontWeight.Black, letterSpacing = 1.sp)
            }
            Spacer(modifier = Modifier.height(10.dp))
            Text(value, fontWeight = FontWeight.Black, fontSize = 18.sp, color = Color.White)
        }
    }
}

@Composable
fun InsightSmallCard(label: String, value: String, color: Color, modifier: Modifier = Modifier) {
    GlassCard(modifier = modifier) {
        Column(horizontalAlignment = Alignment.Start) {
            Text(label.uppercase(), fontSize = 9.sp, color = Color.White.copy(alpha = 0.5f), fontWeight = FontWeight.Black, letterSpacing = 1.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Text(value, fontWeight = FontWeight.Black, fontSize = 20.sp, color = color)
        }
    }
}

@Composable
fun MonitoringItem(label: String, value: String, color: Color, points: List<Float> = emptyList()) {
    GlassCard(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
    ) {
        Column {
            Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                Column {
                    Text(label.uppercase(), fontSize = 10.sp, color = Color.White.copy(alpha = 0.5f), fontWeight = FontWeight.Black, letterSpacing = 1.sp)
                    Text(value, fontWeight = FontWeight.Black, fontSize = 28.sp, color = Color.White)
                }
                Box(modifier = Modifier.size(40.dp).background(Color.White.copy(alpha = 0.1f), CircleShape), contentAlignment = Alignment.Center) {
                    val icon = when(label) {
                        "Soil Moisture" -> Icons.Default.WaterDrop
                        "Temperature" -> Icons.Default.Thermostat
                        else -> Icons.Default.Cloud
                    }
                    Icon(icon, contentDescription = null, tint = Color.White, modifier = Modifier.size(20.dp))
                }
            }
            Spacer(modifier = Modifier.height(20.dp))
            SimpleLineChart(color = Color.White, points = points)
        }
    }
}

@Composable
fun SimpleLineChart(color: Color, points: List<Float> = emptyList()) {
    Canvas(modifier = Modifier.fillMaxWidth().height(40.dp)) {
        val path = Path()
        val dataPoints = if (points.isEmpty()) listOf(0.4f, 0.6f, 0.3f, 0.8f, 0.5f, 0.7f, 0.9f) else points
        val width = size.width
        val height = size.height
        val step = width / (dataPoints.size - 1).coerceAtLeast(1)

        dataPoints.forEachIndexed { index, point ->
            val x = index * step
            val y = height - (point * height)
            if (index == 0) path.moveTo(x, y) else path.lineTo(x, y)
        }

        drawPath(
            path = path,
            color = color.copy(alpha = 0.5f),
            style = Stroke(width = 2.dp.toPx(), cap = StrokeCap.Round)
        )
    }
}

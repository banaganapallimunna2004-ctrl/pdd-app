package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.screens

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.LocationManager
import android.provider.Settings
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.R
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.WeatherInfo
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.*
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.viewmodel.AgroViewModel
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.maps.model.LatLng

@Composable
fun DashboardScreen(
    viewModel: AgroViewModel,
    onNavigateToAlerts: () -> Unit,
    onNavigateToScan: () -> Unit,
    onNavigateToMonitor: () -> Unit,
    onNavigateToMap: () -> Unit = {}
) {
    val sensorData by viewModel.sensorData.collectAsState()
    val aiRecommendations by viewModel.aiRecommendations.collectAsState()
    val weatherInfo by viewModel.weatherInfo.collectAsState()
    val isWeatherLoading by viewModel.isWeatherLoading.collectAsState()
    val loggedInUser by viewModel.loggedInUser.collectAsState()
    val currentLocation by viewModel.currentLocation.collectAsState()
    val context = LocalContext.current

    val fusedLocationClient = remember {
        LocationServices.getFusedLocationProviderClient(context)
    }

    var isGpsEnabled by remember { mutableStateOf(isLocationServiceEnabled(context)) }
    var isLocating by remember { mutableStateOf(false) }

    var hasLocationPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED ||
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        )
    }

    fun requestDeviceLocation() {
        val perm = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
                   ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
        hasLocationPermission = perm
        val gps = isLocationServiceEnabled(context)
        isGpsEnabled = gps

        if (perm && gps) {
            isLocating = true
            fetchDeviceLocation(
                fusedLocationClient = fusedLocationClient,
                onLocationFound = { location ->
                    isLocating = false
                    viewModel.updateLocation(location)
                }
            )
        }
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val granted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] == true ||
                      permissions[Manifest.permission.ACCESS_COARSE_LOCATION] == true
        hasLocationPermission = granted
        if (granted) {
            requestDeviceLocation()
        }
    }

    // Auto-refresh when app resumes
    val lifecycleOwner = LocalLifecycleOwner.current
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_RESUME) {
                requestDeviceLocation()
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }

    LaunchedEffect(Unit) {
        if (!hasLocationPermission) {
            permissionLauncher.launch(
                arrayOf(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
                )
            )
        } else {
            requestDeviceLocation()
        }
    }

    // CINEMATIC AGRICULTURE BACKGROUND: Lush Green Farm Fields
    LuxuryBackground(
        imageUrl = "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?q=80&w=1920&auto=format&fit=crop",
        alpha = 0.92f
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .systemBarsPadding()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.Top
        ) {
            DashboardHeader(
                userName = loggedInUser?.fullName ?: stringResource(R.string.hello_farmer).replace("नमस्ते, ", "").replace("నమస్కారం, ", "").replace("Hello, ", "").replace("! 👋", ""),
                onNavigateToAlerts = onNavigateToAlerts
            )

            Spacer(modifier = Modifier.height(20.dp))

            PrimaryScanHeroCard(onScanClick = onNavigateToScan)

            Spacer(modifier = Modifier.height(24.dp))

            SectionHeader(
                title = stringResource(R.string.precision_geo_map),
                subtitle = stringResource(R.string.verify_farm_coords),
                actionText = stringResource(R.string.view_map) + " 🗺️ →",
                onActionClick = onNavigateToMap
            )

            WeatherRadarWidget(
                weather = weatherInfo, 
                isLoading = isWeatherLoading || isLocating,
                isLocationEnabled = hasLocationPermission && isGpsEnabled,
                onEnableLocationClick = {
                    if (!hasLocationPermission) {
                        permissionLauncher.launch(
                            arrayOf(
                                Manifest.permission.ACCESS_FINE_LOCATION,
                                Manifest.permission.ACCESS_COARSE_LOCATION
                            )
                        )
                    } else if (!isGpsEnabled) {
                        try {
                            context.startActivity(Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS))
                        } catch (e: Exception) {
                            // ignore
                        }
                    } else {
                        requestDeviceLocation()
                    }
                },
                onClick = onNavigateToMap
            )

            Spacer(modifier = Modifier.height(24.dp))

            SectionHeader(
                title = stringResource(R.string.precision_monitoring),
                subtitle = stringResource(R.string.soil_monitoring),
                actionText = stringResource(R.string.view_details) + " →",
                onActionClick = onNavigateToMonitor
            )

            SensorMetricsGrid(
                sensorData = sensorData,
                onMonitorClick = onNavigateToMonitor
            )

            Spacer(modifier = Modifier.height(120.dp))
        }
    }
}

@Composable
private fun DashboardHeader(userName: String, onNavigateToAlerts: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(
                        Brush.linearGradient(
                            colors = listOf(Color(0xFF2E7D32), Color(0xFF4CAF50))
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Spa,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(24.dp)
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    text = stringResource(R.string.hello_farmer, userName),
                    fontWeight = FontWeight.Black,
                    fontSize = 18.sp,
                    color = Color.White
                )
                Text(
                    text = "AgroAI Precision Field Hub",
                    fontSize = 12.sp,
                    color = Color.White.copy(alpha = 0.7f),
                    fontWeight = FontWeight.Medium
                )
            }
        }

        IconButton(
            onClick = onNavigateToAlerts,
            modifier = Modifier
                .size(44.dp)
                .clip(CircleShape)
                .background(Color.White.copy(alpha = 0.12f))
        ) {
            Icon(
                imageVector = Icons.Default.Notifications,
                contentDescription = stringResource(R.string.alerts),
                tint = Color.White,
                modifier = Modifier.size(22.dp)
            )
        }
    }
}

@Composable
private fun PrimaryScanHeroCard(onScanClick: () -> Unit) {
    GlassCard(
        modifier = Modifier
            .fillMaxWidth()
            .height(210.dp),
        cornerRadius = 28.dp,
        contentPadding = 0.dp,
        onClick = onScanClick
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            AsyncImage(
                model = ImageRequest.Builder(LocalContext.current)
                    .data("https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1280&q=80")
                    .crossfade(true)
                    .build(),
                contentDescription = null,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop,
                alpha = 0.75f
            )
            
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                Color.Transparent,
                                AgroColors.DarkGreen.copy(alpha = 0.60f),
                                Color.Black.copy(alpha = 0.90f)
                            )
                        )
                    )
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                verticalArrangement = Arrangement.Bottom
            ) {
                AgroBadge(text = "DISEASE AI SCANNER", containerColor = Color(0xFF2E7D32).copy(alpha = 0.8f), contentColor = Color.White)
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = stringResource(R.string.scan_your_crop),
                    color = Color.White,
                    fontWeight = FontWeight.Black,
                    fontSize = 24.sp,
                    lineHeight = 28.sp
                )
                Spacer(modifier = Modifier.height(6.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = AgroColors.AccentGreen, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = stringResource(R.string.scan_subtitle),
                        color = Color.White.copy(alpha = 0.85f),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
            
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(20.dp)
                    .size(50.dp)
                    .background(Color.White, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.CameraAlt, contentDescription = null, tint = AgroColors.PrimaryGreen, modifier = Modifier.size(24.dp))
            }
        }
    }
}

@Composable
private fun AiInsightCard(recommendation: String, onChatClick: () -> Unit) {
    GlassCard(
        modifier = Modifier.fillMaxWidth(),
        cornerRadius = 20.dp,
        contentPadding = 18.dp,
        onClick = onChatClick
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(AgroColors.AccentGreen.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Psychology,
                    contentDescription = null,
                    tint = AgroColors.AccentGreen,
                    modifier = Modifier.size(26.dp)
                )
            }
            
            Column(modifier = Modifier.weight(1f)) {
                AgroBadge(text = stringResource(R.string.ai_smart_insights), containerColor = AgroColors.AccentGreen.copy(alpha = 0.15f), contentColor = AgroColors.AccentGreen)
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = recommendation,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = Color.White,
                    lineHeight = 18.sp
                )
            }
            
            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color.White.copy(alpha = 0.5f))
        }
    }
}

@Composable
private fun WeatherRadarWidget(
    weather: WeatherInfo?, 
    isLoading: Boolean,
    isLocationEnabled: Boolean,
    onEnableLocationClick: () -> Unit,
    onClick: () -> Unit = {}
) {
    GlassCard(
        modifier = Modifier.fillMaxWidth(),
        cornerRadius = 24.dp,
        contentPadding = 20.dp,
        onClick = if (isLocationEnabled) onClick else onEnableLocationClick
    ) {
        if (!isLocationEnabled) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Default.LocationOff,
                            contentDescription = null,
                            tint = Color(0xFFFFB74D),
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "LIVE LOCATION IS OFF",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFFFFB74D),
                            letterSpacing = 0.5.sp
                        )
                    }
                    AgroBadge(
                        text = "GPS REQUIRED",
                        containerColor = Color(0xFFFFB74D).copy(alpha = 0.15f),
                        contentColor = Color(0xFFFFB74D)
                    )
                }

                Text(
                    text = "Turn on device location to view real-time live field weather, micro-climate alerts & precision GPS telemetry.",
                    fontSize = 12.sp,
                    color = Color.White.copy(alpha = 0.85f),
                    lineHeight = 17.sp
                )

                Button(
                    onClick = onEnableLocationClick,
                    modifier = Modifier.fillMaxWidth().height(42.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF2E7D32),
                        contentColor = Color.White
                    )
                ) {
                    Icon(Icons.Default.LocationOn, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Turn On Location 🛰️",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp
                    )
                }
            }
        } else {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.LocationOn, contentDescription = null, tint = AgroColors.AccentGreen, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (!weather?.locationName.isNullOrBlank()) {
                                stringResource(R.string.live_weather_label, weather.locationName).uppercase()
                            } else {
                                "LIVE FIELD RADAR".uppercase()
                            },
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White.copy(alpha = 0.75f),
                            letterSpacing = 0.5.sp,
                            maxLines = 1
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(verticalAlignment = Alignment.Bottom) {
                        Text(
                            text = if (weather != null) "${weather.temperature.toInt()}°C" else "28°C",
                            fontSize = 42.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.padding(bottom = 6.dp)) {
                            Text(
                                text = weather?.condition ?: "Clear & Sunny",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = AgroColors.AccentGreen
                            )
                            if (weather != null) {
                                Text(
                                    text = "💧 ${weather.humidity}% • 💨 ${weather.windSpeed.toInt()} km/h",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = Color.White.copy(alpha = 0.65f)
                                )
                            }
                        }
                    }
                }

                if (isLoading && weather == null) {
                    CircularProgressIndicator(modifier = Modifier.size(40.dp), color = Color.White, strokeWidth = 3.dp)
                } else {
                    Image(
                        painter = painterResource(id = weatherIconFor(weather?.condition)),
                        contentDescription = null,
                        modifier = Modifier.size(68.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun SensorMetricsGrid(sensorData: com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.SensorData?, onMonitorClick: () -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            StatCard(
                title = stringResource(R.string.soil_moisture),
                value = "${sensorData?.soilMoisture?.toInt() ?: "--"}",
                unit = "%",
                icon = Icons.Default.WaterDrop,
                statusText = stringResource(R.string.optimal_moisture),
                statusColor = Color(0xFF64B5F6),
                onClick = onMonitorClick,
                modifier = Modifier.weight(1f)
            )
            StatCard(
                title = stringResource(R.string.soil_temp),
                value = "${sensorData?.temperature?.toInt() ?: "--"}",
                unit = "°C",
                icon = Icons.Default.DeviceThermostat,
                statusText = stringResource(R.string.normal),
                statusColor = Color(0xFFFFB74D),
                onClick = onMonitorClick,
                modifier = Modifier.weight(1f)
            )
        }
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            StatCard(
                title = stringResource(R.string.humidity),
                value = "${sensorData?.humidity?.toInt() ?: "--"}",
                unit = "%",
                icon = Icons.Default.Cloud,
                statusText = stringResource(R.string.excellent),
                statusColor = AgroColors.AccentGreen,
                onClick = onMonitorClick,
                modifier = Modifier.weight(1f)
            )
            StatCard(
                title = stringResource(R.string.nitrogen),
                value = "${sensorData?.nitrogen?.toInt() ?: "--"}",
                unit = "mg/kg",
                icon = Icons.Default.Agriculture,
                statusText = stringResource(R.string.good),
                statusColor = Color(0xFFE57373),
                onClick = onMonitorClick,
                modifier = Modifier.weight(1f)
            )
        }
    }
}

private fun weatherIconFor(condition: String?): Int {
    val normalized = condition.orEmpty().lowercase()
    return when {
        "rain" in normalized || "drizzle" in normalized || "shower" in normalized -> R.drawable.weather_rain
        "cloud" in normalized || "overcast" in normalized || "fog" in normalized -> R.drawable.weather_cloud
        else -> R.drawable.weather_sunny
    }
}

private fun isLocationServiceEnabled(context: Context): Boolean {
    val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as? LocationManager ?: return false
    return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) ||
           locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)
}

@SuppressLint("MissingPermission")
private fun fetchDeviceLocation(
    fusedLocationClient: FusedLocationProviderClient,
    onLocationFound: (LatLng) -> Unit
) {
    try {
        fusedLocationClient.getCurrentLocation(Priority.PRIORITY_HIGH_ACCURACY, null)
            .addOnSuccessListener { location ->
                if (location != null) {
                    onLocationFound(LatLng(location.latitude, location.longitude))
                } else {
                    fusedLocationClient.lastLocation.addOnSuccessListener { lastLoc ->
                        lastLoc?.let {
                            onLocationFound(LatLng(it.latitude, it.longitude))
                        }
                    }
                }
            }
            .addOnFailureListener {
                fusedLocationClient.lastLocation.addOnSuccessListener { lastLoc ->
                    lastLoc?.let {
                        onLocationFound(LatLng(it.latitude, it.longitude))
                    }
                }
            }
    } catch (e: Exception) {
        // Fallback
    }
}

package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.screens

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.LocationManager
import android.net.Uri
import android.provider.Settings
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.R
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.AgroSupplier
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.WeatherInfo
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.AgroColors
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.GlassCard
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.InteractiveFarmMapView
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.LuxuryBackground
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.viewmodel.AgroViewModel
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.model.LatLng
import kotlin.math.*

@OptIn(ExperimentalMaterial3Api::class)
@SuppressLint("MissingPermission")
@Composable
fun FarmMapScreen(
    viewModel: AgroViewModel,
    onBack: () -> Unit = {}
) {
    val context = LocalContext.current

    val currentLocation by viewModel.currentLocation.collectAsState()
    val weatherInfo by viewModel.weatherInfo.collectAsState()
    val isWeatherLoading by viewModel.isWeatherLoading.collectAsState()
    val suppliers by viewModel.suppliers.collectAsState()
    val selectedSupplier by viewModel.selectedSupplier.collectAsState()
    val selectedCategory by viewModel.mapFilterCategory.collectAsState()
    val searchQuery by viewModel.mapSearchQuery.collectAsState()
    val uiMessage by viewModel.uiMessage.collectAsState()

    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(uiMessage) {
        uiMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.clearUiMessage()
        }
    }

    var mapLayer by remember { mutableStateOf("satellite") } // "satellite", "hybrid", "streets", "terrain"
    var showMapTypeMenu by remember { mutableStateOf(false) }
    var pickedLocation by remember { mutableStateOf<LatLng?>(null) }

    val defaultFarmCenter = LatLng(11.0168, 76.9558)
    var mapCenter by remember { mutableStateOf(currentLocation ?: defaultFarmCenter) }

    val fusedLocationClient = remember {
        LocationServices.getFusedLocationProviderClient(context)
    }

    var hasLocationPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        )
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasLocationPermission = granted
        if (granted) {
            fetchDeviceLocation(
                fusedLocationClient = fusedLocationClient,
                onLocationFound = { location ->
                    viewModel.updateLocation(location)
                    mapCenter = location
                }
            )
        }
    }

    LaunchedEffect(hasLocationPermission) {
        if (hasLocationPermission) {
            if (currentLocation == null) {
                fetchDeviceLocation(
                    fusedLocationClient = fusedLocationClient,
                    onLocationFound = { location ->
                        viewModel.updateLocation(location)
                        mapCenter = location
                    }
                )
            }
        } else {
            permissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
        }
    }

    LaunchedEffect(currentLocation) {
        currentLocation?.let { location ->
            mapCenter = location
        }
    }

    val categories = listOf(
        "all" to ("All Hubs" to "🗺️"),
        "fertilizer" to ("Fertilizers" to "🌱"),
        "protection" to ("Pesticides & Seeds" to "🛡️"),
        "lab" to ("Testing Labs" to "🔬"),
        "equipment" to ("Equipment" to "⚙️")
    )

    LuxuryBackground(
        imageUrl = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920&auto=format&fit=crop"
    ) {
        Scaffold(
            snackbarHost = { SnackbarHost(snackbarHostState) },
            containerColor = Color.Transparent,
            topBar = {
                CenterAlignedTopAppBar(
                    title = { 
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                "AGROAI GEO-INTELLIGENCE", 
                                fontSize = 11.sp, 
                                fontWeight = FontWeight.Bold, 
                                color = AgroColors.AccentGreen, 
                                letterSpacing = 1.5.sp
                            )
                            Text(
                                "Live Farm Map 🌾", 
                                fontWeight = FontWeight.Black, 
                                color = Color.White, 
                                fontSize = 17.sp
                            )
                        }
                    },
                    navigationIcon = {
                        IconButton(
                            onClick = onBack,
                            modifier = Modifier
                                .padding(start = 8.dp)
                                .background(Color.White.copy(alpha = 0.15f), CircleShape)
                        ) {
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = Color.White)
                        }
                    },
                    actions = {
                        IconButton(
                            onClick = {
                                val activeLoc = pickedLocation ?: currentLocation ?: defaultFarmCenter
                                launchGoogleMapsApp(context, activeLoc, "Farm Field Location")
                            },
                            modifier = Modifier
                                .padding(end = 4.dp)
                                .background(Color.White.copy(alpha = 0.15f), CircleShape)
                        ) {
                            Icon(Icons.Default.OpenInNew, contentDescription = "Open in Google Maps App", tint = AgroColors.AccentGreen)
                        }
                        Box {
                            IconButton(
                                onClick = { showMapTypeMenu = true },
                                modifier = Modifier
                                    .padding(end = 8.dp)
                                    .background(Color.White.copy(alpha = 0.15f), CircleShape)
                            ) {
                                Icon(Icons.Default.Layers, contentDescription = "Map type", tint = Color.White)
                            }
                            DropdownMenu(
                                expanded = showMapTypeMenu,
                                onDismissRequest = { showMapTypeMenu = false },
                                modifier = Modifier.background(Color(0xFF1E2E1E))
                            ) {
                                DropdownMenuItem(
                                    text = { Text("🛰️ Satellite HD", color = Color.White, fontWeight = FontWeight.Bold) },
                                    onClick = {
                                        mapLayer = "satellite"
                                        showMapTypeMenu = false
                                    },
                                    leadingIcon = { Icon(Icons.Default.Cloud, contentDescription = null, tint = AgroColors.AccentGreen) }
                                )
                                DropdownMenuItem(
                                    text = { Text("🌐 Google Hybrid", color = Color.White, fontWeight = FontWeight.Bold) },
                                    onClick = {
                                        mapLayer = "hybrid"
                                        showMapTypeMenu = false
                                    },
                                    leadingIcon = { Icon(Icons.Default.Public, contentDescription = null, tint = AgroColors.AccentGreen) }
                                )
                                DropdownMenuItem(
                                    text = { Text("🗺️ Standard Streets", color = Color.White, fontWeight = FontWeight.Bold) },
                                    onClick = {
                                        mapLayer = "streets"
                                        showMapTypeMenu = false
                                    },
                                    leadingIcon = { Icon(Icons.Default.Map, contentDescription = null, tint = AgroColors.AccentGreen) }
                                )
                                DropdownMenuItem(
                                    text = { Text("⛰️ Terrain Elevation", color = Color.White, fontWeight = FontWeight.Bold) },
                                    onClick = {
                                        mapLayer = "terrain"
                                        showMapTypeMenu = false
                                    },
                                    leadingIcon = { Icon(Icons.Default.Terrain, contentDescription = null, tint = AgroColors.AccentGreen) }
                                )
                            }
                        }
                    },
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = Color.Black.copy(alpha = 0.85f))
                )
            }
        ) { padding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
            ) {
                // Interactive Map View
                InteractiveFarmMapView(
                    center = mapCenter,
                    pickedLocation = pickedLocation,
                    currentLocation = currentLocation,
                    suppliers = suppliers,
                    mapLayer = mapLayer,
                    onLocationSelected = { loc ->
                        pickedLocation = loc
                        viewModel.selectSupplier(null)
                    },
                    onSupplierSelected = { supplierId ->
                        val found = suppliers.find { it.id == supplierId }
                        if (found != null) {
                            viewModel.selectSupplier(found)
                            mapCenter = LatLng(found.latitude, found.longitude)
                        }
                    },
                    modifier = Modifier.fillMaxSize()
                )

                // Top Controls: Search Bar & Filter Chips
                Column(
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .fillMaxWidth()
                        .padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Search Bar
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(24.dp),
                        color = Color.Black.copy(alpha = 0.80f),
                        border = androidx.compose.foundation.BorderStroke(1.dp, AgroColors.PrimaryGreen.copy(alpha = 0.5f))
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.Search, contentDescription = null, tint = AgroColors.AccentGreen)
                            Spacer(modifier = Modifier.width(10.dp))
                            TextField(
                                value = searchQuery,
                                onValueChange = { viewModel.setMapSearchQuery(it) },
                                placeholder = { Text("Search fertilizers, seeds, testing labs...", color = Color.White.copy(alpha = 0.5f), fontSize = 13.sp) },
                                singleLine = true,
                                colors = TextFieldDefaults.colors(
                                    focusedContainerColor = Color.Transparent,
                                    unfocusedContainerColor = Color.Transparent,
                                    focusedIndicatorColor = Color.Transparent,
                                    unfocusedIndicatorColor = Color.Transparent,
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White
                                ),
                                modifier = Modifier.weight(1f)
                            )
                            if (searchQuery.isNotEmpty()) {
                                IconButton(
                                    onClick = { viewModel.setMapSearchQuery("") },
                                    modifier = Modifier.size(28.dp)
                                ) {
                                    Icon(Icons.Default.Close, contentDescription = "Clear", tint = Color.White, modifier = Modifier.size(16.dp))
                                }
                            }
                        }
                    }

                    // Category Filter Chips
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        items(categories) { (catKey, pair) ->
                            val (catLabel, emoji) = pair
                            val isSelected = selectedCategory.equals(catKey, ignoreCase = true)
                            FilterChip(
                                selected = isSelected,
                                onClick = { viewModel.selectMapCategory(catKey) },
                                label = { Text("$emoji $catLabel", fontSize = 12.sp, fontWeight = FontWeight.Bold) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = AgroColors.PrimaryGreen,
                                    selectedLabelColor = Color.White,
                                    containerColor = Color.Black.copy(alpha = 0.75f),
                                    labelColor = Color.White.copy(alpha = 0.85f)
                                ),
                                border = FilterChipDefaults.filterChipBorder(
                                    enabled = true,
                                    selected = isSelected,
                                    borderColor = if (isSelected) AgroColors.PrimaryGreen else Color.White.copy(alpha = 0.2f)
                                )
                            )
                        }
                    }
                }

                // Recenter GPS Button
                FloatingActionButton(
                    onClick = {
                        val gps = isLocationServiceEnabled(context)
                        if (!hasLocationPermission) {
                            permissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
                        } else if (!gps) {
                            try {
                                context.startActivity(Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS))
                            } catch (e: Exception) {
                                // ignore
                            }
                        } else {
                            fetchDeviceLocation(
                                fusedLocationClient = fusedLocationClient,
                                onLocationFound = { location ->
                                    viewModel.updateLocation(location)
                                    mapCenter = location
                                    viewModel.selectSupplier(null)
                                }
                            )
                        }
                    },
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(end = 16.dp, bottom = if (selectedSupplier != null || pickedLocation != null) 230.dp else 100.dp),
                    containerColor = AgroColors.PrimaryGreen,
                    contentColor = Color.White,
                    shape = CircleShape
                ) {
                    Icon(Icons.Default.MyLocation, contentDescription = "Center map")
                }

                // Bottom Panel: Selected Supplier OR Selected Farm Plot
                Box(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .fillMaxWidth()
                        .padding(12.dp)
                ) {
                    if (selectedSupplier != null) {
                        SupplierDetailCard(
                            supplier = selectedSupplier!!,
                            userLocation = currentLocation,
                            onClose = { viewModel.selectSupplier(null) },
                            onNavigate = {
                                launchGoogleMapsApp(context, LatLng(selectedSupplier!!.latitude, selectedSupplier!!.longitude), selectedSupplier!!.name)
                            },
                            onCall = {
                                val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${selectedSupplier!!.phone}"))
                                context.startActivity(intent)
                            }
                        )
                    } else if (pickedLocation != null) {
                        PlotDetailCard(
                            location = pickedLocation!!,
                            weather = weatherInfo,
                            isWeatherLoading = isWeatherLoading,
                            onVerifyAndSave = {
                                viewModel.saveFarmLocation(pickedLocation!!)
                                viewModel.updateLocation(pickedLocation!!)
                            },
                            onOpenInGoogleMaps = {
                                launchGoogleMapsApp(context, pickedLocation!!, "Farm Plot")
                            },
                            onClose = { pickedLocation = null }
                        )
                    } else {
                        // Quick Helper Banner
                        DefaultMapHelperCard(
                            currentLocation = currentLocation,
                            onPickPlot = {
                                currentLocation?.let {
                                    pickedLocation = it
                                    viewModel.updateLocation(it)
                                }
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun SupplierDetailCard(
    supplier: AgroSupplier,
    userLocation: LatLng?,
    onClose: () -> Unit,
    onNavigate: () -> Unit,
    onCall: () -> Unit
) {
    val distanceKm = remember(userLocation, supplier) {
        if (userLocation != null) {
            calculateDistanceKm(userLocation.latitude, userLocation.longitude, supplier.latitude, supplier.longitude)
        } else null
    }

    GlassCard(
        modifier = Modifier.fillMaxWidth(),
        cornerRadius = 20.dp
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val (badgeColor, emoji) = when (supplier.category) {
                        "protection" -> Color(0xFFEAB308) to "🛡️"
                        "lab" -> Color(0xFF8B5CF6) to "🔬"
                        "equipment" -> Color(0xFFF97316) to "⚙️"
                        else -> AgroColors.PrimaryGreen to "🌱"
                    }
                    Surface(
                        color = badgeColor.copy(alpha = 0.25f),
                        shape = RoundedCornerShape(8.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, badgeColor)
                    ) {
                        Text(
                            text = "$emoji ${supplier.category.uppercase()}",
                            color = Color.White,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                        )
                    }
                    Text(
                        text = "⭐ ${supplier.rating} • ${supplier.status}",
                        fontSize = 11.sp,
                        color = Color(0xFFFFD54F),
                        fontWeight = FontWeight.Bold
                    )
                }

                IconButton(
                    onClick = onClose,
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White.copy(alpha = 0.7f))
                }
            }

            Text(
                text = supplier.name,
                fontWeight = FontWeight.Black,
                fontSize = 16.sp,
                color = Color.White,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            Text(
                text = "${supplier.address} ${distanceKm?.let { "• %.1f km away".format(it) } ?: ""}",
                fontSize = 12.sp,
                color = Color.White.copy(alpha = 0.75f),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            // Stock / Services Pills
            if (supplier.stock.isNotEmpty()) {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(supplier.stock) { stockItem ->
                        Surface(
                            color = Color.White.copy(alpha = 0.12f),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = "✓ $stockItem",
                                color = Color.White.copy(alpha = 0.9f),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Medium,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Button(
                    onClick = onCall,
                    modifier = Modifier.weight(1f).height(42.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = AgroColors.PrimaryGreen)
                ) {
                    Icon(Icons.Default.Phone, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("CALL HUB", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }

                Button(
                    onClick = onNavigate,
                    modifier = Modifier.weight(1f).height(42.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB))
                ) {
                    Icon(Icons.Default.Directions, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("NAVIGATE", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
private fun PlotDetailCard(
    location: LatLng,
    weather: WeatherInfo?,
    isWeatherLoading: Boolean,
    onVerifyAndSave: () -> Unit,
    onOpenInGoogleMaps: () -> Unit,
    onClose: () -> Unit
) {
    GlassCard(
        modifier = Modifier.fillMaxWidth(),
        cornerRadius = 20.dp
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("🚜 SELECTED FARM PLOT", fontWeight = FontWeight.Black, fontSize = 12.sp, color = AgroColors.AccentGreen)
                }
                IconButton(onClick = onClose, modifier = Modifier.size(24.dp)) {
                    Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White.copy(alpha = 0.7f))
                }
            }

            Text(
                text = "Coordinates: Lat %.5f, Lng %.5f".format(location.latitude, location.longitude),
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )

            // Weather telemetry preview
            if (weather != null) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.Black.copy(alpha = 0.3f), RoundedCornerShape(10.dp))
                        .padding(8.dp),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    WeatherStatSmall(Icons.Default.Thermostat, "${weather.temperature.toInt()}°C", "Temp")
                    WeatherStatSmall(Icons.Default.WaterDrop, "${weather.humidity}%", "Humidity")
                    WeatherStatSmall(Icons.Default.WindPower, "${weather.windSpeed.toInt()} km/h", "Wind")
                    WeatherStatSmall(Icons.Default.WbSunny, weather.condition, "Sky")
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Button(
                    onClick = onVerifyAndSave,
                    modifier = Modifier.weight(1.3f).height(44.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = AgroColors.PrimaryGreen),
                    enabled = !isWeatherLoading
                ) {
                    if (isWeatherLoading) {
                        CircularProgressIndicator(modifier = Modifier.size(18.dp), color = Color.White, strokeWidth = 2.dp)
                    } else {
                        Icon(Icons.Default.CloudUpload, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("SAVE & SYNC PLOT", fontWeight = FontWeight.Bold, fontSize = 11.sp)
                    }
                }

                OutlinedButton(
                    onClick = onOpenInGoogleMaps,
                    modifier = Modifier.weight(1f).height(44.dp),
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.4f)),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White)
                ) {
                    Icon(Icons.Default.OpenInNew, contentDescription = null, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("MAPS APP", fontWeight = FontWeight.Bold, fontSize = 11.sp)
                }
            }
        }
    }
}

@Composable
private fun DefaultMapHelperCard(
    currentLocation: LatLng?,
    onPickPlot: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        color = Color.Black.copy(alpha = 0.85f),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.15f))
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .background(AgroColors.PrimaryGreen.copy(alpha = 0.25f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.TouchApp, contentDescription = null, tint = AgroColors.AccentGreen, modifier = Modifier.size(22.dp))
            }

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Tap on map to select plot",
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    color = Color.White
                )
                Text(
                    text = "Discover nearby fertilizer hubs, labs & agro supplies",
                    fontSize = 11.sp,
                    color = Color.White.copy(alpha = 0.7f)
                )
            }

            if (currentLocation != null) {
                Surface(
                    onClick = onPickPlot,
                    shape = RoundedCornerShape(10.dp),
                    color = AgroColors.PrimaryGreen
                ) {
                    Text(
                        text = "SET MY GPS",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun WeatherStatSmall(icon: ImageVector, value: String, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Icon(icon, contentDescription = null, tint = AgroColors.AccentGreen, modifier = Modifier.size(16.dp))
        Text(value, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 11.sp)
        Text(label, color = Color.White.copy(alpha = 0.5f), fontSize = 9.sp)
    }
}

private fun calculateDistanceKm(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
    val r = 6371.0 // Radius of earth in km
    val dLat = Math.toRadians(lat2 - lat1)
    val dLon = Math.toRadians(lon2 - lon1)
    val a = sin(dLat / 2) * sin(dLat / 2) +
            cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) *
            sin(dLon / 2) * sin(dLon / 2)
    val c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return r * c
}

fun launchGoogleMapsApp(context: android.content.Context, location: LatLng?, label: String = "Farm Field Location") {
    val lat = location?.latitude ?: 11.0168
    val lng = location?.longitude ?: 76.9558
    try {
        val gmmIntentUri = Uri.parse("geo:$lat,$lng?q=$lat,$lng($label)&z=16")
        val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri).apply {
            setPackage("com.google.android.apps.maps")
        }
        context.startActivity(mapIntent)
    } catch (e: Exception) {
        val browserUri = Uri.parse("https://www.google.com/maps/search/?api=1&query=$lat,$lng")
        val browserIntent = Intent(Intent.ACTION_VIEW, browserUri)
        context.startActivity(browserIntent)
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
        fusedLocationClient.getCurrentLocation(com.google.android.gms.location.Priority.PRIORITY_HIGH_ACCURACY, null)
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

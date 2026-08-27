package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.screens

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.automirrored.filled.Notes
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.R
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.AgroColors
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.GlassCard
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.LuxuryBackground
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.viewmodel.AgroViewModel

data class UserData(
    val fullName: String? = null,
    val phone: String? = null,
    val email: String? = null,
    val farmName: String? = null,
    val farmLocation: String? = null,
    val farmSize: Double? = null,
    val profileImageUri: String? = null,
    val experienceYears: Int = 0,
    val primaryCrops: String = "Rice, Tomato, Cotton",
    val soilType: String = "Black Soil",
    val irrigationSystem: String = "Drip Irrigation",
    val waterSource: String = "Borewell",
    val farmingMethod: String = "Precision / Smart Farming",
    val stateRegion: String? = null,
    val farmBio: String? = null,
    val annualYieldTarget: String? = null
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    viewModel: AgroViewModel,
    onLogout: () -> Unit
) {
    val context = LocalContext.current
    val selectedLanguage by viewModel.selectedLanguage.collectAsState()
    val isDarkMode by viewModel.isDarkMode.collectAsState()
    val notificationsEnabled by viewModel.notificationsEnabled.collectAsState()
    val twoFactorEnabled by viewModel.twoFactorEnabled.collectAsState()
    val biometricLoginEnabled by viewModel.biometricLoginEnabled.collectAsState()
    val aiSensitivity by viewModel.aiSensitivity.collectAsState()
    val syncProgress by viewModel.syncProgress.collectAsState()
    val isSyncing by viewModel.isSyncing.collectAsState()
    val isExporting by viewModel.isExporting.collectAsState()
    val isCalibrating by viewModel.isCalibrating.collectAsState()
    val uiMessage by viewModel.uiMessage.collectAsState()
    val loggedInUserEntity by viewModel.loggedInUser.collectAsState()

    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(uiMessage) {
        uiMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.clearUiMessage()
        }
    }

    val loggedInUser = remember(loggedInUserEntity) {
        loggedInUserEntity?.let {
            UserData(
                fullName = it.fullName,
                phone = it.phone,
                email = it.email,
                farmName = it.farmName ?: "Green Valley Agro Farm",
                farmLocation = it.farmLocation ?: "Field Zone 1",
                farmSize = it.farmSize?.toDouble() ?: 5.0,
                profileImageUri = it.profileImageUri,
                experienceYears = it.experienceYears,
                primaryCrops = it.primaryCrops ?: "Rice, Tomato, Cotton",
                soilType = it.soilType ?: "Black Soil",
                irrigationSystem = it.irrigationSystem ?: "Drip Irrigation",
                waterSource = it.waterSource ?: "Borewell",
                farmingMethod = it.farmingMethod ?: "Precision / Smart Farming",
                stateRegion = it.stateRegion ?: "Karnataka",
                farmBio = it.farmBio ?: "Dedicated to high-yield sustainable agriculture using AgroAI smart diagnostics.",
                annualYieldTarget = it.annualYieldTarget ?: "60 Quintals / Acre"
            )
        } ?: UserData(
            fullName = "Agro Smart Farmer",
            phone = "+91 9876543210",
            email = "farmer@agroai.com",
            farmName = "Golden Harvest Hub",
            farmLocation = "Zone 4, Mandya",
            farmSize = 8.5,
            experienceYears = 4,
            primaryCrops = "Rice, Tomato, Wheat",
            soilType = "Black Soil",
            irrigationSystem = "Drip Irrigation",
            waterSource = "Borewell & Canal",
            farmingMethod = "Precision / Smart Farming",
            stateRegion = "Karnataka",
            farmBio = "Smart agriculture enthusiast leveraging AI-driven precision monitoring.",
            annualYieldTarget = "75 Quintals / Acre"
        )
    }

    var showLanguageDialog by remember { mutableStateOf(false) }
    var showEditProfileDialog by remember { mutableStateOf(false) }
    var showSensitivityDialog by remember { mutableStateOf(false) }
    var showSecurityDialog by remember { mutableStateOf(false) }

    var profileImageUri by remember(loggedInUser) { mutableStateOf(loggedInUser.profileImageUri) }

    val imagePickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri ->
        uri?.toString()?.let { imageUri ->
            profileImageUri = imageUri
            viewModel.updateProfileImage(imageUri)
        }
    }

    LuxuryBackground(imageUrl = "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1920&auto=format&fit=crop") {
        Scaffold(
            snackbarHost = { SnackbarHost(snackbarHostState) },
            containerColor = Color.Transparent,
            topBar = {
                CenterAlignedTopAppBar(
                    title = { 
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("AGROAI FARMER HUB", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = AgroColors.AccentGreen, letterSpacing = 1.sp)
                            Text("Profile & Farm Settings 🌾", fontWeight = FontWeight.Black, color = Color.White, fontSize = 18.sp)
                        }
                    },
                    actions = {
                        IconButton(
                            onClick = { showEditProfileDialog = true },
                            modifier = Modifier
                                .padding(end = 8.dp)
                                .background(AgroColors.PrimaryGreen, CircleShape)
                        ) {
                            Icon(
                                Icons.Default.Edit, 
                                contentDescription = "Edit Profile",
                                tint = Color.White,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    },
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = Color.Transparent)
                )
            }
        ) { padding ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Profile Hero Card
                item {
                    ProfileHero(
                        user = loggedInUser,
                        profileImageUri = profileImageUri,
                        onImagePick = { imagePickerLauncher.launch("image/*") },
                        onEditClick = { showEditProfileDialog = true }
                    )
                }

                // Farm Quick Metrics Grid
                item {
                    FarmMetricsGrid(user = loggedInUser)
                }

                // Farm Land & Geography Card
                item {
                    ControlSectionHeader(title = "FARM LAND & GEOGRAPHY", icon = Icons.Default.Landscape)
                    FarmIdentityCard(user = loggedInUser, onEditClick = { showEditProfileDialog = true })
                }

                // Crop & Cultivation Strategy Card
                item {
                    ControlSectionHeader(title = "CROP & CULTIVATION SYSTEM", icon = Icons.Default.Agriculture)
                    CropStrategyCard(user = loggedInUser, onEditClick = { showEditProfileDialog = true })
                }

                // Farmer Goals & Bio Card
                item {
                    ControlSectionHeader(title = "FARM GOALS & NOTES", icon = Icons.Default.EmojiEvents)
                    FarmBioCard(user = loggedInUser, onEditClick = { showEditProfileDialog = true })
                }

                // App Preferences Card
                item {
                    ControlSectionHeader(title = "APP PREFERENCES", icon = Icons.Default.Settings)
                    SettingsCard(
                        selectedLanguage = selectedLanguage,
                        isDarkMode = isDarkMode,
                        notificationsEnabled = notificationsEnabled,
                        onLanguageClick = { showLanguageDialog = true },
                        onDarkModeChange = { viewModel.setDarkMode(it) },
                        onNotificationsChange = { viewModel.setNotificationsEnabled(it) }
                    )
                }

                // AgroAI Diagnostic Tools Card
                item {
                    ControlSectionHeader(title = "AGROAI TOOLS & DIAGNOSTICS", icon = Icons.Default.Tune)
                    AdvancedToolsCard(
                        isSyncing = isSyncing,
                        syncProgress = syncProgress,
                        isExporting = isExporting,
                        isCalibrating = isCalibrating,
                        onSensitivityClick = { showSensitivityDialog = true },
                        onSyncClick = { viewModel.startCloudSync() },
                        onExportClick = { viewModel.exportFarmReport() },
                        onCalibrationClick = { viewModel.calibrateSensors() }
                    )
                }

                // Account & Security Card
                item {
                    ControlSectionHeader(title = "ACCOUNT & SECURITY", icon = Icons.Default.Security)
                    AccountCard(
                        onSecurityClick = { showSecurityDialog = true },
                        onShareClick = { viewModel.shareApp(context) },
                        onLogout = onLogout
                    )
                }
                
                item {
                    SystemInfoFooter()
                }
                
                item { Spacer(modifier = Modifier.height(100.dp)) }
            }
        }
    }

    if (showLanguageDialog) {
        LanguageSelectionDialog(
            currentLanguage = selectedLanguage,
            onDismiss = { showLanguageDialog = false },
            onLanguageSelected = {
                viewModel.setLanguage(it)
                showLanguageDialog = false
            }
        )
    }

    if (showEditProfileDialog) {
        EditProfileDialog(
            user = loggedInUser,
            onDismiss = { showEditProfileDialog = false },
            onSave = { name, phone, farmName, location, size, exp, crops, soil, irrigation, water, method, state, bio, yield ->
                viewModel.updateProfile(
                    fullName = name,
                    phone = phone,
                    farmName = farmName,
                    farmLocation = location,
                    farmSize = size,
                    profileImageUri = profileImageUri,
                    experienceYears = exp,
                    primaryCrops = crops,
                    soilType = soil,
                    irrigationSystem = irrigation,
                    waterSource = water,
                    farmingMethod = method,
                    stateRegion = state,
                    farmBio = bio,
                    annualYieldTarget = yield
                )
                showEditProfileDialog = false
            }
        )
    }

    if (showSensitivityDialog) {
        SensitivityAdjustmentDialog(
            currentValue = aiSensitivity,
            onDismiss = { showSensitivityDialog = false },
            onValueChange = { viewModel.setAiSensitivity(it) }
        )
    }

    if (showSecurityDialog) {
        PrivacySecurityDialog(
            twoFactorEnabled = twoFactorEnabled,
            biometricEnabled = biometricLoginEnabled,
            onDismiss = { showSecurityDialog = false },
            onToggleTwoFactor = { viewModel.setTwoFactorEnabled(it) },
            onToggleBiometric = { viewModel.setBiometricLoginEnabled(it) },
            onChangePassword = { old, new -> viewModel.changePassword(old, new) }
        )
    }
}

@Composable
private fun ControlSectionHeader(title: String, icon: ImageVector) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 4.dp, vertical = 2.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(icon, contentDescription = null, tint = AgroColors.AccentGreen, modifier = Modifier.size(16.dp))
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = title,
            fontSize = 11.sp,
            fontWeight = FontWeight.Black,
            color = Color.White.copy(alpha = 0.9f),
            letterSpacing = 1.sp
        )
    }
}

@Composable
private fun ProfileHero(
    user: UserData,
    profileImageUri: String?,
    onImagePick: () -> Unit,
    onEditClick: () -> Unit
) {
    GlassCard(modifier = Modifier.fillMaxWidth()) {
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(contentAlignment = Alignment.BottomEnd) {
                Surface(
                    shape = CircleShape,
                    color = Color.Black.copy(alpha = 0.4f),
                    border = androidx.compose.foundation.BorderStroke(3.dp, AgroColors.PrimaryGreen),
                    modifier = Modifier.size(90.dp)
                ) {
                    if (!profileImageUri.isNullOrEmpty()) {
                        AsyncImage(
                            model = ImageRequest.Builder(LocalContext.current)
                                .data(profileImageUri)
                                .crossfade(true)
                                .build(),
                            contentDescription = "Farmer Avatar",
                            modifier = Modifier.fillMaxSize().clip(CircleShape),
                            contentScale = ContentScale.Crop
                        )
                    } else {
                        Icon(
                            imageVector = Icons.Default.AccountCircle,
                            contentDescription = "Default Avatar",
                            tint = Color.White.copy(alpha = 0.7f),
                            modifier = Modifier.fillMaxSize().padding(12.dp)
                        )
                    }
                }
                
                IconButton(
                    onClick = onImagePick,
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(AgroColors.PrimaryGreen)
                ) {
                    Icon(Icons.Default.PhotoCamera, contentDescription = "Change Photo", tint = Color.White, modifier = Modifier.size(16.dp))
                }
            }
            
            Spacer(modifier = Modifier.height(10.dp))
            
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = user.fullName ?: "Smart Farmer",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
                Spacer(modifier = Modifier.width(6.dp))
                Surface(
                    color = AgroColors.PrimaryGreen.copy(alpha = 0.25f),
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, AgroColors.PrimaryGreen)
                ) {
                    Text(
                        text = "VERIFIED PRO",
                        color = AgroColors.AccentGreen,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "${user.phone ?: "Phone Not Provided"} • ${user.email ?: "farmer@agroai.com"}",
                fontSize = 12.sp,
                color = Color.White.copy(alpha = 0.75f),
                fontWeight = FontWeight.Medium
            )

            Spacer(modifier = Modifier.height(8.dp))
            Surface(
                onClick = onEditClick,
                color = AgroColors.PrimaryGreen,
                shape = RoundedCornerShape(12.dp)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(Icons.Default.Edit, contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp))
                    Text(
                        "EDIT FARM PROFILE",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 11.sp,
                        letterSpacing = 0.5.sp
                    )
                }
            }
        }
    }
}

@Composable
private fun FarmMetricsGrid(user: UserData) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        MetricCard(
            modifier = Modifier.weight(1f),
            label = "TOTAL LAND",
            value = "${user.farmSize ?: 5.0} Ac",
            icon = Icons.Default.Landscape
        )
        MetricCard(
            modifier = Modifier.weight(1f),
            label = "EXPERIENCE",
            value = "${user.experienceYears} Yrs",
            icon = Icons.Default.HistoryEdu
        )
        MetricCard(
            modifier = Modifier.weight(1f),
            label = "SOIL TYPE",
            value = user.soilType.split(" ").firstOrNull() ?: "Black",
            icon = Icons.Default.Terrain
        )
    }
}

@Composable
private fun MetricCard(
    modifier: Modifier = Modifier,
    label: String,
    value: String,
    icon: ImageVector
) {
    GlassCard(modifier = modifier) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(vertical = 4.dp)
        ) {
            Icon(icon, contentDescription = null, tint = AgroColors.AccentGreen, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = value,
                fontWeight = FontWeight.Black,
                fontSize = 14.sp,
                color = Color.White,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Text(
                text = label,
                fontSize = 9.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White.copy(alpha = 0.6f)
            )
        }
    }
}

@Composable
private fun FarmIdentityCard(user: UserData, onEditClick: () -> Unit) {
    GlassCard(modifier = Modifier.fillMaxWidth()) {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("ESTATE & LOCATION", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = AgroColors.AccentGreen)
                Icon(
                    Icons.Default.Edit,
                    contentDescription = "Edit",
                    tint = Color.White.copy(alpha = 0.6f),
                    modifier = Modifier.size(16.dp).clickable { onEditClick() }
                )
            }
            InfoRow(label = "FARM / AGRO HUB", value = user.farmName ?: "Main Farm")
            InfoRow(label = "LOCATION / DISTRICT", value = user.farmLocation ?: "Mandya Region")
            InfoRow(label = "STATE / PROVINCE", value = user.stateRegion ?: "Karnataka")
            InfoRow(label = "TOTAL CULTIVATED AREA", value = "${user.farmSize ?: 5.0} Acres")
            InfoRow(label = "PRIMARY WATER SOURCE", value = user.waterSource)
        }
    }
}

@Composable
private fun CropStrategyCard(user: UserData, onEditClick: () -> Unit) {
    GlassCard(modifier = Modifier.fillMaxWidth()) {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("CROP & SYSTEM DETAILS", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = AgroColors.AccentGreen)
                Icon(
                    Icons.Default.Edit,
                    contentDescription = "Edit",
                    tint = Color.White.copy(alpha = 0.6f),
                    modifier = Modifier.size(16.dp).clickable { onEditClick() }
                )
            }
            
            // Primary Crops Badges
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text("PRIMARY CROPS GROWN", fontSize = 10.sp, color = Color.White.copy(alpha = 0.6f), fontWeight = FontWeight.Bold)
                val cropList = user.primaryCrops.split(",").map { it.trim() }.filter { it.isNotEmpty() }
                LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    items(cropList) { crop ->
                        Surface(
                            color = AgroColors.PrimaryGreen.copy(alpha = 0.35f),
                            shape = RoundedCornerShape(8.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, AgroColors.PrimaryGreen)
                        ) {
                            Text(
                                text = "🌱 $crop",
                                color = Color.White,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }
            }

            HorizontalDivider(color = Color.White.copy(alpha = 0.1f), thickness = 0.5.dp)

            InfoRow(label = "SOIL CLASSIFICATION", value = user.soilType)
            InfoRow(label = "IRRIGATION SYSTEM", value = user.irrigationSystem)
            InfoRow(label = "FARMING TECHNIQUE", value = user.farmingMethod)
        }
    }
}

@Composable
private fun FarmBioCard(user: UserData, onEditClick: () -> Unit) {
    GlassCard(modifier = Modifier.fillMaxWidth()) {
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("TARGET YIELD & NOTES", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = AgroColors.AccentGreen)
                Icon(
                    Icons.Default.Edit,
                    contentDescription = "Edit",
                    tint = Color.White.copy(alpha = 0.6f),
                    modifier = Modifier.size(16.dp).clickable { onEditClick() }
                )
            }
            InfoRow(label = "ANNUAL TARGET YIELD", value = user.annualYieldTarget ?: "50 Q / Acre")
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text("FARMER VISION & BIO", fontSize = 10.sp, color = Color.White.copy(alpha = 0.6f), fontWeight = FontWeight.Bold)
                Text(
                    text = user.farmBio ?: "Operating precision agro-monitoring to maximize crop yield & eliminate disease outbreaks.",
                    fontSize = 12.sp,
                    color = Color.White.copy(alpha = 0.9f),
                    lineHeight = 16.sp
                )
            }
        }
    }
}

@Composable
private fun SettingsCard(
    selectedLanguage: String,
    isDarkMode: Boolean,
    notificationsEnabled: Boolean,
    onLanguageClick: () -> Unit,
    onDarkModeChange: (Boolean) -> Unit,
    onNotificationsChange: (Boolean) -> Unit
) {
    GlassCard(modifier = Modifier.fillMaxWidth()) {
        Column {
            SettingsItem(
                icon = Icons.Default.Language,
                title = "App Language",
                value = selectedLanguage.uppercase(),
                onClick = onLanguageClick
            )
            HorizontalDivider(modifier = Modifier.padding(vertical = 4.dp), color = Color.White.copy(alpha = 0.1f), thickness = 0.5.dp)
            SettingsItem(
                icon = Icons.Default.Brightness4,
                title = "Dark Theme",
                trailing = { Switch(checked = isDarkMode, onCheckedChange = onDarkModeChange, colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = AgroColors.PrimaryGreen)) }
            )
            HorizontalDivider(modifier = Modifier.padding(vertical = 4.dp), color = Color.White.copy(alpha = 0.1f), thickness = 0.5.dp)
            SettingsItem(
                icon = Icons.Default.Notifications,
                title = "Push Notifications",
                trailing = { Switch(checked = notificationsEnabled, onCheckedChange = onNotificationsChange, colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = AgroColors.PrimaryGreen)) }
            )
        }
    }
}

@Composable
private fun AdvancedToolsCard(
    isSyncing: Boolean,
    syncProgress: Int?,
    isExporting: Boolean,
    isCalibrating: Boolean,
    onSensitivityClick: () -> Unit,
    onSyncClick: () -> Unit,
    onExportClick: () -> Unit,
    onCalibrationClick: () -> Unit
) {
    GlassCard(modifier = Modifier.fillMaxWidth()) {
        Column {
            SettingsItem(icon = Icons.Default.Tune, title = "AI Sensitivity", onClick = onSensitivityClick)
            SettingsItem(
                icon = Icons.Default.CloudSync,
                title = "Cloud Data Backup",
                subtitle = if (isSyncing) "Syncing records... $syncProgress%" else "Sync farm records to cloud",
                trailing = { if (isSyncing) CircularProgressIndicator(modifier = Modifier.size(20.dp), color = Color.White, strokeWidth = 2.dp) },
                onClick = onSyncClick
            )
            SettingsItem(
                icon = Icons.Default.FileDownload,
                title = "Export Farm Health Report",
                trailing = { if (isExporting) CircularProgressIndicator(modifier = Modifier.size(20.dp), color = Color.White, strokeWidth = 2.dp) },
                onClick = onExportClick
            )
            SettingsItem(
                icon = Icons.Default.PrecisionManufacturing,
                title = "Calibrate IoT Sensors",
                trailing = { if (isCalibrating) CircularProgressIndicator(modifier = Modifier.size(20.dp), color = Color.White, strokeWidth = 2.dp) },
                onClick = onCalibrationClick
            )
        }
    }
}

@Composable
private fun AccountCard(onSecurityClick: () -> Unit, onShareClick: () -> Unit, onLogout: () -> Unit) {
    GlassCard(modifier = Modifier.fillMaxWidth()) {
        Column {
            SettingsItem(icon = Icons.Default.Security, title = "Security & Passwords", onClick = onSecurityClick)
            SettingsItem(icon = Icons.Default.Share, title = "Share App with Farmers", onClick = onShareClick)
            HorizontalDivider(modifier = Modifier.padding(vertical = 4.dp), color = Color.White.copy(alpha = 0.1f), thickness = 0.5.dp)
            SettingsItem(
                icon = Icons.AutoMirrored.Filled.Logout,
                title = "Log Out",
                titleColor = Color(0xFFEF5350),
                onClick = onLogout
            )
        }
    }
}

@Composable
private fun InfoRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(), 
        horizontalArrangement = Arrangement.SpaceBetween, 
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label, 
            color = Color.White.copy(alpha = 0.65f), 
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = value, 
            fontWeight = FontWeight.Bold, 
            fontSize = 13.sp,
            color = Color.White,
            textAlign = TextAlign.End,
            modifier = Modifier.padding(start = 12.dp)
        )
    }
}

@Composable
private fun SettingsItem(
    icon: ImageVector,
    title: String,
    subtitle: String? = null,
    value: String? = null,
    titleColor: Color = Color.White,
    trailing: @Composable (() -> Unit)? = null,
    onClick: () -> Unit = {}
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(vertical = 12.dp, horizontal = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .background(AgroColors.PrimaryGreen.copy(alpha = 0.20f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon, 
                contentDescription = null, 
                tint = if (titleColor != Color.White) titleColor else AgroColors.AccentGreen, 
                modifier = Modifier.size(18.dp)
            )
        }
        
        Spacer(modifier = Modifier.width(14.dp))
        
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title, 
                fontWeight = FontWeight.Bold, 
                color = titleColor,
                fontSize = 14.sp
            )
            if (subtitle != null) {
                Text(
                    text = subtitle, 
                    fontSize = 11.sp, 
                    color = Color.White.copy(alpha = 0.6f),
                    fontWeight = FontWeight.Medium
                )
            }
        }
        if (value != null) {
            Text(
                text = value, 
                color = AgroColors.AccentGreen, 
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.width(6.dp))
        }
        if (trailing != null) {
            trailing()
        } else {
            Icon(
                Icons.Default.ChevronRight, 
                contentDescription = null, 
                tint = Color.White.copy(alpha = 0.3f),
                modifier = Modifier.size(18.dp)
            )
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun EditProfileDialog(
    user: UserData,
    onDismiss: () -> Unit,
    onSave: (
        fullName: String,
        phone: String,
        farmName: String,
        farmLocation: String,
        farmSize: Double,
        experienceYears: Int,
        primaryCrops: String,
        soilType: String,
        irrigationSystem: String,
        waterSource: String,
        farmingMethod: String,
        stateRegion: String?,
        farmBio: String?,
        annualYieldTarget: String?
    ) -> Unit
) {
    var fullName by remember(user) { mutableStateOf(user.fullName ?: "") }
    var phone by remember(user) { mutableStateOf(user.phone ?: "") }
    var farmName by remember(user) { mutableStateOf(user.farmName ?: "") }
    var location by remember(user) { mutableStateOf(user.farmLocation ?: "") }
    var stateRegion by remember(user) { mutableStateOf(user.stateRegion ?: "Karnataka") }
    var farmSizeText by remember(user) { mutableStateOf(user.farmSize?.toString() ?: "5.0") }
    var experienceText by remember(user) { mutableStateOf(user.experienceYears.toString()) }
    var crops by remember(user) { mutableStateOf(user.primaryCrops) }
    var soil by remember(user) { mutableStateOf(user.soilType) }
    var irrigation by remember(user) { mutableStateOf(user.irrigationSystem) }
    var waterSource by remember(user) { mutableStateOf(user.waterSource) }
    var farmingMethod by remember(user) { mutableStateOf(user.farmingMethod) }
    var annualYieldTarget by remember(user) { mutableStateOf(user.annualYieldTarget ?: "60 Quintals / Acre") }
    var farmBio by remember(user) { mutableStateOf(user.farmBio ?: "") }

    val commonCrops = listOf("Rice", "Tomato", "Wheat", "Cotton", "Corn", "Sugarcane", "Chilli", "Potato", "Soybean", "Groundnut")
    val commonSoils = listOf("Black Soil", "Alluvial Soil", "Red Soil", "Clay Soil", "Sandy Loam", "Laterite Soil")
    val commonIrrigations = listOf("Drip Irrigation", "Sprinkler System", "Surface / Flood", "Rainfed", "Sub-Irrigation")
    val commonWaterSources = listOf("Borewell", "Canal", "River", "Rainwater Harvesting", "Tube Well", "Open Well")
    val commonMethods = listOf("Precision / Smart Farming", "Organic Farming", "Conventional Farming", "Hydroponic / Greenhouse", "Mixed Farming")

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.92f),
            shape = RoundedCornerShape(24.dp),
            color = Color(0xFF1E2E1E),
            border = androidx.compose.foundation.BorderStroke(1.5.dp, AgroColors.PrimaryGreen)
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                // Dialog Header
                Surface(
                    color = AgroColors.PrimaryGreen,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 20.dp, vertical = 16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "EDIT FARM & PROFILE",
                                fontWeight = FontWeight.Black,
                                fontSize = 16.sp,
                                color = Color.White
                            )
                            Text(
                                text = "Update your full agricultural parameters",
                                fontSize = 11.sp,
                                color = Color.White.copy(alpha = 0.85f)
                            )
                        }
                        IconButton(onClick = onDismiss) {
                            Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
                        }
                    }
                }

                // Scrollable Form Body
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState())
                        .padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Section: Personal Details
                    DialogSectionHeader(title = "FARMER PERSONAL DETAILS", icon = Icons.Default.Person)
                    
                    OutlinedTextField(
                        value = fullName,
                        onValueChange = { fullName = it },
                        label = { Text("Farmer Full Name") },
                        leadingIcon = { Icon(Icons.Default.Person, contentDescription = null, tint = AgroColors.AccentGreen) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = editFieldColors()
                    )

                    OutlinedTextField(
                        value = phone,
                        onValueChange = { phone = it },
                        label = { Text("Contact Phone Number") },
                        leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null, tint = AgroColors.AccentGreen) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = editFieldColors()
                    )

                    OutlinedTextField(
                        value = experienceText,
                        onValueChange = { experienceText = it },
                        label = { Text("Farming Experience (Years)") },
                        leadingIcon = { Icon(Icons.Default.HistoryEdu, contentDescription = null, tint = AgroColors.AccentGreen) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = editFieldColors()
                    )

                    HorizontalDivider(color = Color.White.copy(alpha = 0.15f))

                    // Section: Farm Identity & Geography
                    DialogSectionHeader(title = "FARM IDENTITY & LOCATION", icon = Icons.Default.Agriculture)

                    OutlinedTextField(
                        value = farmName,
                        onValueChange = { farmName = it },
                        label = { Text("Farm / Agro Hub Name") },
                        leadingIcon = { Icon(Icons.Default.Agriculture, contentDescription = null, tint = AgroColors.AccentGreen) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = editFieldColors()
                    )

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        OutlinedTextField(
                            value = location,
                            onValueChange = { location = it },
                            label = { Text("Location / District") },
                            leadingIcon = { Icon(Icons.Default.LocationOn, contentDescription = null, tint = AgroColors.AccentGreen) },
                            modifier = Modifier.weight(1.2f),
                            shape = RoundedCornerShape(14.dp),
                            colors = editFieldColors()
                        )
                        OutlinedTextField(
                            value = stateRegion,
                            onValueChange = { stateRegion = it },
                            label = { Text("State") },
                            modifier = Modifier.weight(0.8f),
                            shape = RoundedCornerShape(14.dp),
                            colors = editFieldColors()
                        )
                    }

                    OutlinedTextField(
                        value = farmSizeText,
                        onValueChange = { farmSizeText = it },
                        label = { Text("Total Land Area (Acres)") },
                        leadingIcon = { Icon(Icons.Default.Landscape, contentDescription = null, tint = AgroColors.AccentGreen) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = editFieldColors()
                    )

                    HorizontalDivider(color = Color.White.copy(alpha = 0.15f))

                    // Section: Crop & Agronomy Setup
                    DialogSectionHeader(title = "CROPS & AGRONOMY", icon = Icons.Default.Grass)

                    // Quick Crop Chips
                    Text("Select / Add Primary Crops:", fontSize = 12.sp, color = Color.White.copy(alpha = 0.8f), fontWeight = FontWeight.Bold)
                    FlowRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        commonCrops.forEach { cropItem ->
                            val isSelected = crops.contains(cropItem, ignoreCase = true)
                            FilterChip(
                                selected = isSelected,
                                onClick = {
                                    val currentList = crops.split(",").map { it.trim() }.filter { it.isNotEmpty() }.toMutableList()
                                    if (isSelected) {
                                        currentList.removeAll { it.equals(cropItem, ignoreCase = true) }
                                    } else {
                                        currentList.add(cropItem)
                                    }
                                    crops = currentList.joinToString(", ")
                                },
                                label = { Text(cropItem, fontSize = 11.sp, fontWeight = FontWeight.SemiBold) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = AgroColors.PrimaryGreen,
                                    selectedLabelColor = Color.White,
                                    containerColor = Color.Black.copy(alpha = 0.3f),
                                    labelColor = Color.White.copy(alpha = 0.75f)
                                )
                            )
                        }
                    }

                    OutlinedTextField(
                        value = crops,
                        onValueChange = { crops = it },
                        label = { Text("Primary Crops (Custom)") },
                        placeholder = { Text("e.g. Rice, Tomato, Cotton") },
                        leadingIcon = { Icon(Icons.Default.Grass, contentDescription = null, tint = AgroColors.AccentGreen) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = editFieldColors()
                    )

                    // Quick Soil Type Chips
                    Text("Soil Classification:", fontSize = 12.sp, color = Color.White.copy(alpha = 0.8f), fontWeight = FontWeight.Bold)
                    FlowRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        commonSoils.forEach { soilOption ->
                            FilterChip(
                                selected = soil == soilOption,
                                onClick = { soil = soilOption },
                                label = { Text(soilOption, fontSize = 11.sp, fontWeight = FontWeight.SemiBold) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = AgroColors.PrimaryGreen,
                                    selectedLabelColor = Color.White,
                                    containerColor = Color.Black.copy(alpha = 0.3f),
                                    labelColor = Color.White.copy(alpha = 0.75f)
                                )
                            )
                        }
                    }

                    OutlinedTextField(
                        value = soil,
                        onValueChange = { soil = it },
                        label = { Text("Soil Type") },
                        leadingIcon = { Icon(Icons.Default.Terrain, contentDescription = null, tint = AgroColors.AccentGreen) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = editFieldColors()
                    )

                    HorizontalDivider(color = Color.White.copy(alpha = 0.15f))

                    // Section: Irrigation & Water Source
                    DialogSectionHeader(title = "IRRIGATION & WATER SOURCE", icon = Icons.Default.WaterDrop)

                    // Irrigation Chips
                    Text("Irrigation Technique:", fontSize = 12.sp, color = Color.White.copy(alpha = 0.8f), fontWeight = FontWeight.Bold)
                    FlowRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        commonIrrigations.forEach { irrOption ->
                            FilterChip(
                                selected = irrigation == irrOption,
                                onClick = { irrigation = irrOption },
                                label = { Text(irrOption, fontSize = 11.sp, fontWeight = FontWeight.SemiBold) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = AgroColors.PrimaryGreen,
                                    selectedLabelColor = Color.White,
                                    containerColor = Color.Black.copy(alpha = 0.3f),
                                    labelColor = Color.White.copy(alpha = 0.75f)
                                )
                            )
                        }
                    }

                    OutlinedTextField(
                        value = irrigation,
                        onValueChange = { irrigation = it },
                        label = { Text("Irrigation System") },
                        leadingIcon = { Icon(Icons.Default.Water, contentDescription = null, tint = AgroColors.AccentGreen) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = editFieldColors()
                    )

                    // Water Source Chips
                    Text("Water Supply Source:", fontSize = 12.sp, color = Color.White.copy(alpha = 0.8f), fontWeight = FontWeight.Bold)
                    FlowRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        commonWaterSources.forEach { waterOption ->
                            FilterChip(
                                selected = waterSource == waterOption,
                                onClick = { waterSource = waterOption },
                                label = { Text(waterOption, fontSize = 11.sp, fontWeight = FontWeight.SemiBold) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = AgroColors.PrimaryGreen,
                                    selectedLabelColor = Color.White,
                                    containerColor = Color.Black.copy(alpha = 0.3f),
                                    labelColor = Color.White.copy(alpha = 0.75f)
                                )
                            )
                        }
                    }

                    OutlinedTextField(
                        value = waterSource,
                        onValueChange = { waterSource = it },
                        label = { Text("Water Source") },
                        leadingIcon = { Icon(Icons.Default.Opacity, contentDescription = null, tint = AgroColors.AccentGreen) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = editFieldColors()
                    )

                    HorizontalDivider(color = Color.White.copy(alpha = 0.15f))

                    // Section: Farming Technique & Targets
                    DialogSectionHeader(title = "FARMING METHOD & YIELD TARGETS", icon = Icons.Default.EmojiEvents)

                    // Farming Method Chips
                    Text("Farming Practice / Method:", fontSize = 12.sp, color = Color.White.copy(alpha = 0.8f), fontWeight = FontWeight.Bold)
                    FlowRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        commonMethods.forEach { methodOption ->
                            FilterChip(
                                selected = farmingMethod == methodOption,
                                onClick = { farmingMethod = methodOption },
                                label = { Text(methodOption, fontSize = 11.sp, fontWeight = FontWeight.SemiBold) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = AgroColors.PrimaryGreen,
                                    selectedLabelColor = Color.White,
                                    containerColor = Color.Black.copy(alpha = 0.3f),
                                    labelColor = Color.White.copy(alpha = 0.75f)
                                )
                            )
                        }
                    }

                    OutlinedTextField(
                        value = farmingMethod,
                        onValueChange = { farmingMethod = it },
                        label = { Text("Farming Technique") },
                        leadingIcon = { Icon(Icons.Default.Biotech, contentDescription = null, tint = AgroColors.AccentGreen) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = editFieldColors()
                    )

                    OutlinedTextField(
                        value = annualYieldTarget,
                        onValueChange = { annualYieldTarget = it },
                        label = { Text("Target Annual Yield") },
                        placeholder = { Text("e.g. 60 Quintals / Acre") },
                        leadingIcon = { Icon(Icons.Default.Speed, contentDescription = null, tint = AgroColors.AccentGreen) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = editFieldColors()
                    )

                    OutlinedTextField(
                        value = farmBio,
                        onValueChange = { farmBio = it },
                        label = { Text("Farmer Bio / Agricultural Notes") },
                        placeholder = { Text("Briefly describe your farm mission or specialization...") },
                        leadingIcon = { Icon(Icons.AutoMirrored.Filled.Notes, contentDescription = null, tint = AgroColors.AccentGreen) },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 3,
                        maxLines = 5,
                        shape = RoundedCornerShape(14.dp),
                        colors = editFieldColors()
                    )
                }

                // Footer Confirm/Cancel Buttons
                Surface(
                    color = Color.Black.copy(alpha = 0.4f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        OutlinedButton(
                            onClick = onDismiss,
                            modifier = Modifier.weight(1f).height(50.dp),
                            shape = RoundedCornerShape(14.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.3f)),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White)
                        ) {
                            Text("CANCEL", fontWeight = FontWeight.Bold)
                        }

                        Button(
                            onClick = {
                                val size = farmSizeText.toDoubleOrNull() ?: 5.0
                                val exp = experienceText.toIntOrNull() ?: 0
                                onSave(
                                    fullName.trim(),
                                    phone.trim(),
                                    farmName.trim(),
                                    location.trim(),
                                    size,
                                    exp,
                                    crops.trim(),
                                    soil.trim(),
                                    irrigation.trim(),
                                    waterSource.trim(),
                                    farmingMethod.trim(),
                                    stateRegion.trim(),
                                    farmBio.trim(),
                                    annualYieldTarget.trim()
                                )
                            },
                            modifier = Modifier.weight(1.5f).height(50.dp),
                            shape = RoundedCornerShape(14.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = AgroColors.PrimaryGreen)
                        ) {
                            Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("SAVE CHANGES", fontWeight = FontWeight.Bold, letterSpacing = 0.5.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun DialogSectionHeader(title: String, icon: ImageVector) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.padding(top = 4.dp)
    ) {
        Icon(icon, contentDescription = null, tint = AgroColors.AccentGreen, modifier = Modifier.size(16.dp))
        Text(
            text = title,
            fontSize = 11.sp,
            fontWeight = FontWeight.Black,
            color = AgroColors.AccentGreen,
            letterSpacing = 1.sp
        )
    }
}

@Composable
private fun editFieldColors() = OutlinedTextFieldDefaults.colors(
    focusedBorderColor = AgroColors.PrimaryGreen,
    unfocusedBorderColor = Color.White.copy(alpha = 0.25f),
    focusedTextColor = Color.White,
    unfocusedTextColor = Color.White,
    focusedLabelColor = AgroColors.AccentGreen,
    unfocusedLabelColor = Color.White.copy(alpha = 0.7f),
    focusedContainerColor = Color.Black.copy(alpha = 0.35f),
    unfocusedContainerColor = Color.Black.copy(alpha = 0.25f)
)

@Composable
fun LanguageSelectionDialog(currentLanguage: String, onDismiss: () -> Unit, onLanguageSelected: (String) -> Unit) {
    val languages = listOf(
        "English" to "en",
        "Hindi (हिन्दी)" to "hi",
        "Tamil (தமிழ்)" to "ta",
        "Telugu (తెలుగు)" to "te",
        "Marathi (मराठी)" to "mr",
        "Spanish (Español)" to "es"
    )
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Select App Language", fontWeight = FontWeight.Bold, fontSize = 18.sp) },
        text = {
            Column {
                languages.forEach { (name, code) ->
                    Row(modifier = Modifier.fillMaxWidth().clickable { onLanguageSelected(code) }.padding(10.dp), verticalAlignment = Alignment.CenterVertically) {
                        RadioButton(selected = currentLanguage == code, onClick = { onLanguageSelected(code) }, colors = RadioButtonDefaults.colors(selectedColor = AgroColors.PrimaryGreen))
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(name, fontWeight = FontWeight.Medium, fontSize = 15.sp)
                    }
                }
            }
        },
        confirmButton = { TextButton(onClick = onDismiss) { Text("Close", color = AgroColors.PrimaryGreen) } }
    )
}

@Composable
fun SensitivityAdjustmentDialog(currentValue: Float, onDismiss: () -> Unit, onValueChange: (Float) -> Unit) {
    var sliderValue by remember { mutableStateOf(currentValue) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("AI Diagnostic Sensitivity", fontWeight = FontWeight.Bold, fontSize = 18.sp) },
        text = {
            Column {
                Text("Adjust the confidence threshold for AI crop disease detection.", fontSize = 13.sp)
                Spacer(modifier = Modifier.height(20.dp))
                Slider(value = sliderValue, onValueChange = { sliderValue = it }, valueRange = 0f..1f, steps = 10, colors = SliderDefaults.colors(thumbColor = AgroColors.PrimaryGreen, activeTrackColor = AgroColors.PrimaryGreen))
                Text("Confidence: ${(sliderValue * 100).toInt()}%", modifier = Modifier.align(Alignment.End), fontWeight = FontWeight.Bold, fontSize = 14.sp)
            }
        },
        confirmButton = { TextButton(onClick = { onValueChange(sliderValue); onDismiss() }) { Text("Apply", fontWeight = FontWeight.Bold, color = AgroColors.PrimaryGreen) } }
    )
}

@Composable
fun PrivacySecurityDialog(twoFactorEnabled: Boolean, biometricEnabled: Boolean, onDismiss: () -> Unit, onToggleTwoFactor: (Boolean) -> Unit, onToggleBiometric: (Boolean) -> Unit, onChangePassword: (String, String) -> Unit) {
    var oldPass by remember { mutableStateOf("") }
    var newPass by remember { mutableStateOf("") }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Account Security Settings", fontWeight = FontWeight.Bold, fontSize = 18.sp) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Text("Two-Factor Authentication", fontSize = 14.sp, fontWeight = FontWeight.Medium)
                    Switch(checked = twoFactorEnabled, onCheckedChange = onToggleTwoFactor, colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = AgroColors.PrimaryGreen))
                }
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Text("Biometric Sign In", fontSize = 14.sp, fontWeight = FontWeight.Medium)
                    Switch(checked = biometricEnabled, onCheckedChange = onToggleBiometric, colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = AgroColors.PrimaryGreen))
                }
                HorizontalDivider(color = Color.LightGray.copy(alpha = 0.5f), thickness = 0.5.dp)
                Text("Change Password", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                OutlinedTextField(value = oldPass, onValueChange = { oldPass = it }, label = { Text("Current Password") }, visualTransformation = PasswordVisualTransformation(), modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = newPass, onValueChange = { newPass = it }, label = { Text("New Password") }, visualTransformation = PasswordVisualTransformation(), modifier = Modifier.fillMaxWidth())
                Button(onClick = { onChangePassword(oldPass, newPass) }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp), colors = ButtonDefaults.buttonColors(containerColor = AgroColors.PrimaryGreen)) { Text("Update Password", color = Color.White, fontWeight = FontWeight.Bold) }
            }
        },
        confirmButton = { TextButton(onClick = onDismiss) { Text("Close", color = AgroColors.PrimaryGreen) } }
    )
}

@Composable
fun SystemInfoFooter() {
    Column(
        modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("AgroAI Monitoring System • v2.4 Pro", fontSize = 11.sp, color = Color.White.copy(alpha = 0.5f))
        Text("Powered by Precision Agriculture Intelligence", fontSize = 10.sp, color = Color.White.copy(alpha = 0.35f))
    }
}

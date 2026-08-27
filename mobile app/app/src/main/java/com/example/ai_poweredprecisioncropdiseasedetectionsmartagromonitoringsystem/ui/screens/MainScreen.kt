package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.screens

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.Chat
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.R
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.AgroColors
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.viewmodel.AgroViewModel

@Composable
fun MainScreen(viewModel: AgroViewModel, rootNavController: NavController) {
    val navController = rememberNavController()
    val uiMessage by viewModel.uiMessage.collectAsState()

    LaunchedEffect(uiMessage) {
        when (uiMessage) {
            "NAVIGATE_SCAN" -> {
                navController.navigate("scan")
                viewModel.clearUiMessage()
            }
            "NAVIGATE_MONITOR" -> {
                navController.navigate("monitor")
                viewModel.clearUiMessage()
            }
            "NAVIGATE_ALERTS" -> {
                navController.navigate("alerts")
                viewModel.clearUiMessage()
            }
            "NAVIGATE_PROFILE" -> {
                navController.navigate("profile")
                viewModel.clearUiMessage()
            }
            "NAVIGATE_MAP" -> {
                navController.navigate("map")
                viewModel.clearUiMessage()
            }
        }
    }

    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Scaffold(
        containerColor = Color.Transparent,
        contentWindowInsets = WindowInsets(0, 0, 0, 0),
        bottomBar = {
            BottomNavigationBar(navController)
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = BottomNavItem.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(BottomNavItem.Home.route) { 
                DashboardScreen(
                    viewModel = viewModel,
                    onNavigateToAlerts = { navController.navigate(BottomNavItem.Alerts.route) },
                    onNavigateToScan = { navController.navigate("crop_selection") },
                    onNavigateToMonitor = { navController.navigate(BottomNavItem.Monitor.route) },
                    onNavigateToChatbot = { navController.navigate("chatbot") },
                    onNavigateToMap = { navController.navigate("map") }
                ) 
            }
            composable("crop_selection") {
                CropSelectionScreen(
                    viewModel = viewModel,
                    onCropSelected = { navController.navigate(BottomNavItem.Scan.route) },
                    onBack = { navController.popBackStack() }
                )
            }
            composable(BottomNavItem.Scan.route) { 
                ScanScreen(
                    viewModel = viewModel,
                    onNavigateToCropSelection = { navController.navigate("crop_selection") }
                ) 
            }
            composable(BottomNavItem.Monitor.route) { MonitoringScreen(viewModel, navController) }
            composable(BottomNavItem.Alerts.route) { AlertsScreen(viewModel) }
            composable(BottomNavItem.Profile.route) { 
                ProfileScreen(
                    viewModel = viewModel,
                    onLogout = {
                        viewModel.logout()
                        rootNavController.navigate("login") {
                            popUpTo("main") { inclusive = true }
                        }
                    }
                )
            }
            composable("chatbot") { 
                ChatbotScreen(
                    viewModel = viewModel,
                    onBack = { navController.popBackStack() }
                ) 
            }
            composable("disease_guide") {
                CropDiseaseGuideScreen(
                    viewModel = viewModel,
                    onBack = { navController.popBackStack() }
                )
            }
            composable("map") { 
                FarmMapScreen(
                    viewModel = viewModel,
                    onBack = { navController.popBackStack() }
                ) 
            }
        }
    }
}

@Composable
fun BottomNavigationBar(navController: NavHostController) {
    val items = listOf(
        BottomNavItem.Home,
        BottomNavItem.Scan,
        BottomNavItem.Monitor,
        BottomNavItem.Alerts,
        BottomNavItem.Profile
    )
    
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .padding(horizontal = 14.dp, vertical = 8.dp)
    ) {
        Surface(
            color = Color(0xFF0A1F13).copy(alpha = 0.94f), // Rich Dark Emerald Glass
            shape = RoundedCornerShape(28.dp),
            border = androidx.compose.foundation.BorderStroke(
                width = 1.2.dp,
                brush = Brush.horizontalGradient(
                    colors = listOf(
                        Color(0xFF00E676).copy(alpha = 0.65f),
                        Color(0xFF00E5FF).copy(alpha = 0.45f),
                        Color(0xFF00E676).copy(alpha = 0.65f)
                    )
                )
            ),
            shadowElevation = 16.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 6.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                items.forEach { item ->
                    val isSelected = currentRoute == item.route || (item == BottomNavItem.Scan && currentRoute == "crop_selection")
                    val isScan = item == BottomNavItem.Scan

                    val scale by animateFloatAsState(
                        targetValue = if (isSelected) 1.08f else 1.0f,
                        animationSpec = tween(durationMillis = 200),
                        label = "iconScale"
                    )

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(18.dp))
                            .clickable {
                                val route = if (item == BottomNavItem.Scan) "crop_selection" else item.route
                                if (currentRoute != route) {
                                    navController.navigate(route) {
                                        popUpTo(navController.graph.startDestinationId) {
                                            saveState = true
                                        }
                                        launchSingleTop = true
                                        restoreState = true
                                    }
                                }
                            }
                            .padding(vertical = 4.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        if (isScan) {
                            // STANDOUT HERO SCAN BUTTON
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Center,
                                modifier = Modifier.scale(scale)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(38.dp)
                                        .shadow(8.dp, CircleShape, spotColor = Color(0xFF00E676))
                                        .background(
                                            Brush.linearGradient(
                                                colors = if (isSelected) {
                                                    listOf(Color(0xFF00E676), Color(0xFF00B0FF))
                                                } else {
                                                    listOf(Color(0xFF00E676), Color(0xFF1B5E20))
                                                }
                                            ),
                                            CircleShape
                                        )
                                        .border(1.dp, Color.White.copy(alpha = 0.8f), CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = item.selectedIcon,
                                        contentDescription = stringResource(item.titleRes),
                                        tint = Color.White,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = stringResource(item.titleRes),
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Black,
                                    color = if (isSelected) Color(0xFF00E676) else Color.White
                                )
                            }
                        } else {
                            // STANDARD NAVIGATION ITEM
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Center,
                                modifier = Modifier
                                    .scale(scale)
                                    .then(
                                        if (isSelected) {
                                            Modifier
                                                .clip(RoundedCornerShape(14.dp))
                                                .background(Color(0xFF00E676).copy(alpha = 0.18f))
                                                .border(0.8.dp, Color(0xFF00E676).copy(alpha = 0.5f), RoundedCornerShape(14.dp))
                                                .padding(horizontal = 6.dp, vertical = 4.dp)
                                        } else {
                                            Modifier.padding(horizontal = 4.dp, vertical = 4.dp)
                                        }
                                    )
                            ) {
                                Icon(
                                    imageVector = if (isSelected) item.selectedIcon else item.unselectedIcon,
                                    contentDescription = stringResource(item.titleRes),
                                    tint = if (isSelected) Color(0xFF00E676) else Color.White.copy(alpha = 0.80f),
                                    modifier = Modifier.size(22.dp)
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = stringResource(item.titleRes),
                                    fontSize = 10.sp,
                                    fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold,
                                    color = if (isSelected) Color(0xFF00E676) else Color.White.copy(alpha = 0.75f)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

sealed class BottomNavItem(
    val titleRes: Int, 
    val selectedIcon: ImageVector, 
    val unselectedIcon: ImageVector, 
    val route: String
) {
    object Home : BottomNavItem(R.string.nav_home, Icons.Default.Home, Icons.Outlined.Home, "home")
    object Scan : BottomNavItem(R.string.nav_scan, Icons.Default.CenterFocusStrong, Icons.Outlined.CenterFocusWeak, "scan")
    object Monitor : BottomNavItem(R.string.nav_monitor, Icons.Default.Analytics, Icons.Outlined.Analytics, "monitor")
    object Alerts : BottomNavItem(R.string.nav_alerts, Icons.Default.Notifications, Icons.Outlined.Notifications, "alerts")
    object Profile : BottomNavItem(R.string.nav_profile, Icons.Default.AccountCircle, Icons.Outlined.AccountCircle, "profile")
}

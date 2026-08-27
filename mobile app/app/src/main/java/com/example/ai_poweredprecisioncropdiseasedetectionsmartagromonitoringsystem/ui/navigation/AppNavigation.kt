package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.navigation

import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.screens.*
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.viewmodel.AgroViewModel
import kotlinx.coroutines.delay

@Composable
fun AppNavigation(modifier: Modifier = Modifier) {
    val navController = rememberNavController()
    val viewModel: AgroViewModel = hiltViewModel()
    val loggedInUser by viewModel.loggedInUser.collectAsState()
    val isOnboardingCompleted by viewModel.isOnboardingCompleted.collectAsState()

    // STRICT SESSION & ONBOARDING MONITORING
    LaunchedEffect(loggedInUser, isOnboardingCompleted) {
        val currentRoute = navController.currentBackStackEntry?.destination?.route
        
        // Don't interfere while on splash screen
        if (currentRoute == "splash" || currentRoute == null) return@LaunchedEffect

        if (!isOnboardingCompleted) {
            // FORCE ONBOARDING
            if (currentRoute != "onboarding") {
                navController.navigate("onboarding") {popUpTo(0) { inclusive = true }
                }
            }
        } else if (loggedInUser == null) {
            // MANDATORY LOGIN if authenticated session is missing
            if (currentRoute != "login" && currentRoute != "signup" && currentRoute != "forgot_password") {
                navController.navigate("login") {
                    popUpTo(0) { inclusive = true }
                    launchSingleTop = true
                }
            }
        }
    }

    NavHost(navController = navController, startDestination = "splash") {
        composable("splash") {
            SplashScreen(onTimeout = {
                // Determine destination: Always open Login screen first upon app launch
                if (!isOnboardingCompleted) {
                    navController.navigate("onboarding") {
                        popUpTo("splash") { inclusive = true }
                    }
                } else {
                    navController.navigate("login") {
                        popUpTo("splash") { inclusive = true }
                    }
                }
            })
        }
        
        composable("onboarding") {
            OnboardingScreen(
                viewModel = viewModel,
                onOnboardingFinished = {
                    navController.navigate("login") {
                        popUpTo("onboarding") { inclusive = true }
                    }
                }
            )
        }
        
        composable("login") {
            LoginScreen(
                viewModel = viewModel,
                onLoginSuccess = {
                    navController.navigate("main") {
                        popUpTo("login") { inclusive = true }
                    }
                },
                onNavigateToSignup = {
                    navController.navigate("signup")
                },
                onNavigateToForgotPassword = {
                    navController.navigate("forgot_password")
                }
            )
        }
        
        composable("signup") {
            SignupScreen(
                viewModel = viewModel,
                onSignupSuccess = {
                    navController.navigate("login") {
                        popUpTo("signup") { inclusive = true }
                    }
                },
                onNavigateToLogin = {
                    navController.navigate("login") {
                        popUpTo("signup") { inclusive = true }
                    }
                }
            )
        }

        composable("forgot_password") {
            ForgotPasswordScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable("main") {
            MainScreen(viewModel = viewModel, rootNavController = navController)
        }
    }
}

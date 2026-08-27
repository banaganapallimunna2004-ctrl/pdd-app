package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.R
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity.UserEntity
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.AgroColors
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.GlassCard
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.LuxuryBackground
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.viewmodel.AgroViewModel
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.util.isValidEmail

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SignupScreen(
    viewModel: AgroViewModel,
    onSignupSuccess: () -> Unit,
    onNavigateToLogin: () -> Unit
) {
    var fullName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var confirmPasswordVisible by remember { mutableStateOf(false) }
    
    var farmName by remember { mutableStateOf("") }
    var farmLocation by remember { mutableStateOf("") }
    var farmSizeText by remember { mutableStateOf("5.0") }
    var experienceYearsText by remember { mutableStateOf("3") }
    var primaryCrops by remember { mutableStateOf("Rice, Tomato, Cotton") }
    var soilType by remember { mutableStateOf("Black Soil") }
    var irrigationSystem by remember { mutableStateOf("Drip Irrigation") }
    
    var agreeToTerms by remember { mutableStateOf(true) }
    var attemptedSubmit by remember { mutableStateOf(false) }
    var validationErrorMessage by remember { mutableStateOf<String?>(null) }
    
    val authUiState by viewModel.authUiState.collectAsState()
    val authError by viewModel.authError.collectAsState()

    // Validation checks
    val isEmailValid = email.isValidEmail()
    val isPasswordValid = password.length >= 6
    val isPasswordMatching = password == confirmPassword && confirmPassword.isNotEmpty()
    val isNameValid = fullName.trim().length >= 2
    val isPhoneValid = phone.trim().length >= 7
    val isFarmNameValid = farmName.trim().isNotEmpty()
    val isFarmLocationValid = farmLocation.trim().isNotEmpty()

    // Vibrant Golden Harvest Agriculture Background
    LuxuryBackground(
        imageUrl = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1920&auto=format&fit=crop",
        alpha = 0.90f
    ) {
        Scaffold(
            containerColor = Color.Transparent,
            topBar = {
                CenterAlignedTopAppBar(
                    title = { 
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("AGRO AI PLATFORM", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Color(0xFF81C784), letterSpacing = 2.sp)
                            Text("Farmer Registration 🌾", fontWeight = FontWeight.Black, color = Color.White, fontSize = 18.sp)
                        }
                    },
                    navigationIcon = {
                        IconButton(onClick = onNavigateToLogin) {
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = Color.White)
                        }
                    },
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = Color.Transparent)
                )
            }
        ) { padding ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp, vertical = 8.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Join our smart agricultural monitoring network to optimize crop health & increase field yields.",
                    fontSize = 13.sp,
                    color = Color.White.copy(alpha = 0.85f),
                    textAlign = TextAlign.Center,
                    lineHeight = 18.sp
                )
                
                Spacer(modifier = Modifier.height(16.dp))

                GlassCard(
                    modifier = Modifier.fillMaxWidth(),
                    cornerRadius = 24.dp
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        // Section: Personal Credentials
                        Text(
                            text = "FARMER CREDENTIALS",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = AgroColors.AccentGreen,
                            letterSpacing = 1.sp
                        )

                        SignupTextField(
                            value = fullName,
                            onValueChange = { fullName = it; validationErrorMessage = null },
                            label = "Full Name",
                            placeholder = "e.g. Rajesh Kumar",
                            icon = Icons.Default.Person,
                            isError = attemptedSubmit && !isNameValid,
                            errorMessage = if (attemptedSubmit && !isNameValid) "Please enter your full name" else null
                        )

                        SignupTextField(
                            value = email,
                            onValueChange = { email = it; validationErrorMessage = null },
                            label = "Email Address",
                            placeholder = "e.g. farmer@agroai.com",
                            icon = Icons.Default.Email,
                            keyboardType = KeyboardType.Email,
                            isError = attemptedSubmit && !isEmailValid,
                            errorMessage = if (attemptedSubmit && !isEmailValid) "Please enter a valid email address" else null
                        )

                        SignupTextField(
                            value = phone,
                            onValueChange = { phone = it; validationErrorMessage = null },
                            label = "Phone Number",
                            placeholder = "e.g. +91 9876543210",
                            icon = Icons.Default.Phone,
                            keyboardType = KeyboardType.Phone,
                            isError = attemptedSubmit && !isPhoneValid,
                            errorMessage = if (attemptedSubmit && !isPhoneValid) "Please enter a valid phone number" else null
                        )

                        SignupTextField(
                            value = password,
                            onValueChange = { password = it; validationErrorMessage = null },
                            label = "Password",
                            placeholder = "Min 6 characters",
                            icon = Icons.Default.Lock,
                            isPassword = true,
                            isPasswordVisible = passwordVisible,
                            onTogglePasswordVisibility = { passwordVisible = !passwordVisible },
                            isError = attemptedSubmit && !isPasswordValid,
                            errorMessage = if (attemptedSubmit && !isPasswordValid) "Password must be at least 6 characters" else null
                        )

                        SignupTextField(
                            value = confirmPassword,
                            onValueChange = { confirmPassword = it; validationErrorMessage = null },
                            label = "Confirm Password",
                            placeholder = "Re-enter your password",
                            icon = Icons.Default.LockReset,
                            isPassword = true,
                            isPasswordVisible = confirmPasswordVisible,
                            onTogglePasswordVisibility = { confirmPasswordVisible = !confirmPasswordVisible },
                            isError = attemptedSubmit && !isPasswordMatching,
                            errorMessage = if (attemptedSubmit && !isPasswordMatching) "Passwords do not match" else null
                        )
                        
                        HorizontalDivider(color = Color.White.copy(alpha = 0.2f), thickness = 1.dp, modifier = Modifier.padding(vertical = 4.dp))
                        
                        // Section: Farm & Agro Details
                        Text(
                            text = "FARM & CROP DETAILS",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = AgroColors.AccentGreen,
                            letterSpacing = 1.sp
                        )

                        SignupTextField(
                            value = farmName,
                            onValueChange = { farmName = it; validationErrorMessage = null },
                            label = "Farm / Agro Hub Name",
                            placeholder = "e.g. Green Valley Farm",
                            icon = Icons.Default.Agriculture,
                            isError = attemptedSubmit && !isFarmNameValid,
                            errorMessage = if (attemptedSubmit && !isFarmNameValid) "Please enter your farm name" else null
                        )

                        SignupTextField(
                            value = farmLocation,
                            onValueChange = { farmLocation = it; validationErrorMessage = null },
                            label = "Farm Location / District",
                            placeholder = "e.g. Mandya, Karnataka",
                            icon = Icons.Default.LocationOn,
                            isError = attemptedSubmit && !isFarmLocationValid,
                            errorMessage = if (attemptedSubmit && !isFarmLocationValid) "Please enter your farm location" else null
                        )

                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            Box(modifier = Modifier.weight(1f)) {
                                SignupTextField(
                                    value = farmSizeText,
                                    onValueChange = { farmSizeText = it },
                                    label = "Area (Acres)",
                                    placeholder = "5.0",
                                    icon = Icons.Default.Landscape,
                                    keyboardType = KeyboardType.Decimal
                                )
                            }
                            Box(modifier = Modifier.weight(1f)) {
                                SignupTextField(
                                    value = experienceYearsText,
                                    onValueChange = { experienceYearsText = it },
                                    label = "Exp (Years)",
                                    placeholder = "3",
                                    icon = Icons.Default.HistoryEdu,
                                    keyboardType = KeyboardType.Number
                                )
                            }
                        }

                        SignupTextField(
                            value = primaryCrops,
                            onValueChange = { primaryCrops = it },
                            label = "Primary Crops",
                            placeholder = "e.g. Rice, Tomato, Cotton",
                            icon = Icons.Default.Grass
                        )

                        // Terms and Conditions Checkbox
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { agreeToTerms = !agreeToTerms }
                        ) {
                            Checkbox(
                                checked = agreeToTerms, 
                                onCheckedChange = { agreeToTerms = it },
                                colors = CheckboxDefaults.colors(
                                    checkedColor = Color(0xFF2E7D32),
                                    uncheckedColor = Color.White.copy(alpha = 0.6f),
                                    checkmarkColor = Color.White
                                )
                            )
                            Text(
                                text = stringResource(R.string.join_community),
                                color = Color.White.copy(alpha = 0.9f),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }

                        // Validation Error Alert
                        if (validationErrorMessage != null) {
                            Surface(
                                color = Color(0xFFEF5350).copy(alpha = 0.15f),
                                shape = RoundedCornerShape(10.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEF5350).copy(alpha = 0.4f))
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth().padding(10.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Icon(Icons.Default.ErrorOutline, contentDescription = null, tint = Color(0xFFFFCDD2), modifier = Modifier.size(16.dp))
                                    Text(
                                        text = validationErrorMessage!!,
                                        color = Color(0xFFFFCDD2),
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                }
                            }
                        }

                        // Backend / Auth Error Alert
                        if (authError != null) {
                            Surface(
                                color = Color(0xFFEF5350).copy(alpha = 0.15f),
                                shape = RoundedCornerShape(10.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEF5350).copy(alpha = 0.4f))
                            ) {
                                Text(
                                    text = authError!!,
                                    color = Color(0xFFFFCDD2),
                                    fontSize = 12.sp,
                                    textAlign = TextAlign.Center,
                                    modifier = Modifier.fillMaxWidth().padding(12.dp),
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }

                        // Success Message Alert
                        if (authUiState.successMessage != null) {
                            Surface(
                                color = Color(0xFF81C784).copy(alpha = 0.15f),
                                shape = RoundedCornerShape(10.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF81C784).copy(alpha = 0.4f))
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth().padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.Center
                                ) {
                                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Color(0xFFA5D6A7), modifier = Modifier.size(18.dp))
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = authUiState.successMessage!!,
                                        color = Color(0xFFA5D6A7),
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }

                        // Register Button
                        Button(
                            onClick = {
                                attemptedSubmit = true
                                when {
                                    !isNameValid -> {
                                        validationErrorMessage = "Please enter your Full Name."
                                    }
                                    !isEmailValid -> {
                                        validationErrorMessage = "Please enter a valid Email Address."
                                    }
                                    !isPhoneValid -> {
                                        validationErrorMessage = "Please enter a valid Phone Number."
                                    }
                                    !isPasswordValid -> {
                                        validationErrorMessage = "Password must be at least 6 characters."
                                    }
                                    !isPasswordMatching -> {
                                        validationErrorMessage = "Passwords do not match."
                                    }
                                    !isFarmNameValid -> {
                                        validationErrorMessage = "Please enter your Farm or Agro Hub Name."
                                    }
                                    !isFarmLocationValid -> {
                                        validationErrorMessage = "Please enter your Farm Location / District."
                                    }
                                    !agreeToTerms -> {
                                        validationErrorMessage = "Please accept the terms and conditions to proceed."
                                    }
                                    else -> {
                                        validationErrorMessage = null
                                        val user = UserEntity(
                                            email = email.trim(),
                                            passwordHash = password,
                                            fullName = fullName.trim(),
                                            phone = phone.trim(),
                                            farmName = farmName.trim(),
                                            farmLocation = farmLocation.trim(),
                                            farmSize = farmSizeText.toFloatOrNull() ?: 5.0f,
                                            experienceYears = experienceYearsText.toIntOrNull() ?: 0,
                                            primaryCrops = primaryCrops.ifBlank { "Rice, Tomato, Cotton" },
                                            soilType = soilType,
                                            irrigationSystem = irrigationSystem,
                                            isLoggedIn = true
                                        )
                                        viewModel.register(user, onSignupSuccess)
                                    }
                                }
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(54.dp),
                            enabled = !authUiState.isLoading,
                            shape = RoundedCornerShape(16.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color(0xFF2E7D32),
                                contentColor = Color.White
                            )
                        ) {
                            if (authUiState.isLoading) {
                                CircularProgressIndicator(modifier = Modifier.size(24.dp), color = Color.White, strokeWidth = 2.5.dp)
                            } else {
                                Text(
                                    stringResource(R.string.sign_up).uppercase(),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp,
                                    letterSpacing = 1.sp
                                )
                            }
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(20.dp))
                
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        stringResource(R.string.dont_have_account).replace("Don't", "Already"),
                        color = Color.White.copy(alpha = 0.85f),
                        fontSize = 14.sp
                    )
                    TextButton(onClick = onNavigateToLogin) {
                        Text(
                            stringResource(R.string.login),
                            color = Color(0xFF81C784),
                            fontWeight = FontWeight.Black,
                            fontSize = 14.sp
                        )
                    }
                }
                Spacer(modifier = Modifier.height(28.dp))
            }
        }
    }
}

@Composable
fun SignupTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    icon: ImageVector,
    placeholder: String? = null,
    keyboardType: KeyboardType = KeyboardType.Text,
    isPassword: Boolean = false,
    isPasswordVisible: Boolean = false,
    onTogglePasswordVisibility: (() -> Unit)? = null,
    isError: Boolean = false,
    errorMessage: String? = null
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            label = { Text(label, fontWeight = FontWeight.Bold, fontSize = 13.sp) },
            placeholder = placeholder?.let { { Text(it, color = Color.White.copy(alpha = 0.4f), fontSize = 13.sp) } },
            leadingIcon = { Icon(icon, contentDescription = null, tint = if (isError) Color(0xFFEF5350) else Color(0xFF81C784)) },
            trailingIcon = if (isPassword && onTogglePasswordVisibility != null) {
                {
                    IconButton(onClick = onTogglePasswordVisibility) {
                        Icon(
                            imageVector = if (isPasswordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                            contentDescription = if (isPasswordVisible) "Hide password" else "Show password",
                            tint = Color.White.copy(alpha = 0.7f)
                        )
                    }
                }
            } else null,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            singleLine = true,
            isError = isError,
            visualTransformation = if (isPassword && !isPasswordVisible) PasswordVisualTransformation() else VisualTransformation.None,
            keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = if (isError) Color(0xFFEF5350) else Color(0xFF81C784),
                unfocusedBorderColor = if (isError) Color(0xFFEF5350).copy(alpha = 0.8f) else Color.White.copy(alpha = 0.25f),
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White,
                focusedLabelColor = if (isError) Color(0xFFEF5350) else Color(0xFF81C784),
                unfocusedLabelColor = if (isError) Color(0xFFEF5350) else Color.White.copy(alpha = 0.7f),
                focusedContainerColor = Color.Black.copy(alpha = 0.25f),
                unfocusedContainerColor = Color.Black.copy(alpha = 0.20f)
            )
        )
        if (isError && errorMessage != null) {
            Text(
                text = errorMessage,
                color = Color(0xFFFFCDD2),
                fontSize = 11.sp,
                modifier = Modifier.padding(start = 12.dp, top = 4.dp),
                fontWeight = FontWeight.Medium
            )
        }
    }
}

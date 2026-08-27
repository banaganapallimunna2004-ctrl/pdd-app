package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.screens

import android.Manifest
import android.os.Build
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.fragment.app.FragmentActivity
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.components.GlassCard
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.viewmodel.AgroViewModel
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.util.BiometricHelper
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.util.isValidEmail
import kotlinx.coroutines.delay

enum class LoginTab {
    PASSWORD, SMS_OTP
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    viewModel: AgroViewModel,
    onLoginSuccess: () -> Unit,
    onNavigateToSignup: () -> Unit,
    onNavigateToForgotPassword: () -> Unit
) {
    var activeTab by remember { mutableStateOf(LoginTab.PASSWORD) }
    
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var phoneNumber by remember { mutableStateOf("") }
    var otpCode by remember { mutableStateOf("") }
    
    val uiState by viewModel.authUiState.collectAsState()
    val context = LocalContext.current
    
    // Permission launcher for Android 13+ Notifications
    val notificationPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (!isGranted) {
            Toast.makeText(context, "Notification permission is required to receive OTP codes", Toast.LENGTH_LONG).show()
        }
    }

    LaunchedEffect(Unit) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
        }
    }

    val isBiometricAvailable = remember { BiometricHelper.isBiometricAvailable(context) }
    
    var offsetValue by remember { mutableStateOf(0f) }
    val animatedOffset by animateFloatAsState(
        targetValue = offsetValue,
        animationSpec = spring(dampingRatio = Spring.DampingRatioHighBouncy, stiffness = Spring.StiffnessMedium),
        label = "shake"
    )

    LaunchedEffect(uiState.errorMessage) {
        if (uiState.errorMessage != null) {
            repeat(3) {
                offsetValue = 8f; delay(50)
                offsetValue = -8f; delay(50)
            }
            offsetValue = 0f
        }
    }

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF041006))) {
        // High-Quality 4K Smart Agriculture Background Image (Matching Web App)
        AsyncImage(
            model = ImageRequest.Builder(LocalContext.current)
                .data(com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.R.drawable.smart_agro_bg)
                .crossfade(true)
                .build(),
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop,
            alpha = 0.95f
        )

        // Warm Organic Agriculture Scrim Overlay with crisp center visibility
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color.Black.copy(alpha = 0.55f),
                            Color(0xFF0D2512).copy(alpha = 0.35f),
                            Color.Black.copy(alpha = 0.75f)
                        )
                    )
                )
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .systemBarsPadding()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 24.dp)
                .offset(x = animatedOffset.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(16.dp))
            
            // Brand Logo & Header matching Web Application
            Box(
                modifier = Modifier
                    .size(68.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(
                        Brush.linearGradient(
                            colors = listOf(Color(0xFF2E7D32), Color(0xFF4CAF50))
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Spa,
                    contentDescription = "AgroAI Logo",
                    tint = Color.White,
                    modifier = Modifier.size(36.dp)
                )
            }
            
            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "AgroAI",
                fontSize = 36.sp,
                fontWeight = FontWeight.Black,
                color = Color.White,
                letterSpacing = 2.sp
            )
            
            Text(
                text = "SMART AGRICULTURE MONITORING SYSTEM",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFA5D6A7),
                letterSpacing = 2.sp,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Glassmorphic Login Card
            GlassCard(
                modifier = Modifier.fillMaxWidth(),
                cornerRadius = 28.dp
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "Welcome Back 🌾",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White,
                        letterSpacing = 0.5.sp
                    )
                    
                    Spacer(modifier = Modifier.height(20.dp))

                    // Mode Selection Tabs (Password | SMS OTP)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color.Black.copy(alpha = 0.35f))
                            .padding(4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        TabButton(
                            label = "Password",
                            icon = Icons.Default.Lock,
                            isSelected = activeTab == LoginTab.PASSWORD,
                            onClick = {
                                activeTab = LoginTab.PASSWORD
                                viewModel.resetOtpState()
                            },
                            modifier = Modifier.weight(1f)
                        )
                        TabButton(
                            label = "SMS OTP",
                            icon = Icons.Default.Phone,
                            isSelected = activeTab == LoginTab.SMS_OTP,
                            onClick = {
                                activeTab = LoginTab.SMS_OTP
                                viewModel.resetOtpState()
                            },
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    // Tab Content Forms
                    when (activeTab) {
                        LoginTab.PASSWORD -> {
                            EmailPasswordForm(
                                email = email,
                                onEmailChange = { email = it },
                                password = password,
                                onPasswordChange = { password = it },
                                passwordVisible = passwordVisible,
                                onPasswordVisibilityChange = { passwordVisible = it },
                                onLoginClick = { viewModel.login(email, password, onLoginSuccess) },
                                onForgotPasswordClick = onNavigateToForgotPassword,
                                isLoading = uiState.isLoading,
                                errorMessage = uiState.errorMessage
                            )
                        }
                        LoginTab.SMS_OTP -> {
                            SmsOtpForm(
                                phoneNumber = phoneNumber,
                                onPhoneChange = { phoneNumber = it },
                                otpCode = otpCode,
                                onOtpChange = { otpCode = it },
                                isOtpSent = uiState.isOtpSent,
                                onSendOtp = { viewModel.sendOtp(phoneNumber) },
                                onVerifyOtp = { viewModel.verifyOtp(otpCode, onLoginSuccess) },
                                onResendOtp = { viewModel.sendOtp(phoneNumber) },
                                isLoading = uiState.isLoading,
                                errorMessage = uiState.errorMessage
                            )
                        }
                    }

                    // Success Message Banner
                    if (uiState.successMessage != null) {
                        Surface(
                            color = Color(0xFF4CAF50).copy(alpha = 0.15f),
                            shape = RoundedCornerShape(12.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF81C784).copy(alpha = 0.4f)),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 16.dp)
                        ) {
                            Text(
                                text = uiState.successMessage!!,
                                color = Color(0xFFA5D6A7),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(12.dp),
                                textAlign = TextAlign.Center
                            )
                        }
                    }

                    if (isBiometricAvailable) {
                        Spacer(modifier = Modifier.height(20.dp))

                        // Divider ("OR")
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            HorizontalDivider(
                                modifier = Modifier.weight(1f),
                                color = Color.White.copy(alpha = 0.2f)
                            )
                            Text(
                                text = "  OR  ",
                                color = Color.White.copy(alpha = 0.5f),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp
                            )
                            HorizontalDivider(
                                modifier = Modifier.weight(1f),
                                color = Color.White.copy(alpha = 0.2f)
                            )
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Native Biometric Authentication Button
                        OutlinedButton(
                            onClick = {
                                BiometricHelper.showBiometricPrompt(
                                    activity = context as FragmentActivity,
                                    onSuccess = { viewModel.loginWithBiometrics(onLoginSuccess) },
                                    onError = { }
                                )
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(52.dp),
                            shape = RoundedCornerShape(14.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF81C784).copy(alpha = 0.5f)),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Fingerprint,
                                contentDescription = null,
                                tint = Color(0xFF81C784),
                                modifier = Modifier.size(22.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = "Biometric Sign In",
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                        }
                    }

                    // 1-Click AI Demo Quick Sign In (Matching Web App)
                    Spacer(modifier = Modifier.height(16.dp))
                    HorizontalDivider(color = Color.White.copy(alpha = 0.15f))
                    Spacer(modifier = Modifier.height(12.dp))
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "🤖 1-CLICK AI DEMO SIGN IN",
                            color = Color(0xFF81C784),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 1.sp
                        )
                        Text(
                            text = "Instant Access",
                            color = Color.White.copy(alpha = 0.5f),
                            fontSize = 9.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedButton(
                            onClick = {
                                email = "farmer@agroai.com"
                                password = "Farmer@123456"
                                activeTab = LoginTab.PASSWORD
                                viewModel.login("farmer@agroai.com", "Farmer@123456", onLoginSuccess)
                            },
                            modifier = Modifier.weight(1f).height(44.dp),
                            shape = RoundedCornerShape(12.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF81C784).copy(alpha = 0.4f)),
                            colors = ButtonDefaults.outlinedButtonColors(
                                containerColor = Color.White.copy(alpha = 0.08f),
                                contentColor = Color.White
                            )
                        ) {
                            Text("🌱 Smart Farmer", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }

                        OutlinedButton(
                            onClick = {
                                email = "admin@agroai.com"
                                password = "Admin@123456"
                                activeTab = LoginTab.PASSWORD
                                viewModel.login("admin@agroai.com", "Admin@123456", onLoginSuccess)
                            },
                            modifier = Modifier.weight(1f).height(44.dp),
                            shape = RoundedCornerShape(12.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF81C784).copy(alpha = 0.4f)),
                            colors = ButtonDefaults.outlinedButtonColors(
                                containerColor = Color.White.copy(alpha = 0.08f),
                                contentColor = Color.White
                            )
                        ) {
                            Text("🛡️ Farm Admin", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Footer Link: Register
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "Don't have an account? ",
                    color = Color.White.copy(alpha = 0.8f),
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "Sign Up",
                    color = Color(0xFF81C784),
                    fontWeight = FontWeight.Black,
                    fontSize = 14.sp,
                    modifier = Modifier.clickable { onNavigateToSignup() }
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
fun TabButton(
    label: String,
    icon: ImageVector,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        onClick = onClick,
        modifier = modifier
            .padding(horizontal = 2.dp)
            .height(40.dp),
        shape = RoundedCornerShape(12.dp),
        color = if (isSelected) Color(0xFF2E7D32) else Color.Transparent
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
            modifier = Modifier.padding(horizontal = 4.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = if (isSelected) Color.White else Color.White.copy(alpha = 0.6f),
                modifier = Modifier.size(15.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = label,
                color = if (isSelected) Color.White else Color.White.copy(alpha = 0.7f),
                fontSize = 11.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
            )
        }
    }
}

@Composable
fun EmailPasswordForm(
    email: String,
    onEmailChange: (String) -> Unit,
    password: String,
    onPasswordChange: (String) -> Unit,
    passwordVisible: Boolean,
    onPasswordVisibilityChange: (Boolean) -> Unit,
    onLoginClick: () -> Unit,
    onForgotPasswordClick: () -> Unit,
    isLoading: Boolean,
    errorMessage: String?
) {
    Column {
        AgroInputField(
            value = email,
            onValueChange = onEmailChange,
            label = "Email Address",
            placeholder = "farmer@agroai.com",
            icon = Icons.Default.Email,
            keyboardType = KeyboardType.Email
        )

        Spacer(modifier = Modifier.height(16.dp))

        AgroInputField(
            value = password,
            onValueChange = onPasswordChange,
            label = "Password",
            placeholder = "••••••••",
            icon = Icons.Default.Lock,
            isPassword = true,
            passwordVisible = passwordVisible,
            onPasswordVisibilityChange = onPasswordVisibilityChange
        )

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 4.dp),
            contentAlignment = Alignment.CenterEnd
        ) {
            TextButton(
                onClick = onForgotPasswordClick,
                contentPadding = PaddingValues(0.dp)
            ) {
                Text(
                    text = "Forgot Password?",
                    color = Color(0xFF81C784),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        if (errorMessage != null) {
            Surface(
                color = Color(0xFFEF5350).copy(alpha = 0.15f),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEF5350).copy(alpha = 0.4f)),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp)
            ) {
                Text(
                    text = errorMessage,
                    color = Color(0xFFFFCDD2),
                    fontSize = 12.sp,
                    modifier = Modifier.padding(12.dp),
                    textAlign = TextAlign.Center,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        Button(
            onClick = onLoginClick,
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFF2E7D32),
                contentColor = Color.White
            ),
            enabled = email.isValidEmail() && password.length >= 6 && !isLoading
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(24.dp),
                    color = Color.White,
                    strokeWidth = 2.5.dp
                )
            } else {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.VerifiedUser, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Sign In",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                }
            }
        }
    }
}



@Composable
fun SmsOtpForm(
    phoneNumber: String,
    onPhoneChange: (String) -> Unit,
    otpCode: String,
    onOtpChange: (String) -> Unit,
    isOtpSent: Boolean,
    onSendOtp: () -> Unit,
    onVerifyOtp: () -> Unit,
    onResendOtp: () -> Unit,
    isLoading: Boolean,
    errorMessage: String?
) {
    Column {
        AgroInputField(
            value = phoneNumber,
            onValueChange = onPhoneChange,
            label = "Phone Number",
            placeholder = "+91 98765 43210",
            icon = Icons.Default.Phone,
            keyboardType = KeyboardType.Phone,
            enabled = !isOtpSent
        )

        if (isOtpSent) {
            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Enter 6-digit SMS code sent to your phone",
                fontSize = 12.sp,
                color = Color.White.copy(alpha = 0.8f),
                fontWeight = FontWeight.Medium,
                modifier = Modifier.padding(bottom = 8.dp)
            )

            AgroInputField(
                value = otpCode,
                onValueChange = { if (it.length <= 6) onOtpChange(it) },
                label = "Verification Code",
                placeholder = "123456",
                icon = Icons.Default.Key,
                keyboardType = KeyboardType.Number
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp, bottom = 4.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Code expires in 10:00",
                    color = Color.White.copy(alpha = 0.6f),
                    fontSize = 11.sp
                )
                TextButton(
                    onClick = onResendOtp,
                    contentPadding = PaddingValues(0.dp)
                ) {
                    Text(
                        text = "Resend SMS Code",
                        color = Color(0xFF81C784),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (errorMessage != null) {
            Surface(
                color = Color(0xFFEF5350).copy(alpha = 0.15f),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEF5350).copy(alpha = 0.4f)),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp)
            ) {
                Text(
                    text = errorMessage,
                    color = Color(0xFFFFCDD2),
                    fontSize = 12.sp,
                    modifier = Modifier.padding(12.dp),
                    textAlign = TextAlign.Center,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        Button(
            onClick = if (isOtpSent) onVerifyOtp else onSendOtp,
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFF2E7D32),
                contentColor = Color.White
            ),
            enabled = if (isOtpSent) otpCode.length >= 6 && !isLoading else phoneNumber.isNotBlank() && !isLoading
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(24.dp),
                    color = Color.White,
                    strokeWidth = 2.5.dp
                )
            } else {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = if (isOtpSent) Icons.Default.Key else Icons.Default.Sms,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isOtpSent) "Verify & Sign In" else "Send SMS Code",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                }
            }
        }
    }
}

@Composable
fun AgroInputField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    placeholder: String = "",
    icon: ImageVector,
    keyboardType: KeyboardType = KeyboardType.Text,
    isPassword: Boolean = false,
    passwordVisible: Boolean = false,
    onPasswordVisibilityChange: (Boolean) -> Unit = {},
    enabled: Boolean = true
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label, fontWeight = FontWeight.Bold, fontSize = 13.sp) },
        placeholder = { Text(placeholder, color = Color.White.copy(alpha = 0.4f), fontSize = 14.sp) },
        leadingIcon = { Icon(icon, contentDescription = null, tint = Color(0xFF81C784)) },
        trailingIcon = if (isPassword) {
            {
                IconButton(onClick = { onPasswordVisibilityChange(!passwordVisible) }) {
                    Icon(
                        imageVector = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                        contentDescription = null,
                        tint = Color.White.copy(alpha = 0.6f)
                    )
                }
            }
        } else null,
        visualTransformation = if (isPassword && !passwordVisible) PasswordVisualTransformation() else VisualTransformation.None,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        singleLine = true,
        enabled = enabled,
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = Color(0xFF81C784),
            unfocusedBorderColor = Color.White.copy(alpha = 0.25f),
            focusedTextColor = Color.White,
            unfocusedTextColor = Color.White,
            focusedLabelColor = Color(0xFF81C784),
            unfocusedLabelColor = Color.White.copy(alpha = 0.7f),
            focusedContainerColor = Color.Black.copy(alpha = 0.20f),
            unfocusedContainerColor = Color.Black.copy(alpha = 0.20f)
        )
    )
}

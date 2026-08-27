package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.ui.viewmodel

import androidx.appcompat.app.AppCompatDelegate
import androidx.core.os.LocaleListCompat
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.CropDisease
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.SensorData
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.ChatMessage
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.R
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.WeatherInfo
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.repository.AgroRepository
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity.UserEntity
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity.AlertEntity
import com.google.android.gms.maps.model.LatLng
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import android.content.Context
import android.util.Log
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.util.NotificationHelper
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AgroAuthUiState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val successMessage: String? = null,
    val isOtpSent: Boolean = false,
    val authMode: AuthMode = AuthMode.EMAIL,
    val phoneNumber: String = "",
    val verificationId: String? = null
)

enum class AuthMode {
    EMAIL, OTP
}

data class ChatbotUiState(
    val messages: List<ChatMessage> = emptyList(),
    val isLoading: Boolean = false
)

@HiltViewModel
class AgroViewModel @Inject constructor(
    private val repository: AgroRepository,
    @ApplicationContext private val context: Context
) : ViewModel() {

    private val _sensorData = MutableStateFlow<SensorData?>(null)
    val sensorData: StateFlow<SensorData?> = _sensorData.asStateFlow()

    val historicalData: StateFlow<List<com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity.SensorDataEntity>> = repository.getHistoricalSensorData()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _detectionResult = MutableStateFlow<CropDisease?>(null)
    val detectionResult: StateFlow<CropDisease?> = _detectionResult.asStateFlow()

    private val _isDetecting = MutableStateFlow(false)
    val isDetecting: StateFlow<Boolean> = _isDetecting.asStateFlow()

    private val _isValidating = MutableStateFlow(false)
    val isValidating: StateFlow<Boolean> = _isValidating.asStateFlow()

    private val _isImageRejected = MutableStateFlow(false)
    val isImageRejected: StateFlow<Boolean> = _isImageRejected.asStateFlow()

    private val _rejectionReason = MutableStateFlow<String?>(null)
    val rejectionReason: StateFlow<String?> = _rejectionReason.asStateFlow()

    private val _selectedCropType = MutableStateFlow<String?>(null)
    val selectedCropType: StateFlow<String?> = _selectedCropType.asStateFlow()

    private val _selectedLanguage = MutableStateFlow("en")
    val selectedLanguage: StateFlow<String> = _selectedLanguage.asStateFlow()

    private val _isDarkMode = MutableStateFlow(false)
    val isDarkMode: StateFlow<Boolean> = _isDarkMode.asStateFlow()

    private val _notificationsEnabled = MutableStateFlow(true)
    val notificationsEnabled: StateFlow<Boolean> = _notificationsEnabled.asStateFlow()

    private val _twoFactorEnabled = MutableStateFlow(false)
    val twoFactorEnabled: StateFlow<Boolean> = _twoFactorEnabled.asStateFlow()

    private val _biometricLoginEnabled = MutableStateFlow(false)
    val biometricLoginEnabled: StateFlow<Boolean> = _biometricLoginEnabled.asStateFlow()

    private val _isOnboardingCompleted = MutableStateFlow(false)
    val isOnboardingCompleted: StateFlow<Boolean> = _isOnboardingCompleted.asStateFlow()

    private val _aiSensitivity = MutableStateFlow(0.5f)
    val aiSensitivity: StateFlow<Float> = _aiSensitivity.asStateFlow()

    private val _syncProgress = MutableStateFlow<Int?>(null)
    val syncProgress: StateFlow<Int?> = _syncProgress.asStateFlow()

    private val _isSyncing = MutableStateFlow(false)
    val isSyncing: StateFlow<Boolean> = _isSyncing.asStateFlow()

    private val _isExporting = MutableStateFlow(false)
    val isExporting: StateFlow<Boolean> = _isExporting.asStateFlow()

    private val _isCalibrating = MutableStateFlow(false)
    val isCalibrating: StateFlow<Boolean> = _isCalibrating.asStateFlow()

    private val _uiMessage = MutableStateFlow<String?>(null)
    val uiMessage: StateFlow<String?> = _uiMessage.asStateFlow()

    private val _loggedInUser = MutableStateFlow<UserEntity?>(null)
    val loggedInUser: StateFlow<UserEntity?> = _loggedInUser.asStateFlow()

    private val _aiRecommendations = MutableStateFlow<List<String>>(emptyList())
    val aiRecommendations: StateFlow<List<String>> = _aiRecommendations.asStateFlow()

    private val _allDiseases = MutableStateFlow<List<CropDisease>>(emptyList())
    val allDiseases: StateFlow<List<CropDisease>> = _allDiseases.asStateFlow()

    private val _authError = MutableStateFlow<String?>(null)
    val authError: StateFlow<String?> = _authError.asStateFlow()

    private val _authUiState = MutableStateFlow(AgroAuthUiState())
    val authUiState: StateFlow<AgroAuthUiState> = _authUiState.asStateFlow()

    private val _currentLocation = MutableStateFlow<LatLng?>(null)
    val currentLocation: StateFlow<LatLng?> = _currentLocation.asStateFlow()

    private val _weatherInfo = MutableStateFlow<WeatherInfo?>(null)
    val weatherInfo: StateFlow<WeatherInfo?> = _weatherInfo.asStateFlow()

    private val _isWeatherLoading = MutableStateFlow(false)
    val isWeatherLoading: StateFlow<Boolean> = _isWeatherLoading.asStateFlow()

    private val _uiState = MutableStateFlow(ChatbotUiState())
    val uiState: StateFlow<ChatbotUiState> = _uiState.asStateFlow()

    val alerts: StateFlow<List<AlertEntity>> = repository.getAllAlerts()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _suppliers = MutableStateFlow<List<com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.AgroSupplier>>(emptyList())
    val suppliers: StateFlow<List<com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.AgroSupplier>> = _suppliers.asStateFlow()

    private val _selectedSupplier = MutableStateFlow<com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.AgroSupplier?>(null)
    val selectedSupplier: StateFlow<com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.AgroSupplier?> = _selectedSupplier.asStateFlow()

    private val _mapFilterCategory = MutableStateFlow("all")
    val mapFilterCategory: StateFlow<String> = _mapFilterCategory.asStateFlow()

    private val _mapSearchQuery = MutableStateFlow("")
    val mapSearchQuery: StateFlow<String> = _mapSearchQuery.asStateFlow()

    init {
        observeSensorData()
        observeLanguage()
        observeUser()
        observeSettings()
        fetchAiRecommendations()
        fetchAllDiseases()
        fetchInitialWeather()
    }

    private fun fetchInitialWeather() {
        viewModelScope.launch {
            _isWeatherLoading.value = true
            try {
                val target = _currentLocation.value ?: LatLng(11.0168, 76.9558)
                val resolvedName = resolveLocationName(target.latitude, target.longitude)
                val data = repository.getWeatherData(target.latitude, target.longitude)
                _weatherInfo.value = data.copy(locationName = resolvedName)
            } catch (e: Exception) {
                Log.w("AgroViewModel", "Initial weather fetch error: ${e.message}")
            } finally {
                _isWeatherLoading.value = false
            }
        }
    }

    private fun fetchAllDiseases() {
        viewModelScope.launch {
            repository.getAllCropDiseases().collect {
                _allDiseases.value = it
            }
        }
    }

    private fun observeUser() {
        viewModelScope.launch {
            repository.getLoggedInUser().collect { user ->
                Log.d("AgroViewModel", "User session update: ${user?.email}")
                _loggedInUser.value = user
            }
        }
    }

    private fun fetchAiRecommendations() {
        viewModelScope.launch {
            _aiRecommendations.value = repository.getAiRecommendations()
        }
    }

    fun login(email: String, password: String, onSuccess: () -> Unit) {
        viewModelScope.launch {
            _authUiState.value = _authUiState.value.copy(
                isLoading = true, 
                errorMessage = null,
                successMessage = null
            )
            try {
                if (repository.login(email.trim(), password)) {
                    _authUiState.value = _authUiState.value.copy(isLoading = false)
                    onSuccess()
                } else {
                    _authUiState.value = _authUiState.value.copy(
                        isLoading = false,
                        errorMessage = "Invalid email or password. Please check your credentials or create an account."
                    )
                }
            } catch (e: Exception) {
                _authUiState.value = _authUiState.value.copy(
                    isLoading = false,
                    errorMessage = "Invalid email or password. (${e.localizedMessage ?: "Check connection"})"
                )
            }
        }
    }

    fun loginWithBiometrics(onSuccess: () -> Unit) {
        viewModelScope.launch {
            _authUiState.value = _authUiState.value.copy(isLoading = true, errorMessage = null)
            if (repository.loginWithBiometrics()) {
                _authUiState.value = _authUiState.value.copy(isLoading = false)
                onSuccess()
            } else {
                _authUiState.value = _authUiState.value.copy(
                    isLoading = false,
                    errorMessage = "Biometric Login failed. No account found."
                )
            }
        }
    }


    fun register(user: UserEntity, onSuccess: () -> Unit) {
        viewModelScope.launch {
            _authError.value = null
            _authUiState.value = _authUiState.value.copy(isLoading = true, errorMessage = null, successMessage = null)
            
            try {
                if (repository.register(user)) {
                    _authUiState.value = _authUiState.value.copy(
                        isLoading = false,
                        successMessage = "Account created successfully! Please log in with your email and password."
                    )
                    onSuccess()
                } else {
                    _authUiState.value = _authUiState.value.copy(isLoading = false)
                    _authError.value = "Registration could not be completed. Please verify your details."
                }
            } catch (e: Exception) {
                _authUiState.value = _authUiState.value.copy(isLoading = false)
                _authError.value = "Registration error: ${e.localizedMessage ?: "Please try again."}"
            }
        }
    }

    fun forgotPassword(email: String) {
        viewModelScope.launch {
            _authUiState.value = _authUiState.value.copy(
                isLoading = true, 
                errorMessage = null,
                successMessage = null
            )
            if (repository.forgotPassword(email)) {
                _authUiState.value = _authUiState.value.copy(
                    isLoading = false,
                    successMessage = "Password reset link sent to your email"
                )
            } else {
                _authUiState.value = _authUiState.value.copy(
                    isLoading = false,
                    errorMessage = "Email not found"
                )
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            repository.logout()
        }
    }

    fun setAuthMode(mode: AuthMode) {
        _authUiState.value = _authUiState.value.copy(authMode = mode, errorMessage = null, successMessage = null)
    }

    fun updatePhoneNumber(phone: String) {
        _authUiState.value = _authUiState.value.copy(phoneNumber = phone)
    }

    fun resetOtpState() {
        _authUiState.value = _authUiState.value.copy(
            isOtpSent = false,
            verificationId = null,
            successMessage = null,
            errorMessage = null
        )
    }

    fun sendFirebaseOtp(phone: String, activity: android.app.Activity) {
        viewModelScope.launch {
            _authUiState.value = _authUiState.value.copy(
                isLoading = true, 
                errorMessage = null,
                phoneNumber = phone
            )
            
            try {
                repository.sendPhoneOtp(phone, activity)
                _authUiState.value = _authUiState.value.copy(
                    isLoading = false,
                    isOtpSent = true,
                    phoneNumber = phone,
                    successMessage = "OTP sent to $phone. Please check your notifications."
                )
            } catch (e: Exception) {
                _authUiState.value = _authUiState.value.copy(
                    isLoading = false,
                    errorMessage = "Verification Failed: ${e.localizedMessage}"
                )
            }
        }
    }

    fun verifyFirebaseOtp(code: String, onSuccess: () -> Unit) {
        viewModelScope.launch {
            val verificationId = _authUiState.value.verificationId
            
            // SMART FALLBACK: If no verificationId, we are in simulated mode
            if (verificationId == null) {
                verifyOtp(code, onSuccess)
                return@launch
            }

            _authUiState.value = _authUiState.value.copy(isLoading = true, errorMessage = null)
            val success = repository.verifyPhoneOtp(verificationId, code)
            
            if (success) {
                _authUiState.value = _authUiState.value.copy(isLoading = false)
                onSuccess()
            } else {
                _authUiState.value = _authUiState.value.copy(
                    isLoading = false,
                    errorMessage = "Invalid OTP code"
                )
            }
        }
    }

    fun sendOtp(phone: String) {
        viewModelScope.launch {
            _authUiState.value = _authUiState.value.copy(
                isLoading = true, 
                errorMessage = null,
                successMessage = null,
                phoneNumber = phone
            )
            
            val generatedOtp = (100000..999999).random().toString()
            repository.saveOtp(phone, generatedOtp)
            
            kotlinx.coroutines.delay(1500)
            
            // Professional Simulated Delivery
            NotificationHelper.showOtpNotification(context, generatedOtp)
            
            _authUiState.value = _authUiState.value.copy(
                isLoading = false, 
                isOtpSent = true,
                successMessage = "OTP sent to $phone. Please check your notifications."
            )
        }
    }

    fun verifyOtp(otpCode: String, onSuccess: () -> Unit) {
        viewModelScope.launch {
            _authUiState.value = _authUiState.value.copy(isLoading = true, errorMessage = null)
            
            val phone = _authUiState.value.phoneNumber
            val isValid = repository.verifyOtp(phone, otpCode)
            
            if (isValid) {
                _authUiState.value = _authUiState.value.copy(isLoading = false)
                // Execute onSuccess immediately to trigger navigation
                onSuccess()
            } else {
                _authUiState.value = _authUiState.value.copy(
                    isLoading = false, 
                    errorMessage = "Invalid or expired OTP. Please try again."
                )
            }
        }
    }

    fun updateLocation(latLng: LatLng) {
        _currentLocation.value = latLng
        viewModelScope.launch {
            val resolvedName = resolveLocationName(latLng.latitude, latLng.longitude)
            fetchWeather(latLng.latitude, latLng.longitude, resolvedName)
            fetchNearbySuppliers(latLng.latitude, latLng.longitude)
        }
    }

    private fun resolveLocationName(lat: Double, lng: Double): String {
        return try {
            val geocoder = android.location.Geocoder(context, java.util.Locale.getDefault())
            val addresses = geocoder.getFromLocation(lat, lng, 1)
            if (!addresses.isNullOrEmpty()) {
                val addr = addresses[0]
                val city = addr.locality ?: addr.subAdminArea ?: addr.adminArea ?: addr.featureName
                if (!city.isNullOrBlank()) {
                    "$city Farm"
                } else {
                    "Farm Field Area"
                }
            } else {
                "Farm Field Area"
            }
        } catch (e: Exception) {
            "Farm Field Area"
        }
    }

    fun fetchWeather(lat: Double, lng: Double, locationName: String? = null) {
        viewModelScope.launch {
            _isWeatherLoading.value = true
            try {
                val data = repository.getWeatherData(lat, lng)
                val finalName = locationName ?: resolveLocationName(lat, lng)
                _weatherInfo.value = data.copy(locationName = finalName)
            } catch (e: Exception) {
                Log.e("AgroViewModel", "Weather fetch error: ${e.message}")
            } finally {
                _isWeatherLoading.value = false
            }
        }
    }

    fun fetchNearbySuppliers(lat: Double? = null, lng: Double? = null) {
        val targetLat = lat ?: _currentLocation.value?.latitude ?: 11.0168
        val targetLng = lng ?: _currentLocation.value?.longitude ?: 76.9558
        viewModelScope.launch {
            try {
                val list = repository.getNearbySuppliers(
                    lat = targetLat,
                    lng = targetLng,
                    category = _mapFilterCategory.value,
                    query = _mapSearchQuery.value
                )
                _suppliers.value = list
            } catch (e: Exception) {
                Log.e("AgroViewModel", "Failed to fetch suppliers: ${e.message}")
            }
        }
    }

    fun selectMapCategory(category: String) {
        _mapFilterCategory.value = category
        fetchNearbySuppliers()
    }

    fun setMapSearchQuery(query: String) {
        _mapSearchQuery.value = query
        fetchNearbySuppliers()
    }

    fun selectSupplier(supplier: com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.AgroSupplier?) {
        _selectedSupplier.value = supplier
    }

    fun saveFarmLocation(latLng: LatLng, address: String = "Verified Farm Plot", farmName: String = "") {
        viewModelScope.launch {
            val success = repository.saveFarmLocation(latLng.latitude, latLng.longitude, farmName, address)
            if (success) {
                _uiMessage.value = "Farm coordinates synced with Cloud Hub! 🌾"
            }
        }
    }

    private fun observeLanguage() {
        viewModelScope.launch {
            repository.getSelectedLanguage().collect {
                _selectedLanguage.value = it
                val currentLocale = AppCompatDelegate.getApplicationLocales().toLanguageTags()
                if (it != currentLocale && it.isNotEmpty()) {
                    val appLocale: LocaleListCompat = LocaleListCompat.forLanguageTags(it)
                    AppCompatDelegate.setApplicationLocales(appLocale)
                }
            }
        }
    }

    fun setLanguage(languageCode: String) {
        viewModelScope.launch {
            repository.saveLanguage(languageCode)
            val appLocale: LocaleListCompat = LocaleListCompat.forLanguageTags(languageCode)
            AppCompatDelegate.setApplicationLocales(appLocale)
        }
    }

    private fun observeSettings() {
        viewModelScope.launch {
            repository.getDarkMode().collect {
                _isDarkMode.value = it
            }
        }
        viewModelScope.launch {
            repository.getNotificationsEnabled().collect {
                _notificationsEnabled.value = it
            }
        }
        viewModelScope.launch {
            repository.getAiSensitivity().collect {
                _aiSensitivity.value = it
            }
        }
        viewModelScope.launch {
            repository.getTwoFactorEnabled().collect {
                _twoFactorEnabled.value = it
            }
        }
        viewModelScope.launch {
            repository.getBiometricLoginEnabled().collect {
                _biometricLoginEnabled.value = it
            }
        }
        viewModelScope.launch {
            repository.isOnboardingCompleted().collect {
                _isOnboardingCompleted.value = it
            }
        }
    }

    fun setOnboardingCompleted(completed: Boolean) {
        viewModelScope.launch {
            repository.setOnboardingCompleted(completed)
        }
    }

    fun setDarkMode(enabled: Boolean) {
        viewModelScope.launch {
            repository.setDarkMode(enabled)
        }
    }

    fun setNotificationsEnabled(enabled: Boolean) {
        viewModelScope.launch {
            repository.setNotificationsEnabled(enabled)
        }
    }

    fun setAiSensitivity(value: Float) {
        viewModelScope.launch {
            repository.setAiSensitivity(value)
        }
    }

    fun setTwoFactorEnabled(enabled: Boolean) {
        viewModelScope.launch {
            repository.setTwoFactorEnabled(enabled)
        }
    }

    fun setBiometricLoginEnabled(enabled: Boolean) {
        viewModelScope.launch {
            repository.setBiometricLoginEnabled(enabled)
        }
    }

    fun changePassword(old: String, new: String) {
        viewModelScope.launch {
            val success = repository.changePassword(old, new)
            _uiMessage.value = if (success) "Password Changed Successfully" else "Incorrect Current Password"
        }
    }

    fun startCloudSync() {
        viewModelScope.launch {
            _isSyncing.value = true
            repository.syncCloudData().collect {
                _syncProgress.value = it
            }
            _isSyncing.value = false
            _syncProgress.value = null
            _uiMessage.value = "Cloud Data Sync Completed Successfully"
        }
    }

    fun exportFarmReport() {
        viewModelScope.launch {
            _isExporting.value = true
            val fileName = repository.exportReport()
            _isExporting.value = false
            _uiMessage.value = "Report exported: $fileName"
        }
    }

    fun calibrateSensors() {
        viewModelScope.launch {
            _isCalibrating.value = true
            val success = repository.calibrateIoT()
            _isCalibrating.value = false
            _uiMessage.value = if (success) "IoT Sensors Calibrated Successfully" else "Calibration Failed"
        }
    }

    fun clearUiMessage() {
        _uiMessage.value = null
    }

    fun shareApp(context: android.content.Context) {
        val shareText = context.getString(R.string.share_text)
        val sendIntent = android.content.Intent().apply {
            action = android.content.Intent.ACTION_SEND
            putExtra(android.content.Intent.EXTRA_TEXT, shareText)
            type = "text/plain"
        }
        val shareIntent = android.content.Intent.createChooser(sendIntent, null)
        context.startActivity(shareIntent)
    }

    fun shareDetectionResult(context: android.content.Context, disease: CropDisease) {
        val shareText = """
            AgroAI Analysis Report
            ----------------------
            Disease: ${disease.name}
            Scientific Name: ${disease.scientificName}
            Severity: ${disease.severity}
            
            Symptoms:
            ${disease.symptoms.joinToString("\n• ", prefix = "• ")}
            
            Treatment Plan:
            ${disease.treatmentSuggestions.joinToString("\n• ", prefix = "• ")}
            
            Analyzed by AgroAI Agent.
        """.trimIndent()

        val sendIntent = android.content.Intent().apply {
            action = android.content.Intent.ACTION_SEND
            putExtra(android.content.Intent.EXTRA_TEXT, shareText)
            type = "text/plain"
        }
        val shareIntent = android.content.Intent.createChooser(sendIntent, "Share Analysis Report")
        context.startActivity(shareIntent)
    }

    fun resendOtp(activity: android.app.Activity?) {
        val phone = _authUiState.value.phoneNumber
        if (phone.isEmpty()) return
        
        if (activity != null) {
            sendFirebaseOtp(phone, activity)
        } else {
            sendOtp(phone)
        }
    }

    fun updateProfile(
        fullName: String,
        phone: String,
        farmName: String,
        farmLocation: String,
        farmSize: Double,
        profileImageUri: String?,
        experienceYears: Int,
        primaryCrops: String,
        soilType: String,
        irrigationSystem: String,
        waterSource: String = "Borewell",
        farmingMethod: String = "Precision / Smart Farming",
        stateRegion: String? = null,
        farmBio: String? = null,
        annualYieldTarget: String? = null
    ) {
        viewModelScope.launch {
            repository.updateProfile(
                fullName,
                phone,
                farmName,
                farmLocation,
                farmSize,
                profileImageUri,
                experienceYears,
                primaryCrops,
                soilType,
                irrigationSystem,
                waterSource,
                farmingMethod,
                stateRegion,
                farmBio,
                annualYieldTarget
            )
            _uiMessage.value = "Farm profile details updated successfully! 🌾"
        }
    }

    fun updateProfileImage(uri: String) {
        viewModelScope.launch {
            repository.updateProfileImage(uri)
            _uiMessage.value = "Profile image updated! 📸"
        }
    }


    private fun observeSensorData() {
        viewModelScope.launch {
            repository.getSensorData().collect {
                _sensorData.value = it
            }
        }
    }

    fun scanCrop(imagePath: String) {
        viewModelScope.launch {
            try {
                _isValidating.value = false
                _isDetecting.value = true
                _isImageRejected.value = false
                _rejectionReason.value = null
                
                val targetCrop = if (_selectedCropType.value == "Auto-Detect" || _selectedCropType.value == "All Crops") null else _selectedCropType.value
                val result = repository.detectDisease(imagePath, targetCrop)
                
                if (result.id == "invalid" || 
                    result.name.contains("Invalid", true) || 
                    result.name.contains("Mismatch", true) || 
                    result.name.contains("Rejected", true) ||
                    result.name.contains("Not a Crop", true)) {
                    _isImageRejected.value = true
                    _rejectionReason.value = if (result.symptoms.isNotEmpty()) {
                        result.symptoms.joinToString("\n\n")
                    } else {
                        "The scanned image does not match the selected crop (${_selectedCropType.value ?: "Crop"}) or is not a recognizable leaf. Please recheck the image and scan a valid plant leaf."
                    }
                    _uiMessage.value = if (result.name.contains("Mismatch", true)) "Plant Species Mismatch" else "Image Validation Failed"
                    _detectionResult.value = null
                } else {
                    _isImageRejected.value = false
                    _rejectionReason.value = null
                    _detectionResult.value = result
                    // Dynamically set crop type from result if Auto-Detect was used
                    if (_selectedCropType.value == null || _selectedCropType.value == "Auto-Detect") {
                        val detectedName = result.name
                        when {
                            detectedName.contains("Potato", true) -> _selectedCropType.value = "Potato"
                            detectedName.contains("Tomato", true) -> _selectedCropType.value = "Tomato"
                            detectedName.contains("Rice", true) || detectedName.contains("Paddy", true) -> _selectedCropType.value = "Paddy"
                            detectedName.contains("Corn", true) || detectedName.contains("Maize", true) -> _selectedCropType.value = "Corn"
                            detectedName.contains("Wheat", true) -> _selectedCropType.value = "Wheat"
                            detectedName.contains("Cotton", true) -> _selectedCropType.value = "Cotton"
                            detectedName.contains("Chilli", true) -> _selectedCropType.value = "Chilli"
                            detectedName.contains("Apple", true) -> _selectedCropType.value = "Apple"
                            detectedName.contains("Grape", true) -> _selectedCropType.value = "Grapes"
                            detectedName.contains("Soybean", true) -> _selectedCropType.value = "Soybean"
                            detectedName.contains("Sugarcane", true) -> _selectedCropType.value = "Sugarcane"
                            detectedName.contains("Peanut", true) -> _selectedCropType.value = "Peanut"
                        }
                    }
                }
            } catch (e: Exception) {
                Log.e("AgroViewModel", "Scanning error", e)
                _isValidating.value = false
                _isDetecting.value = false
                _uiMessage.value = "Professional Analysis System Error: ${e.localizedMessage ?: "Unknown Error"}"
            } finally {
                _isValidating.value = false
                _isDetecting.value = false
            }
        }
    }
    
    fun clearDetection() {
        _detectionResult.value = null
        _isImageRejected.value = false
        _rejectionReason.value = null
    }

    fun setSelectedCropType(cropType: String?) {
        _selectedCropType.value = cropType
    }

    fun markAlertsRead() {
        viewModelScope.launch {
            repository.markAlertsRead()
        }
    }

    // Chatbot logic
    fun initializeChat() {
        if (_uiState.value.messages.isEmpty()) {
            _uiState.value = _uiState.value.copy(
                messages = listOf(
                    ChatMessage(
                        text = context.getString(R.string.chatbot_initial_msg),
                        isUser = false
                    )
                )
            )
        }
    }

    suspend fun sendMessage(text: String) {
        if (text.isBlank()) return

        // Add user message
        val userMessage = ChatMessage(text = text, isUser = true)
        _uiState.value = _uiState.value.copy(
            messages = listOf(userMessage) + _uiState.value.messages,
            isLoading = true
        )

        // Process Voice Commands (Basic Intent Parsing)
        val lowerText = text.lowercase()
        when {
            lowerText.contains("scan") || lowerText.contains("crop") -> {
                _uiMessage.value = "NAVIGATE_SCAN"
            }
            lowerText.contains("monitor") || lowerText.contains("soil") -> {
                _uiMessage.value = "NAVIGATE_MONITOR"
            }
            lowerText.contains("alert") -> {
                _uiMessage.value = "NAVIGATE_ALERTS"
            }
            lowerText.contains("profile") || lowerText.contains("farm") -> {
                _uiMessage.value = "NAVIGATE_PROFILE"
            }
            lowerText.contains("map") || lowerText.contains("location") || lowerText.contains("gps") || lowerText.contains("google map") || lowerText.contains("locate") -> {
                _uiMessage.value = "NAVIGATE_MAP"
            }
        }

        try {
            val response = repository.chatWithAi(text)
            val aiMessage = ChatMessage(text = response, isUser = false)
            _uiState.value = _uiState.value.copy(
                messages = listOf(aiMessage) + _uiState.value.messages,
                isLoading = false
            )
        } catch (e: Exception) {
            val errorMessage = ChatMessage(text = context.getString(R.string.chat_error_msg, e.message), isUser = false)
            _uiState.value = _uiState.value.copy(
                messages = listOf(errorMessage) + _uiState.value.messages,
                isLoading = false
            )
        }
    }
}

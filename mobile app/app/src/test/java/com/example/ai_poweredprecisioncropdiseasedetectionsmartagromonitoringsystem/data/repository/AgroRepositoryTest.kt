package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.repository

import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.dao.*
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity.UserSettingsEntity
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.remote.AgroApiService
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.remote.GeminiApiService
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.remote.GeminiCandidate
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.remote.GeminiContent
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.remote.GeminiPart
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.remote.GeminiResponse
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.remote.KindwiseApiService
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.model.CropDisease
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.postgrest.Postgrest
import io.mockk.*
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class AgroRepositoryTest {

    private lateinit var repository: AgroRepositoryImpl
    private val apiService = mockk<AgroApiService>(relaxed = true)
    private val kindwiseApiService = mockk<KindwiseApiService>(relaxed = true)
    private val geminiApiService = mockk<GeminiApiService>(relaxed = true)
    private val userSettingsDao = mockk<UserSettingsDao>(relaxed = true)
    private val userDao = mockk<UserDao>(relaxed = true)
    private val userOtpDao = mockk<UserOtpDao>(relaxed = true)
    private val sensorDataDao = mockk<SensorDataDao>(relaxed = true)
    private val alertDao = mockk<AlertDao>(relaxed = true)
    private val cropDetectionDao = mockk<CropDetectionDao>(relaxed = true)
    private val supabaseAuth = mockk<Auth>(relaxed = true)
    private val supabasePostgrest = mockk<Postgrest>(relaxed = true)

    @Before
    fun setup() {
        repository = AgroRepositoryImpl(
            apiService,
            kindwiseApiService,
            geminiApiService,
            userSettingsDao,
            userDao,
            userOtpDao,
            sensorDataDao,
            alertDao,
            cropDetectionDao,
            supabaseAuth,
            supabasePostgrest
        )
    }

    @Test
    fun `getSelectedLanguage returns saved language`() = runTest {
        val settings = UserSettingsEntity(selectedLanguage = "te")
        coEvery { userSettingsDao.getUserSettings() } returns flowOf(settings)

        val language = repository.getSelectedLanguage().first()
        assertEquals("te", language)
    }

    @Test
    fun `saveLanguage updates user settings`() = runTest {
        coEvery { userSettingsDao.getUserSettings() } returns flowOf(UserSettingsEntity())

        repository.saveLanguage("hi")
        coVerify { userSettingsDao.saveUserSettings(match { it.selectedLanguage == "hi" }) }
    }

    @Test
    fun `getDarkMode returns dark mode state`() = runTest {
        val settings = UserSettingsEntity(isDarkMode = true)
        coEvery { userSettingsDao.getUserSettings() } returns flowOf(settings)

        val isDark = repository.getDarkMode().first()
        assertTrue(isDark)
    }

    @Test
    fun `setDarkMode updates dark mode state`() = runTest {
        coEvery { userSettingsDao.getUserSettings() } returns flowOf(UserSettingsEntity(isDarkMode = false))

        repository.setDarkMode(true)
        coVerify { userSettingsDao.saveUserSettings(match { it.isDarkMode }) }
    }

    @Test
    fun `getNotificationsEnabled returns notification setting`() = runTest {
        val settings = UserSettingsEntity(notificationsEnabled = false)
        coEvery { userSettingsDao.getUserSettings() } returns flowOf(settings)

        val enabled = repository.getNotificationsEnabled().first()
        assertFalse(enabled)
    }

    @Test
    fun `setNotificationsEnabled updates setting`() = runTest {
        coEvery { userSettingsDao.getUserSettings() } returns flowOf(UserSettingsEntity())

        repository.setNotificationsEnabled(false)
        coVerify { userSettingsDao.saveUserSettings(match { !it.notificationsEnabled }) }
    }

    @Test
    fun `detectDisease on nonexistent file returns invalid image error`() = runTest {
        val result = repository.detectDisease("nonexistent_path.jpg", "Tomato")
        assertEquals("invalid", result.id)
        assertTrue(result.name.contains("Invalid", ignoreCase = true) || result.name.contains("Read Error", ignoreCase = true))
    }
}

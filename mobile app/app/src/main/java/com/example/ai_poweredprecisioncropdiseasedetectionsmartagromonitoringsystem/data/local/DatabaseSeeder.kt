package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local

import android.content.ContentValues
import android.content.Context
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity.CropDetectionEntity
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.InputStreamReader

class DatabaseSeeder(
    private val context: Context
) : RoomDatabase.Callback() {

    override fun onOpen(db: SupportSQLiteDatabase) {
        super.onOpen(db)
        CoroutineScope(Dispatchers.IO).launch {
            seedDefaultUser(db)
        }
    }

    override fun onCreate(db: SupportSQLiteDatabase) {
        super.onCreate(db)
        CoroutineScope(Dispatchers.IO).launch {
            seedDatabase(db)
            seedDefaultUser(db)
        }
    }

    private fun seedDefaultUser(db: SupportSQLiteDatabase) {
        try {
            val cursor = db.query("SELECT COUNT(*) FROM users")
            cursor.moveToFirst()
            val count = cursor.getInt(0)
            cursor.close()

            if (count == 0) {
                val values = ContentValues().apply {
                    put("email", "farmer@agroai.com")
                    put("passwordHash", "Farmer@123456")
                    put("fullName", "Smart Farmer")
                    put("phone", "+91 9876543210")
                    put("farmName", "Green Valley Agro Farm")
                    put("farmLocation", "Zone 4, Mandya")
                    put("farmSize", 8.5f)
                    put("isLoggedIn", 1)
                    put("experienceYears", 4)
                    put("primaryCrops", "Rice, Tomato, Cotton")
                    put("soilType", "Black Soil")
                    put("irrigationSystem", "Drip Irrigation")
                    put("waterSource", "Borewell & Canal")
                    put("farmingMethod", "Precision / Smart Farming")
                    put("stateRegion", "Karnataka")
                    put("farmBio", "Dedicated to high-yield sustainable agriculture using AgroAI smart diagnostics.")
                    put("annualYieldTarget", "60 Quintals / Acre")
                    put("latitude", 11.0168)
                    put("longitude", 76.9558)
                }
                db.insert("users", android.database.sqlite.SQLiteDatabase.CONFLICT_REPLACE, values)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun seedDatabase(db: SupportSQLiteDatabase) {
        try {
            val inputStream = context.assets.open("diseases_seed.json")
            val reader = InputStreamReader(inputStream)
            val type = object : TypeToken<List<CropDetectionEntity>>() {}.type
            val diseases: List<CropDetectionEntity> = Gson().fromJson(reader, type)

            diseases.forEach { disease ->
                val values = ContentValues().apply {
                    put("diseaseName", disease.diseaseName)
                    put("scientificName", disease.scientificName)
                    put("severity", disease.severity)
                    put("confidence", disease.confidence)
                    put("imageUrl", disease.imageUrl)
                    
                    // Correctly use Room's expected format (JSON via Converters)
                    val gson = Gson()
                    put("symptoms", gson.toJson(disease.symptoms))
                    put("treatmentSuggestions", gson.toJson(disease.treatmentSuggestions))
                    put("preventionTips", gson.toJson(disease.preventionTips))

                    put("timestamp", disease.timestamp)
                }
                db.insert("crop_detections", android.database.sqlite.SQLiteDatabase.CONFLICT_REPLACE, values)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}

package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.dao

import androidx.room.*
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity.CropDetectionEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface CropDetectionDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDetection(detection: CropDetectionEntity)

    @Query("SELECT * FROM crop_detections ORDER BY timestamp DESC")
    fun getAllDetections(): Flow<List<CropDetectionEntity>>

    @Query("DELETE FROM crop_detections")
    suspend fun clearHistory()
}

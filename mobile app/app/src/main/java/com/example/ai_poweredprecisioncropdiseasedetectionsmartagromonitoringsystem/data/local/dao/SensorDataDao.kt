package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.dao

import androidx.room.*
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity.SensorDataEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface SensorDataDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSensorData(data: SensorDataEntity)

    @Query("SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 50")
    fun getRecentSensorData(): Flow<List<SensorDataEntity>>

    @Query("DELETE FROM sensor_data")
    suspend fun clearAllData()
}

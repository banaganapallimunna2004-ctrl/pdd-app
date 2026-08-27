package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.dao.*
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity.*

@Database(
    entities = [
        UserSettingsEntity::class,
        UserEntity::class,
        UserOtpEntity::class,
        SensorDataEntity::class,
        AlertEntity::class,
        CropDetectionEntity::class
    ],
    version = 15
)
@TypeConverters(Converters::class)
abstract class AgroDatabase : RoomDatabase() {
    abstract fun userSettingsDao(): UserSettingsDao
    abstract fun userDao(): UserDao
    abstract fun userOtpDao(): UserOtpDao
    abstract fun sensorDataDao(): SensorDataDao
    abstract fun alertDao(): AlertDao
    abstract fun cropDetectionDao(): CropDetectionDao
}

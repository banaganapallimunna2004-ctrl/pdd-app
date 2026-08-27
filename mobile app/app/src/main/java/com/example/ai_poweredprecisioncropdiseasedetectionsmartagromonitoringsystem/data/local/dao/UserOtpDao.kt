package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.dao

import androidx.room.*
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.entity.UserOtpEntity

@Dao
interface UserOtpDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOtp(userOtp: UserOtpEntity)

    @Query("SELECT * FROM user_otps WHERE phoneNumber = :phoneNumber")
    suspend fun getOtpForPhone(phoneNumber: String): UserOtpEntity?

    @Query("DELETE FROM user_otps WHERE phoneNumber = :phoneNumber")
    suspend fun deleteOtpForPhone(phoneNumber: String)
}

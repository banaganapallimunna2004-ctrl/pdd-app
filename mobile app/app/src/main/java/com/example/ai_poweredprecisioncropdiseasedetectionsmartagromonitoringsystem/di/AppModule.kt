package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.di

import android.content.Context
import androidx.room.Room
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.AgroDatabase
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.DatabaseSeeder
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.local.dao.*
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.repository.AgroRepositoryImpl
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.domain.repository.AgroRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.realtime.Realtime
import io.github.jan.supabase.realtime.realtime
import javax.inject.Singleton

import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.remote.AgroApiService
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.remote.KindwiseApiService
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.data.remote.GeminiApiService
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.HEADERS
        }
        return OkHttpClient.Builder()
            .addInterceptor(loggingInterceptor)
            .connectTimeout(15, TimeUnit.SECONDS) // Reduced for faster failure detection
            .readTimeout(20, TimeUnit.SECONDS)
            .writeTimeout(20, TimeUnit.SECONDS)
            .build()
    }

    @Provides
    @Singleton
    fun provideAgroApiService(okHttpClient: OkHttpClient): AgroApiService {
        val serverIp = com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.util.Config.SERVER_IP
        return Retrofit.Builder()
            .baseUrl("http://$serverIp:5000/") 
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(AgroApiService::class.java)
    }

    @Provides
    @Singleton
    fun provideKindwiseApiService(okHttpClient: OkHttpClient): KindwiseApiService {
        return Retrofit.Builder()
            .baseUrl("https://plant.id/api/v3/")
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(KindwiseApiService::class.java)
    }

    @Provides
    @Singleton
    fun provideGeminiApiService(okHttpClient: OkHttpClient): GeminiApiService {
        return Retrofit.Builder()
            .baseUrl("https://generativelanguage.googleapis.com/")
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(GeminiApiService::class.java)
    }

    @Provides
    @Singleton
    fun provideAgroDatabase(@ApplicationContext context: Context): AgroDatabase {
        return Room.databaseBuilder(
            context,
            AgroDatabase::class.java,
            "agro_db"
        )
        .setJournalMode(androidx.room.RoomDatabase.JournalMode.WRITE_AHEAD_LOGGING)
        .addCallback(DatabaseSeeder(context))
        .fallbackToDestructiveMigration()
        .build()
    }

    @Provides
    @Singleton
    fun provideSupabaseClient(): SupabaseClient {
        return createSupabaseClient(
            supabaseUrl = "https://wtasrkwlpdzxzzigwsyxr.supabase.co",
            supabaseKey = "sb_publishable_u8qOfMOt-pOWyBnvS6D2hg_0F8SugHp"
        ) {
            install(Auth)
            install(Postgrest)
            install(Realtime)
        }
    }

    @Provides
    @Singleton
    fun provideSupabaseAuth(client: SupabaseClient): Auth = client.auth

    @Provides
    @Singleton
    fun provideSupabasePostgrest(client: SupabaseClient): Postgrest = client.postgrest

    @Provides
    @Singleton
    fun provideSupabaseRealtime(client: SupabaseClient): Realtime = client.realtime

    @Provides
    fun provideUserSettingsDao(db: AgroDatabase): UserSettingsDao = db.userSettingsDao()

    @Provides
    fun provideUserDao(db: AgroDatabase): UserDao = db.userDao()

    @Provides
    fun provideUserOtpDao(db: AgroDatabase): UserOtpDao = db.userOtpDao()

    @Provides
    fun provideSensorDataDao(db: AgroDatabase): SensorDataDao = db.sensorDataDao()

    @Provides
    fun provideAlertDao(db: AgroDatabase): AlertDao = db.alertDao()

    @Provides
    fun provideCropDetectionDao(db: AgroDatabase): CropDetectionDao = db.cropDetectionDao()

    @Provides
    @Singleton
    fun provideAgroRepository(
        apiService: AgroApiService,
        kindwiseApiService: KindwiseApiService,
        geminiApiService: GeminiApiService,
        userSettingsDao: UserSettingsDao,
        userDao: UserDao,
        userOtpDao: UserOtpDao,
        sensorDataDao: SensorDataDao,
        alertDao: AlertDao,
        cropDetectionDao: CropDetectionDao,
        supabaseAuth: Auth,
        supabasePostgrest: Postgrest
    ): AgroRepository {
        return AgroRepositoryImpl(
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
}

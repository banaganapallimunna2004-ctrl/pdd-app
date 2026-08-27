package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.util

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.R

object NotificationHelper {
    private const val CHANNEL_ID = "agro_otp_channel"
    private const val CHANNEL_NAME = "Agro OTP Notifications"
    private const val CHANNEL_DESC = "Notifications for login OTP codes"

    fun showOtpNotification(context: Context, otp: String) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(CHANNEL_ID, CHANNEL_NAME, NotificationManager.IMPORTANCE_HIGH).apply {
                description = CHANNEL_DESC
            }
            notificationManager.createNotificationChannel(channel)
        }

        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("AgroAI Verification Code")
            .setContentText("Your OTP code is: $otp. It will expire in 5 minutes.")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)

        notificationManager.notify(1001, builder.build())
    }
}

package com.example.ai_poweredprecisioncropdiseasedetectionsmartagromonitoringsystem.util

fun String.isValidEmail(): Boolean {
    return android.util.Patterns.EMAIL_ADDRESS.matcher(this).matches()
}

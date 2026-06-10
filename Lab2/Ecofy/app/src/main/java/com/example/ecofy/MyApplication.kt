package com.example.ecofy
import android.app.Application

class MyApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        applyLanguage()
    }

    private fun applyLanguage() {
        val savedLang = getSharedPreferences("app_prefs", MODE_PRIVATE)
            .getString("language", "uk") ?: "uk"

        val locale = java.util.Locale(savedLang)
        java.util.Locale.setDefault(locale)
        val config = resources.configuration
        config.setLocale(locale)
        resources.updateConfiguration(config, resources.displayMetrics)
    }
}
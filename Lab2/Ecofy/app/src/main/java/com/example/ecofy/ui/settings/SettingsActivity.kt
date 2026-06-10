package com.example.ecofy.ui.settings

import android.app.Dialog
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.AppCompatButton
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.ViewModelProvider
import com.example.ecofy.R
import com.example.ecofy.data.model.local.TokenManager
import com.example.ecofy.data.model.user.UserUpdate
import com.example.ecofy.data.network.RetrofitClient
import com.example.ecofy.data.repository.UserRepository
import com.example.ecofy.ui.auth.AuthActivity
import com.example.ecofy.ui.map.CityActivity
import com.example.ecofy.ui.navigation.BottomNavManager
import com.example.ecofy.ui.navigation.Tab
import java.util.Locale

class SettingsActivity : AppCompatActivity() {

    private lateinit var viewModel: SettingsViewModel
    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        // Відновлення мови до setContentView
        val savedLang = getSharedPreferences("app_prefs", MODE_PRIVATE)
            .getString("language", "uk") ?: "uk"
        applyLocale(savedLang)

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        // Ініціалізація
        tokenManager = TokenManager(this)
        val repository = UserRepository(RetrofitClient.api)
        viewModel = ViewModelProvider(
            this,
            SettingsViewModelFactory(repository)
        ).get(SettingsViewModel::class.java)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, 0)
            insets
        }

        BottomNavManager(this).apply {
            setup()
            setActive(Tab.ACCOUNT)
        }

        // Місто
        val cityName = getSharedPreferences("city_prefs", MODE_PRIVATE)
            .getString("city_name", "Не обрано")
        findViewById<TextView>(R.id.tvCityName).text = cityName
        findViewById<TextView>(R.id.btnChangeCity).setOnClickListener {
            startActivity(Intent(this, CityActivity::class.java))
        }

        selectLangUI(isUa = savedLang == "uk")
        setupLanguageButtons()
        setupButtons()
        observeViewModel()

        val token = tokenManager.getToken() ?: return
        val userId = tokenManager.getUserId()
        if (userId == -1) return
        viewModel.loadUser(token, userId)
    }

    private fun observeViewModel() {
        viewModel.user.observe(this) { user ->
            val fullName = listOfNotNull(user.first_name, user.last_name).joinToString(" ")
            findViewById<TextView>(R.id.tvDisplayName).text = fullName
            findViewById<EditText>(R.id.etName).setText(user.first_name)
            findViewById<EditText>(R.id.etLastName).setText(user.last_name ?: "")
            findViewById<EditText>(R.id.etEmail).setText(user.email)
            findViewById<EditText>(R.id.etPhone).setText(user.phone_number ?: "")
        }

        viewModel.saveResult.observe(this) { success ->
            val msg = if (success) "Збережено" else "Помилка збереження"
            Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
        }

        viewModel.error.observe(this) { message ->
            Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
        }
    }

    private fun setupButtons() {
        findViewById<Button>(R.id.btnSave).setOnClickListener { saveUser() }
        findViewById<Button>(R.id.btnCancel).setOnClickListener { finish() }
        findViewById<LinearLayout>(R.id.btnLogout).setOnClickListener { showLogoutDialog() }
    }

    private fun setupLanguageButtons() {
        findViewById<LinearLayout>(R.id.btnLangUa).setOnClickListener {
            selectLangUI(isUa = true)
            setLocale("uk")
        }
        findViewById<LinearLayout>(R.id.btnLangEn).setOnClickListener {
            selectLangUI(isUa = false)
            setLocale("en")
        }
    }

    private fun saveUser() {
        val token = tokenManager.getToken() ?: return
        val userId = tokenManager.getUserId()
        if (userId == -1) return

        val update = UserUpdate(
            first_name = findViewById<EditText>(R.id.etName).text.toString().trim(),
            last_name = findViewById<EditText>(R.id.etLastName).text.toString().trim(),
            email = findViewById<EditText>(R.id.etEmail).text.toString().trim(),
            phone_number = findViewById<EditText>(R.id.etPhone).text.toString().trim()
                .takeIf { it.isNotEmpty() },
            password = findViewById<EditText>(R.id.etPassword).text.toString().trim()
                .takeIf { it.isNotEmpty() }
        )

        viewModel.saveUser(token, userId, update)
    }

    private fun applyLocale(languageCode: String) {
        val locale = Locale(languageCode)
        Locale.setDefault(locale)
        val config = resources.configuration
        config.setLocale(locale)
        resources.updateConfiguration(config, resources.displayMetrics)
    }

    private fun setLocale(languageCode: String) {
        getSharedPreferences("app_prefs", MODE_PRIVATE)
            .edit().putString("language", languageCode).apply()
        applyLocale(languageCode)
        val intent = Intent(this, SettingsActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
        startActivity(intent)
        finish()
    }

    private fun selectLangUI(isUa: Boolean) {
        val btnLangUa = findViewById<LinearLayout>(R.id.btnLangUa)
        val btnLangEn = findViewById<LinearLayout>(R.id.btnLangEn)

        if (isUa) {
            btnLangUa.setBackgroundResource(R.drawable.bg_lang_selected)
            btnLangEn.setBackgroundResource(R.drawable.bg_lang_unselected)
            btnLangUa.findViewById<TextView>(R.id.tvLangUa)
                .setTextColor(getColor(R.color.green))
            btnLangEn.findViewById<TextView>(R.id.tvLangEn)
                .setTextColor(getColor(android.R.color.darker_gray))
        } else {
            btnLangEn.setBackgroundResource(R.drawable.bg_lang_selected)
            btnLangUa.setBackgroundResource(R.drawable.bg_lang_unselected)
            btnLangEn.findViewById<TextView>(R.id.tvLangEn)
                .setTextColor(getColor(R.color.green))
            btnLangUa.findViewById<TextView>(R.id.tvLangUa)
                .setTextColor(getColor(android.R.color.darker_gray))
        }
    }

    private fun showLogoutDialog() {
        val dialog = Dialog(this)
        dialog.setContentView(R.layout.dialog_logout)
        dialog.window?.setBackgroundDrawableResource(android.R.color.transparent)
        dialog.findViewById<AppCompatButton>(R.id.btnCancel)
            .setOnClickListener { dialog.dismiss() }
        dialog.findViewById<AppCompatButton>(R.id.btnLogOut)
            .setOnClickListener { dialog.dismiss(); logout() }
        dialog.show()
    }

    private fun logout() {
        tokenManager.saveToken("")
        tokenManager.saveUserId(-1)
        startActivity(Intent(this, AuthActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        })
    }
}
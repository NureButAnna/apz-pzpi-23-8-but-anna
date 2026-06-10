package com.example.ecofy.ui.auth

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.ViewModelProvider
import com.example.ecofy.R
import com.example.ecofy.data.model.local.TokenManager
import com.example.ecofy.data.network.RetrofitClient
import com.example.ecofy.ui.map.CityActivity
import com.example.ecofy.ui.MainActivity
import com.example.ecofy.ui.regist.RegistrationActivity
import com.example.ecofy.ui.auth.AuthViewModel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class AuthActivity : AppCompatActivity() {

    private lateinit var viewModel: AuthViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_auth)

        viewModel = ViewModelProvider(this)[AuthViewModel::class.java]

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val email: EditText = findViewById(R.id.user_email)
        val password: EditText = findViewById(R.id.user_password)
        val emailFromRegistration = intent.getStringExtra("email")

        if (!emailFromRegistration.isNullOrEmpty()) {
            email.setText(emailFromRegistration)
        }
        val button: Button = findViewById(R.id.button_auth)

        button.setOnClickListener {
            viewModel.login(
                email.text.toString().trim(),
                password.text.toString().trim()
            )
        }

        findViewById<TextView>(R.id.link_to_reg).setOnClickListener {
            startActivity(Intent(this, RegistrationActivity::class.java))
        }

        viewModel.loginState.observe(this) { result ->
            result.onSuccess {

                val tokenManager = TokenManager(this)

                viewModel.loginResponse?.let { body ->
                    tokenManager.saveToken(body.access_token)
                    tokenManager.saveUserId(body.user_id)
                }

                Toast.makeText(
                    this,
                    it,
                    Toast.LENGTH_LONG
                ).show()

                checkUserCityAndNavigate()
            }

            result.onFailure {
                Toast.makeText(
                    this,
                    it.message,
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }

    private fun checkUserCityAndNavigate() {
        Log.d("NAV_FLOW", "checkUserCityAndNavigate START")

        val tokenManager = TokenManager(this)
        val token = tokenManager.getToken()
        val userId = tokenManager.getUserId()

        Log.d("NAV_FLOW", "token=$token userId=$userId")

        if (token.isNullOrEmpty() || userId == -1) {
            Log.d("NAV_FLOW", "INVALID TOKEN → MainActivity")
            startActivity(Intent(this, MainActivity::class.java))
            return
        }

        CoroutineScope(Dispatchers.Main).launch {
            try {
                Log.d("NAV_FLOW", "CALL getUser")

                val response = RetrofitClient.api.getUser("Bearer $token", userId)

                Log.d("NAV_FLOW", "response.isSuccessful = ${response.isSuccessful}")

                if (response.isSuccessful) {
                    val user = response.body()
                    Log.d("NAV_FLOW", "user = $user")

                    if (user?.cityId == null || user.cityId == 0) {
                        Log.d("NAV_FLOW", "→ CITY ACTIVITY")
                        startActivity(Intent(this@AuthActivity, CityActivity::class.java))
                    } else {
                        Log.d("NAV_FLOW", "→ MAIN ACTIVITY")
                        startActivity(Intent(this@AuthActivity, MainActivity::class.java))
                    }
                } else {
                    Log.d("NAV_FLOW", "ERROR RESPONSE → MAIN")
                    startActivity(Intent(this@AuthActivity, MainActivity::class.java))
                }

            } catch (e: Exception) {
                Log.e("NAV_FLOW", "EXCEPTION: ${e.message}", e)
                startActivity(Intent(this@AuthActivity, MainActivity::class.java))
            }

            finish()
        }
    }
}
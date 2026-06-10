package com.example.ecofy.ui.regist

import android.content.Intent
import android.os.Bundle
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
import com.example.ecofy.data.model.reg.UiState
import com.example.ecofy.ui.auth.AuthActivity
import com.example.ecofy.ui.regist.RegViewModel

class RegistrationActivity : AppCompatActivity() {

    private lateinit var viewModel: RegViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_registration)

        viewModel = ViewModelProvider(this)[RegViewModel::class.java]

        val userName: EditText = findViewById(R.id.user_name)
        val userEmail: EditText = findViewById(R.id.user_email)
        val userPassword: EditText = findViewById(R.id.user_password)
        val userConfirmPassword: EditText = findViewById(R.id.user_confirm_password)
        val button: Button = findViewById(R.id.button_reg)
        val linkToAuth: TextView = findViewById(R.id.link_to_auth)

        linkToAuth.setOnClickListener {
            startActivity(Intent(this, AuthActivity::class.java))
        }

        button.setOnClickListener {
            viewModel.register(
                userName.text.toString().trim(),
                userEmail.text.toString().trim(),
                userPassword.text.toString().trim(),
                userConfirmPassword.text.toString().trim()
            )
        }

        viewModel.registerState.observe(this) { state ->

            when (state) {

                is UiState.Loading -> {

                    button.isEnabled = false
                    button.text = "Завантаження..."
                }

                is UiState.Success -> {

                    button.isEnabled = true
                    button.text = "Зареєструватися"

                    Toast.makeText(
                        this,
                        "Реєстрація успішна. Увійдіть у систему.",
                        Toast.LENGTH_LONG
                    ).show()

                    val intent = Intent(
                        this,
                        AuthActivity::class.java
                    )

                    intent.putExtra("email", state.email)

                    startActivity(intent)
                    finish()
                }

                is UiState.Error -> {

                    button.isEnabled = true
                    button.text = "Зареєструватися"

                    Toast.makeText(
                        this,
                        state.message,
                        Toast.LENGTH_LONG
                    ).show()
                }

                else -> {}
            }
        }

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
    }
}
package com.example.ecofy.ui.auth

import android.util.Base64
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.ecofy.data.model.auth.LoginResponse
import com.example.ecofy.data.network.RetrofitClient
import kotlinx.coroutines.launch
import org.json.JSONObject

class AuthViewModel : ViewModel() {

    private val _loginState = MutableLiveData<Result<String>>()
    val loginState: LiveData<Result<String>> = _loginState

    var userId: Int? = null
    var loginResponse: LoginResponse? = null
    var token: String? = null

    fun login(email: String, password: String) {

        if (email.isEmpty() || password.isEmpty()) {
            _loginState.value = Result.failure(Exception("Не всі поля заповнені"))
            return
        }

        viewModelScope.launch {
            try {
                val response = RetrofitClient.api.login(email, password)

                if (response.isSuccessful) {
                    val body = response.body()

                    if (body != null) {
                        token = body.access_token

                        // Дістаємо userId з JWT, бо сервер не повертає user_id окремо
                        val extractedId = extractUserIdFromJwt(body.access_token)
                        userId = extractedId

                        // Зберігаємо у loginResponse з правильним userId
                        loginResponse = body.copy(user_id = extractedId ?: 0)

                        _loginState.value = Result.success("Користувач авторизований")
                    } else {
                        _loginState.value =
                            Result.failure(Exception("Порожня відповідь сервера"))
                    }
                } else {
                    _loginState.value =
                        Result.failure(Exception("Невірний email або пароль"))
                }

            } catch (e: Exception) {
                _loginState.value =
                    Result.failure(Exception("Помилка мережі: ${e.message}"))
            }
        }
    }

    private fun extractUserIdFromJwt(token: String): Int? {
        return try {
            val payload = token.split(".")[1]

            val paddedPayload = payload.padEnd(
                payload.length + (4 - payload.length % 4) % 4, '='
            )
            val decoded = Base64.decode(paddedPayload, Base64.URL_SAFE)
            val json = JSONObject(String(decoded))

            json.getString("sub").toIntOrNull()
        } catch (e: Exception) {
            null
        }
    }
}
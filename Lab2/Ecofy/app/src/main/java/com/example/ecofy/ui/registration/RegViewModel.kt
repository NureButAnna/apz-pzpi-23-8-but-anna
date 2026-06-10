package com.example.ecofy.ui.regist

import android.util.Patterns
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.ecofy.data.model.reg.UiState
import com.example.ecofy.data.model.reg.UserCreate
import com.example.ecofy.data.network.RetrofitClient
import kotlinx.coroutines.launch

class RegViewModel : ViewModel() {

    private val _registerState = MutableLiveData<UiState>()
    val registerState: LiveData<UiState> = _registerState

    fun register(
        name: String,
        email: String,
        password: String,
        confirmPassword: String
    ) {


        if (name.isBlank()) {
            _registerState.value = UiState.Error("Введіть ім’я")
            return
        }

        if (email.isBlank()) {
            _registerState.value = UiState.Error("Введіть email")
            return
        }

        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            _registerState.value = UiState.Error("Некоректний email")
            return
        }

        if (password.isBlank()) {
            _registerState.value = UiState.Error("Введіть пароль")
            return
        }

        if (password.length < 6) {
            _registerState.value = UiState.Error("Пароль має бути мінімум 6 символів")
            return
        }

        if (password != confirmPassword) {
            _registerState.value = UiState.Error("Паролі не співпадають")
            return
        }

        val user = UserCreate(
            first_name = name,
            last_name = "",
            patronymic = null,
            email = email,
            phone_number = null,
            city_id = null,
            password = password
        )

        viewModelScope.launch {

            _registerState.value = UiState.Loading

            try {
                val response = RetrofitClient.api.register(user)

                if (response.isSuccessful) {
                    _registerState.value = UiState.Success(email)
                } else {
                    val error = response.errorBody()?.string()
                    _registerState.value =
                        UiState.Error(error ?: "Помилка: ${response.code()}")
                }

            } catch (e: Exception) {
                _registerState.value =
                    UiState.Error("Помилка мережі: ${e.message}")
            }
        }
    }
}
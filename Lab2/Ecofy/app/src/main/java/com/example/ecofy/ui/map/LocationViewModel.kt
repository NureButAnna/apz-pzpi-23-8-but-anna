package com.example.ecofy.ui.map

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.ecofy.data.model.local.TokenManager
import com.example.ecofy.data.model.user.City
import com.example.ecofy.data.model.user.UpdateCity
import com.example.ecofy.data.network.RetrofitClient
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class LocationViewModel(
    private val tokenManager: TokenManager
) : ViewModel() {

    private val _cities = MutableLiveData<List<City>>()
    val cities: LiveData<List<City>> get() = _cities

    private val _updateSuccess = MutableLiveData<City?>()
    val updateSuccess: LiveData<City?> get() = _updateSuccess

    private val _error = MutableLiveData<String>()
    val error: LiveData<String> get() = _error

    private val _validationError = MutableLiveData<String>()
    val validationError: LiveData<String> get() = _validationError

    private var selectedCity: City? = null
    private var searchJob: Job? = null

    fun selectCity(city: City) {
        selectedCity = city
    }

    fun saveCity() {
        val city = selectedCity
        if (city == null) {
            _validationError.value = "Оберіть місто зі списку"
            return
        }
        updateUserCity(city)
    }

    fun searchCities(query: String) {
        if (query.length < 2) return
        searchJob?.cancel()
        searchJob = viewModelScope.launch {
            delay(300)
            try {
                val response = RetrofitClient.api.searchCities(query)
                if (response.isSuccessful) {
                    _cities.value = response.body() ?: emptyList()
                } else {
                    _error.value = "Помилка пошуку: ${response.code()}"
                }
            } catch (e: Exception) {
                _error.value = "Немає з'єднання з сервером"
            }
        }
    }

    private fun updateUserCity(city: City) {
        viewModelScope.launch {
            try {
                val token = tokenManager.getToken()
                val userId = tokenManager.getUserId()

                Log.d("CITY_DEBUG", "token=$token")
                Log.d("CITY_DEBUG", "userId=$userId")
                Log.d("CITY_DEBUG", "cityId=${city.id}")

                if (token.isNullOrEmpty() || userId == -1) {
                    _error.value = "Помилка авторизації"
                    return@launch
                }

                val response = RetrofitClient.api.updateUserCity(
                    token = "Bearer $token",
                    userId = userId,
                    request = UpdateCity(city.id)
                )

                Log.d(
                    "CITY_DEBUG",
                    "code=${response.code()} success=${response.isSuccessful}"
                )

                if (response.isSuccessful) {
                    _updateSuccess.value = city
                } else {
                    _error.value = response.errorBody()?.string()
                        ?: "Помилка ${response.code()}"
                }

            } catch (e: Exception) {
                Log.e("CITY_DEBUG", "EXCEPTION", e)
                _error.value = e.message ?: "Невідома помилка"
            }
        }
    }
}
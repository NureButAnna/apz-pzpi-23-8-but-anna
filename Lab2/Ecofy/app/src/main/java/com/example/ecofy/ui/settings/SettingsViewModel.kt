package com.example.ecofy.ui.settings

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.ecofy.data.model.user.UserResponse
import com.example.ecofy.data.model.user.UserUpdate
import com.example.ecofy.data.repository.UserRepository
import kotlinx.coroutines.launch

class SettingsViewModel(
    private val repository: UserRepository
) : ViewModel() {

    private val _user = MutableLiveData<UserResponse>()
    val user: LiveData<UserResponse> = _user

    private val _saveResult = MutableLiveData<Boolean>()
    val saveResult: LiveData<Boolean> = _saveResult

    private val _error = MutableLiveData<String>()
    val error: LiveData<String> = _error

    fun loadUser(token: String, userId: Int) {
        viewModelScope.launch {
            try {
                val user = repository.getUser(token, userId)
                if (user != null) _user.value = user
                else _error.value = "Не вдалося завантажити дані"
            } catch (e: Exception) {
                _error.value = e.message
            }
        }
    }

    fun saveUser(token: String, userId: Int, update: UserUpdate) {
        viewModelScope.launch {
            try {
                val success = repository.updateUser(token, userId, update)
                _saveResult.value = success
            } catch (e: Exception) {
                _error.value = "Помилка мережі"
            }
        }
    }
}
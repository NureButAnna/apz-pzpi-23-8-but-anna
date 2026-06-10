package com.example.ecofy.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.example.ecofy.data.model.local.TokenManager
import com.example.ecofy.ui.map.LocationViewModel

class ViewModelFactory(
    private val tokenManager: TokenManager
) : ViewModelProvider.Factory {

    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return LocationViewModel(tokenManager) as T
    }
}
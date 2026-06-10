package com.example.ecofy.data.model.reg

sealed class UiState {
    object Idle : UiState()

    object Loading : UiState()

    data class Success(
        val email: String
    ) : UiState()

    data class Error(
        val message: String
    ) : UiState()
}

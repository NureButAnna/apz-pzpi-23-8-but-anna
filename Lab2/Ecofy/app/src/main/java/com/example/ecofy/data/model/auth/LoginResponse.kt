package com.example.ecofy.data.model.auth

data class LoginResponse(
    val access_token: String,
    val token_type: String,
    val user_id: Int
)
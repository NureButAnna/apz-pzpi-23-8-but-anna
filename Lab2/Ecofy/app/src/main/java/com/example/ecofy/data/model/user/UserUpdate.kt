package com.example.ecofy.data.model.user

data class UserUpdate(
    val first_name: String? = null,
    val last_name: String? = null,
    val email: String? = null,
    val phone_number: String? = null,
    val password: String? = null
)

package com.example.ecofy.data.model.reg

data class UserCreate(
    val first_name: String,
    val last_name: String,
    val patronymic: String?,
    val email: String,
    val phone_number: String?,
    val city_id: String?,
    val password: String
)


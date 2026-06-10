package com.example.ecofy.data.model.user

import com.google.gson.annotations.SerializedName

data class UserResponse(
    val user_id: Int,
    val first_name: String,
    val last_name: String,
    val patronymic: String?,
    val email: String,
    val phone_number: String?,
    @SerializedName("city_id")
    val cityId: Int?,
    val created_at: String?
)

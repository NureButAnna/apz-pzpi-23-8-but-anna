package com.example.ecofy.data.model.user

import com.google.gson.annotations.SerializedName

data class City(
    @SerializedName("city_id")
    val id: Int,

    val name: String,
    val latitude: Double,
    val longitude: Double,
    val region: String?
) {
    override fun toString(): String {
        return name
    }
}


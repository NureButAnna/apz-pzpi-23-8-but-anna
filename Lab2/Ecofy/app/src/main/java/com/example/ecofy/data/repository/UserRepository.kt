package com.example.ecofy.data.repository

import com.example.ecofy.data.model.reg.UserCreate
import com.example.ecofy.data.model.user.UserResponse
import com.example.ecofy.data.model.user.UserUpdate
import com.example.ecofy.data.network.ApiService

class UserRepository(private val api: ApiService) {

    suspend fun getUser(token: String, userId: Int): UserResponse? {
        val response = api.getUser("Bearer $token", userId)
        return if (response.isSuccessful) response.body() else null
    }

    suspend fun updateUser(token: String, userId: Int, update: UserUpdate): Boolean {
        val response = api.updateUser("Bearer $token", userId, update)
        return response.isSuccessful
    }
}
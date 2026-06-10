package com.example.ecofy.data.repository

import com.example.ecofy.data.model.auth.LoginResponse
import com.example.ecofy.data.model.auth.MeResponse
import com.example.ecofy.data.model.reg.RegisterResponse
import com.example.ecofy.data.model.reg.UserCreate
import com.example.ecofy.data.network.ApiService

class AuthRepository (
    private val api: ApiService
) {

    suspend fun login(email: String, password: String): LoginResponse? {
        val response = api.login(email, password)
        return if (response.isSuccessful) response.body() else null
    }

    suspend fun getMe(token: String): MeResponse? {
        val response = api.getMe("Bearer $token")
        return response.body()
    }

    suspend fun register(user: UserCreate): RegisterResponse? {
        val response = api.register(user)
        return response.body()
    }
}
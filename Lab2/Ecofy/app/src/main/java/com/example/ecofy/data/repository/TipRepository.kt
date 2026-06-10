package com.example.ecofy.data.repository

import com.example.ecofy.data.model.tip.Tip
import com.example.ecofy.data.network.ApiService

class TipRepository(private val api: ApiService) {

    suspend fun getCategories(): List<String> {
        val response = api.getTipCategories()
        return if (response.isSuccessful) response.body() ?: emptyList()
        else emptyList()
    }

    suspend fun getTips(category: String?): List<Tip> {
        val response = api.getTips(category)
        return if (response.isSuccessful) response.body() ?: emptyList()
        else emptyList()
    }
}
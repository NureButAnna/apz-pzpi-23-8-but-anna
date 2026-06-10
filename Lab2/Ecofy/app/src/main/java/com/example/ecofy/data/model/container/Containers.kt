package com.example.ecofy.data.model.container

data class Containers(
    val container_id: Int,
    val type: String,
    val capacity: Int?,
    val fill_level: Int?,
    val status: String,
    val tilted: Boolean,
    val last_update: String,
    val container_site_id: Int
)


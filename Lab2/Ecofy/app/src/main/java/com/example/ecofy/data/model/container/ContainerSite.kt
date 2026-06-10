package com.example.ecofy.data.model.container

data class ContainerSite(
    val container_site_id: Int,
    val city_id: Int?,
    val street: String,
    val building: String,
    val entrance: String?,
    val location_lat: Double?,
    val location_lng: Double?
)


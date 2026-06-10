package com.example.ecofy.data.model.container

data class ContainerSiteCard(
    val siteId: Int,
    val address: String,
    val wasteTypes: List<String>,
    val avgFillLevel: Int,
    val containerCount: Int = 0
)

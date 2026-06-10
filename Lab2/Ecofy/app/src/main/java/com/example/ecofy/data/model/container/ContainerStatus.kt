package com.example.ecofy.data.model.container

data class ContainerStatus(
    val container_id: Int,
    val waste_type: String,
    val fill_level: Int,
    val container_site: ContainerSiteShort
)

data class ContainerSiteShort(
    val site_id: Int,
    val address: String
)

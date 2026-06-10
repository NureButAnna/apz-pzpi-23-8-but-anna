package com.example.ecofy.data.model.container

data class ContainerSiteDetail(
    val container_site_id: Int,
    val city: String,
    val address: String,
    val containers: List<ContainerInfo>
)

data class ContainerInfo(
    val container_id: Int,
    val waste_type: String,
    val fill_level: Int?,
    val status: String
)

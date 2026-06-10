package com.example.ecofy.data.repository

import com.example.ecofy.data.model.container.ContainerSite
import com.example.ecofy.data.model.container.ContainerSiteCard
import com.example.ecofy.data.model.container.ContainerStatus
import com.example.ecofy.data.network.ApiService

class ContainerRepository(private val api: ApiService) {

    suspend fun getContainerSites(token: String) =
        api.getContainerSites("Bearer $token")
            .body()

    suspend fun getContainerStatus(token: String) =
        api.getContainerStatus("Bearer $token")
            .body()

    suspend fun getContainerSiteCards(token: String): List<ContainerSiteCard> {
        val sites = getContainerSites(token) ?: return emptyList()
        val statuses = getContainerStatus(token) ?: return emptyList()

        val grouped = statuses.groupBy { it.container_site.site_id }

        return sites.map { site ->
            val containers = grouped[site.container_site_id] ?: emptyList()
            val avgFill = if (containers.isNotEmpty())
                containers.map { it.fill_level }.average().toInt()
            else 0
            val types = containers.map { it.waste_type }.distinct()

            ContainerSiteCard(
                siteId = site.container_site_id,
                address = "${site.street}, ${site.building}",
                wasteTypes = types,
                avgFillLevel = avgFill,
                containerCount = containers.size
            )
        }
    }
}
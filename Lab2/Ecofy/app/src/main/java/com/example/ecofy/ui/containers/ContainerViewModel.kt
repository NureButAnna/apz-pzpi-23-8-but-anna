package com.example.ecofy.ui.containers

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.ecofy.data.model.container.ContainerSiteCard
import com.example.ecofy.data.network.RetrofitClient
import com.example.ecofy.data.repository.ContainerRepository
import kotlinx.coroutines.launch

class ContainerViewModel : ViewModel() {

    private val repository = ContainerRepository(RetrofitClient.api)

    private val _siteCards = MutableLiveData<List<ContainerSiteCard>>()
    val siteCards: LiveData<List<ContainerSiteCard>> = _siteCards

    fun loadContainerSites(token: String) {
        viewModelScope.launch {
            try {
                val sites = repository.getContainerSites(token) ?: return@launch
                val statuses = repository.getContainerStatus(token) ?: return@launch

                val grouped = statuses.groupBy { it.container_site.site_id }

                val cards = sites.map { site ->
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

                _siteCards.value = cards

            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
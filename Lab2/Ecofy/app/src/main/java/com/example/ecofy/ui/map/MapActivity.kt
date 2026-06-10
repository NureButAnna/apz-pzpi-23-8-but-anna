package com.example.ecofy.ui.map

import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.ecofy.R
import com.example.ecofy.data.model.container.ContainerSite
import com.example.ecofy.data.model.container.ContainerSiteCard
import com.example.ecofy.data.model.local.TokenManager
import com.example.ecofy.data.network.RetrofitClient
import com.example.ecofy.ui.navigation.BottomNavManager
import com.example.ecofy.ui.navigation.Tab
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import com.google.android.material.bottomsheet.BottomSheetBehavior
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MapActivity : AppCompatActivity(), OnMapReadyCallback {

    private var map: GoogleMap? = null
    private lateinit var bottomSheet: LinearLayout
    private lateinit var bottomSheetBehavior: BottomSheetBehavior<LinearLayout>

    private var pendingCards: List<ContainerSiteCard> = emptyList()
    private var pendingSites: List<ContainerSite> = emptyList()

    private var allSites: List<ContainerSite> = emptyList()
    private var allCards: List<ContainerSiteCard> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_map)

        BottomNavManager(this).apply {
            setup()
            setActive(Tab.MAP)
        }

        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.map) as SupportMapFragment
        mapFragment.getMapAsync(this)

        bottomSheet = findViewById(R.id.bottomSheet)
        bottomSheetBehavior = BottomSheetBehavior.from(bottomSheet)
        bottomSheetBehavior.state = BottomSheetBehavior.STATE_HIDDEN
        bottomSheetBehavior.isDraggable = true

        // Пошук
        findViewById<EditText>(R.id.etSearch).addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun afterTextChanged(s: Editable?) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                filterSites(s?.toString()?.trim()?.lowercase() ?: "")
            }
        })

        loadContainerSites()
    }

    override fun onMapReady(googleMap: GoogleMap) {
        map = googleMap

        val prefs = getSharedPreferences("city_prefs", MODE_PRIVATE)
        val lat = prefs.getFloat("city_lat", 49.9935f).toDouble()
        val lng = prefs.getFloat("city_lng", 36.2304f).toDouble()
        map?.moveCamera(CameraUpdateFactory.newLatLngZoom(LatLng(lat, lng), 12f))

        map?.setOnMapClickListener {
            bottomSheetBehavior.state = BottomSheetBehavior.STATE_HIDDEN
        }

        if (pendingSites.isNotEmpty()) {
            addMarkersToMap(pendingSites, pendingCards)
            pendingSites = emptyList()
            pendingCards = emptyList()
        }
    }

    private fun filterSites(query: String) {
        map?.clear()

        val filteredSites = if (query.isEmpty()) allSites
        else allSites.filter {
            "${it.street} ${it.building}".lowercase().contains(query)
        }

        val filteredCards = if (query.isEmpty()) allCards
        else allCards.filter {
            it.address.lowercase().contains(query)
        }

        addMarkersToMap(filteredSites, filteredCards)

        if (filteredSites.size == 1) {
            val site = filteredSites.first()
            val lat = site.location_lat ?: return
            val lng = site.location_lng ?: return
            map?.animateCamera(
                CameraUpdateFactory.newLatLngZoom(LatLng(lat, lng), 15f)
            )
        }
    }

    private fun loadContainerSites() {
        val tokenManager = TokenManager(this)
        val token = tokenManager.getToken() ?: return

        CoroutineScope(Dispatchers.Main).launch {
            try {
                val sitesResponse = RetrofitClient.api.getContainerSites("Bearer $token")
                val statusResponse = RetrofitClient.api.getContainerStatus("Bearer $token")

                if (!sitesResponse.isSuccessful || !statusResponse.isSuccessful) return@launch

                val sites = sitesResponse.body() ?: return@launch
                val statuses = statusResponse.body() ?: emptyList()

                val grouped = statuses.groupBy { it.container_site.site_id }

                val cards = sites.map { site ->
                    val containers = grouped[site.container_site_id] ?: emptyList()
                    val avgFill = if (containers.isNotEmpty())
                        containers.map { it.fill_level }.average().toInt() else 0
                    val types = containers.map { it.waste_type }.distinct()

                    ContainerSiteCard(
                        siteId = site.container_site_id,
                        address = "${site.street}, ${site.building}",
                        wasteTypes = types,
                        avgFillLevel = avgFill,
                        containerCount = containers.size
                    )
                }

                allSites = sites
                allCards = cards

                if (map != null) {
                    addMarkersToMap(sites, cards)
                } else {
                    pendingCards = cards
                    pendingSites = sites
                }

            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun addMarkersToMap(
        sites: List<ContainerSite>,
        cards: List<ContainerSiteCard>
    ) {
        sites.forEach { site ->
            val lat = site.location_lat ?: return@forEach
            val lng = site.location_lng ?: return@forEach

            val marker = map?.addMarker(
                MarkerOptions()
                    .position(LatLng(lat, lng))
                    .title("${site.street}, ${site.building}")
            )
            marker?.tag = site.container_site_id
        }

        map?.setOnMarkerClickListener { marker ->
            val siteId = marker.tag as? Int
            val card = cards.find { it.siteId == siteId }
            card?.let { showSiteInfo(it) }
            true
        }
    }

    private fun showSiteInfo(card: ContainerSiteCard) {
        bottomSheet.findViewById<TextView>(R.id.tvSiteAddress).text = card.address
        bottomSheet.findViewById<TextView>(R.id.tvSiteDescription).text =
            card.wasteTypes.joinToString(", ")
        bottomSheet.findViewById<TextView>(R.id.tvContainerCountMap).text =
            card.containerCount.toString()

        val fill = card.avgFillLevel
        val tvFill = bottomSheet.findViewById<TextView>(R.id.tvFillPercentMap)
        val progressBar = bottomSheet.findViewById<ProgressBar>(R.id.progressFillMap)

        tvFill.text = "$fill%"
        progressBar.progress = fill

        val tintColor = when {
            fill >= 80 -> Color.parseColor("#F39C12")
            fill >= 50 -> Color.parseColor("#E5B93D")
            else -> Color.parseColor("#41B87A")
        }
        tvFill.setTextColor(tintColor)
        progressBar.progressTintList = ColorStateList.valueOf(tintColor)

        val tagsLayout = bottomSheet.findViewById<LinearLayout>(R.id.tagsLayoutMap)
        tagsLayout.removeAllViews()
        card.wasteTypes.forEach { type ->
            val tag = TextView(this).apply {
                text = type
                textSize = 12f
                setPadding(24, 8, 24, 8)
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { marginEnd = 8 }
                val (bgRes, color) = when (type.lowercase()) {
                    "скло" -> Pair(R.drawable.tag_blue, "#2196F3")
                    "папір" -> Pair(R.drawable.tag_yellow, "#FF9800")
                    "пластик" -> Pair(R.drawable.tag_green, "#4CAF50")
                    "метал" -> Pair(R.drawable.tag_green, "#9E9E9E")
                    else -> Pair(R.drawable.tag_green, "#41B87A")
                }
                setBackgroundResource(bgRes)
                setTextColor(Color.parseColor(color))
            }
            tagsLayout.addView(tag)
        }

        bottomSheetBehavior.state = BottomSheetBehavior.STATE_EXPANDED
    }
}
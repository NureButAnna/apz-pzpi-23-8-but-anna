package com.example.ecofy.ui

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.ecofy.R
import com.example.ecofy.data.model.local.TokenManager
import com.example.ecofy.data.network.RetrofitClient
import com.example.ecofy.ui.navigation.BottomNavManager
import com.example.ecofy.ui.containers.ContainerSiteAdapter
import com.example.ecofy.ui.notifications.NotificationsActivity
import com.example.ecofy.ui.containers.ContainerViewModel
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var adapter: ContainerSiteAdapter
    private lateinit var containerViewModel: ContainerViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        BottomNavManager(this).setup()
        setupRecyclerView()
        handleCityData()
        loadUserName()
        setupNotificationsButton()

        containerViewModel = ViewModelProvider(this)[ContainerViewModel::class.java]

        val tokenManager = TokenManager(this)
        val token = tokenManager.getToken() ?: return

        containerViewModel.siteCards.observe(this) { cards ->
            adapter.submitList(cards)
        }

        containerViewModel.loadContainerSites(token)
    }

    private fun setupRecyclerView() {
        adapter = ContainerSiteAdapter()
        findViewById<RecyclerView>(R.id.rvStations).apply {
            layoutManager = LinearLayoutManager(
                this@MainActivity,
                LinearLayoutManager.VERTICAL,  // ← змінено
                false
            )
            adapter = this@MainActivity.adapter
        }
    }

    private fun handleCityData() {
        val cityId = intent.getIntExtra("city_id", -1)
        val cityName = intent.getStringExtra("city_name")
        val cityLatitude = intent.getDoubleExtra("city_latitude", 50.4501)
        val cityLongitude = intent.getDoubleExtra("city_longitude", 30.5234)

        if (cityId != -1) {
            val prefs = getSharedPreferences("city_prefs", MODE_PRIVATE)
            prefs.edit()
                .putInt("city_id", cityId)
                .putString("city_name", cityName)
                .putFloat("city_lat", cityLatitude.toFloat())
                .putFloat("city_lng", cityLongitude.toFloat())
                .apply()
        }

        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.map) as? SupportMapFragment

        mapFragment?.getMapAsync { googleMap ->
            val cityLatLng = LatLng(cityLatitude, cityLongitude)
            googleMap.moveCamera(
                CameraUpdateFactory.newLatLngZoom(cityLatLng, 12f)
            )
        }
    }

    private fun loadUserName() {
        val tokenManager = TokenManager(this)
        val token = tokenManager.getToken() ?: return
        val userId = tokenManager.getUserId()
        if (userId == -1) return

        CoroutineScope(Dispatchers.Main).launch {
            try {
                val response = RetrofitClient.api.getUser("Bearer $token", userId)
                if (response.isSuccessful) {
                    val user = response.body() ?: return@launch

                    findViewById<TextView>(R.id.tvUserName).text = "${user.first_name}!"

                    val daysText = findViewById<TextView>(R.id.tvDaysInApp)
                    val createdAt = user.created_at
                    if (!createdAt.isNullOrEmpty()) {
                        val days = calculateDaysSince(createdAt)
                        daysText.text = getString(R.string.eco_days, days)
                    }
                }
            } catch (e: Exception) {

            }
        }
    }

    private fun calculateDaysSince(dateStr: String): Long {
        return try {
            val format = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", java.util.Locale.getDefault())
            val date = format.parse(dateStr) ?: return 0
            val diff = System.currentTimeMillis() - date.time
            diff / (1000 * 60 * 60 * 24)
        } catch (e: Exception) {
            0
        }
    }

    private fun setupNotificationsButton() {

        findViewById<ImageView>(R.id.ivNotifications)
            .setOnClickListener {

                startActivity(
                    Intent(
                        this,
                        NotificationsActivity::class.java
                    )
                )
            }
    }
}
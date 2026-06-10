package com.example.ecofy.ui.map

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.example.ecofy.R
import com.example.ecofy.data.model.local.TokenManager
import com.example.ecofy.data.model.user.City
import com.example.ecofy.ui.MainActivity
import com.example.ecofy.ui.map.LocationViewModel
import com.example.ecofy.ui.ViewModelFactory

class CityActivity : AppCompatActivity() {

    private lateinit var viewModel: LocationViewModel
    private lateinit var adapter: ArrayAdapter<String>
    private lateinit var cityInput: AutoCompleteTextView

    private var isItemSelected = false

    private var citiesList: List<City> = emptyList()
    private var selectedCity: City? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_city)

        val tokenManager = TokenManager(this)

        viewModel = ViewModelProvider(
            this,
            ViewModelFactory(tokenManager)
        )[LocationViewModel::class.java]

        cityInput = findViewById(R.id.cityInput)

        adapter = ArrayAdapter(
            this,
            android.R.layout.simple_dropdown_item_1line,
            mutableListOf()
        )

        cityInput.setAdapter(adapter)
        cityInput.threshold = 1

        cityInput.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                if (isItemSelected) {
                    isItemSelected = false
                    return
                }

                val query = s?.toString()?.trim() ?: return
                selectedCity = null
                viewModel.searchCities(query)
            }

            override fun afterTextChanged(s: Editable?) {}
        })

        cityInput.setOnItemClickListener { _, _, position, _ ->
            val city = citiesList.getOrNull(position) ?: return@setOnItemClickListener

            isItemSelected = true
            selectedCity = city
            viewModel.selectCity(city)

            cityInput.setText(city.name, false)
            cityInput.dismissDropDown()
        }

        findViewById<Button>(R.id.button_save).setOnClickListener {
            Log.d("CITY_DEBUG", "selectedCity = $selectedCity")

            val city = selectedCity

            if (city != null) {
                viewModel.selectCity(city)
                viewModel.saveCity()
            } else {
                Toast.makeText(
                    this,
                    "Оберіть місто зі списку",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
        findViewById<TextView>(R.id.link_to_reg).setOnClickListener {
            finish()
        }

        viewModel.cities.observe(this) { cities: List<City> ->
            citiesList = cities

            val names = cities.map { it.name }

            adapter.clear()
            adapter.addAll(names)
            adapter.notifyDataSetChanged()

            if (names.isNotEmpty()) {
                cityInput.showDropDown()
            }
        }

        viewModel.updateSuccess.observe(this) { city: City? ->
            city ?: return@observe

            val intent = Intent(this, MainActivity::class.java).apply {
                putExtra("city_id", city.id)
                putExtra("city_name", city.name)
                putExtra("city_latitude", city.latitude)
                putExtra("city_longitude", city.longitude)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }

            startActivity(intent)
        }

        viewModel.error.observe(this) { message ->
            Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
        }

        viewModel.validationError.observe(this) { message ->
            Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
        }
    }
}
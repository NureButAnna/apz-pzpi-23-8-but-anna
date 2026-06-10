package com.example.ecofy.ui.tips

import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.widget.TextView
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.ecofy.R
import com.example.ecofy.data.network.RetrofitClient
import com.example.ecofy.ui.navigation.BottomNavManager
import com.example.ecofy.ui.navigation.Tab
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class TipsActivity : AppCompatActivity() {

    private lateinit var adapter: TipsAdapter
    private var selectedCategory: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_tips)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, 0)
            insets
        }

        BottomNavManager(this).apply {
            setup()
            setActive(Tab.TIPS)
        }

        adapter = TipsAdapter()
        findViewById<RecyclerView>(R.id.rvTips).apply {
            layoutManager = LinearLayoutManager(this@TipsActivity)
            adapter = this@TipsActivity.adapter
        }

        loadCategories()
        loadTips(null)
    }

    private fun loadCategories() {
        CoroutineScope(Dispatchers.Main).launch {
            try {
                val response = RetrofitClient.api.getTipCategories()
                if (response.isSuccessful) {
                    val categories = response.body() ?: return@launch
                    setupCategoryButtons(categories)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun setupCategoryButtons(categories: List<String>) {
        val grid = findViewById<LinearLayout>(R.id.categoryGrid)
        grid.removeAllViews()

        val allBtn = createCategoryButton("Всі", selectedCategory == null)
        allBtn.setOnClickListener {
            selectedCategory = null
            updateCategoryButtons(grid, null)
            loadTips(null)
        }
        grid.addView(allBtn)

        categories.forEach { category ->
            val btn = createCategoryButton(category, selectedCategory == category)
            btn.setOnClickListener {
                selectedCategory = category
                updateCategoryButtons(grid, category)
                loadTips(category)
            }
            grid.addView(btn)
        }
    }

    private fun updateCategoryButtons(grid: LinearLayout, selected: String?) {
        for (i in 0 until grid.childCount) {
            val btn = grid.getChildAt(i) as? TextView ?: continue
            val isSelected = if (selected == null) btn.text == "Всі"
            else btn.text == selected
            updateButtonStyle(btn, isSelected)
        }
    }
    private fun createCategoryButton(text: String, isSelected: Boolean): TextView {
        val btn = LayoutInflater.from(this)
            .inflate(R.layout.item_category_button, null) as TextView
        btn.text = text
        updateButtonStyle(btn, isSelected)
        return btn
    }

    private fun updateButtonStyle(btn: TextView, isSelected: Boolean) {
        if (isSelected) {
            btn.setBackgroundResource(R.drawable.tag_green_filled)
            btn.setTextColor(Color.WHITE)
        } else {
            btn.setBackgroundResource(R.drawable.tag_green)
            btn.setTextColor(Color.parseColor("#41B87A"))
        }
    }

    private fun loadTips(category: String?) {
        CoroutineScope(Dispatchers.Main).launch {
            try {
                val response = RetrofitClient.api.getTips(category)
                if (response.isSuccessful) {
                    adapter.submitList(response.body() ?: emptyList())
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
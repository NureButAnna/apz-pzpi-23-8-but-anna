package com.example.ecofy.ui.notifications

import android.os.Bundle
import android.widget.ImageButton
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.ecofy.R
import com.example.ecofy.data.model.local.TokenManager
import com.example.ecofy.data.model.notification.Notification
import com.example.ecofy.data.model.notification.NotificationItem
import com.example.ecofy.data.network.RetrofitClient
import com.example.ecofy.data.repository.NotificationRepository
import kotlinx.coroutines.launch
class NotificationsActivity : AppCompatActivity() {

    private lateinit var adapter: NotificationsAdapter
    private lateinit var viewModel: NotificationsViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_notifications)

        // ← додай ці три рядки
        val repository = NotificationRepository(RetrofitClient.api)
        viewModel = ViewModelProvider(this, NotificationsViewModelFactory(repository))
            .get(NotificationsViewModel::class.java)

        findViewById<ImageButton>(R.id.btnBack).setOnClickListener { finish() }

        adapter = NotificationsAdapter(mutableListOf())
        findViewById<RecyclerView>(R.id.rvNotifications).apply {
            layoutManager = LinearLayoutManager(this@NotificationsActivity)
            this.adapter = this@NotificationsActivity.adapter
        }

        viewModel.notifications.observe(this) { items ->
            adapter.updateData(items)
        }

        viewModel.error.observe(this) { message ->
            Toast.makeText(this, message, Toast.LENGTH_LONG).show()
        }

        val token = TokenManager(this).getToken() ?: return
        viewModel.loadNotifications(token)
    }
}
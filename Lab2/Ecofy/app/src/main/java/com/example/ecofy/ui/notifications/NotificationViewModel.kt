package com.example.ecofy.ui.notifications

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.ecofy.data.model.notification.NotificationItem
import com.example.ecofy.data.repository.NotificationRepository
import kotlinx.coroutines.launch

class NotificationsViewModel(
    private val repository: NotificationRepository
) : ViewModel() {

    private val _notifications = MutableLiveData<List<NotificationItem>>()
    val notifications: LiveData<List<NotificationItem>> = _notifications

    private val _error = MutableLiveData<String>()
    val error: LiveData<String> = _error

    fun loadNotifications(token: String) {
        viewModelScope.launch {
            try {
                val items = repository.getNotifications(token)
                _notifications.value = items
            } catch (e: Exception) {
                _error.value = e.message
            }
        }
    }
}
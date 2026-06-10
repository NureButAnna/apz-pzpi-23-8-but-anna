package com.example.ecofy.data.repository

import com.example.ecofy.data.model.notification.Notification
import com.example.ecofy.data.model.notification.NotificationItem
import com.example.ecofy.data.network.ApiService

class NotificationRepository(private val api: ApiService) {

    suspend fun getNotifications(token: String): List<NotificationItem> {
        val bearer = "Bearer $token"
        val notifications = mutableListOf<Notification>()

        val containerResponse = api.getNewContainerNotifications(bearer)
        val collectionResponse = api.getCollectionNotifications(bearer)

        if (containerResponse.isSuccessful)
            notifications.addAll(containerResponse.body() ?: emptyList())

        if (collectionResponse.isSuccessful)
            notifications.addAll(collectionResponse.body() ?: emptyList())

        return notifications
            .sortedByDescending { it.created_at }
            .map {
                NotificationItem(
                    message = it.message,
                    type = it.message_type,
                    createdAt = it.created_at
                )
            }
    }
}
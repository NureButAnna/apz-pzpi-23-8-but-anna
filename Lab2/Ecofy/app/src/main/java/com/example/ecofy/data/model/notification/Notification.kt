package com.example.ecofy.data.model.notification

data class Notification(
    val notification_id: Int,
    val message: String,
    val message_type: String,
    val created_at: String,
    val user_id: Int,
    val container_id: Int?,
    val container_site_id: Int?
)


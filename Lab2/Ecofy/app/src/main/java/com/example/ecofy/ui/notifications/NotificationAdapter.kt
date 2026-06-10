package com.example.ecofy.ui.notifications

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.ecofy.R
import com.example.ecofy.data.model.notification.NotificationItem

class NotificationsAdapter(
    private var notifications: List<NotificationItem>
) : RecyclerView.Adapter<NotificationsAdapter.NotificationViewHolder>() {

    class NotificationViewHolder(itemView: View) :
        RecyclerView.ViewHolder(itemView) {

        val tvType: TextView =
            itemView.findViewById(R.id.tvType)

        val tvMessage: TextView =
            itemView.findViewById(R.id.tvMessage)

        val tvCreatedAt: TextView =
            itemView.findViewById(R.id.tvCreatedAt)
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): NotificationViewHolder {

        val view = LayoutInflater.from(parent.context)
            .inflate(
                R.layout.item_notification,
                parent,
                false
            )

        return NotificationViewHolder(view)
    }

    override fun onBindViewHolder(
        holder: NotificationViewHolder,
        position: Int
    ) {

        val notification = notifications[position]

        holder.tvMessage.text = notification.message
        holder.tvCreatedAt.text = notification.createdAt

        holder.tvType.text = when (notification.type) {
            "new_container_site" -> "📍 Новий пункт збору"
            "waste_collection" -> "♻️ Вивезення відходів"
            else -> "🔔 Сповіщення"
        }
    }

    override fun getItemCount(): Int = notifications.size

    fun updateData(
        newNotifications: List<NotificationItem>
    ) {
        notifications = newNotifications
        notifyDataSetChanged()
    }
}
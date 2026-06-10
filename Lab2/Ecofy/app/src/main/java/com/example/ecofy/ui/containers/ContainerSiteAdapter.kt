package com.example.ecofy.ui.containers

import android.content.res.ColorStateList
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.ecofy.R
import com.example.ecofy.data.model.container.ContainerSiteCard

class ContainerSiteAdapter(
    private var items: List<ContainerSiteCard> = emptyList()
) : RecyclerView.Adapter<ContainerSiteAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tagsLayout: LinearLayout = view.findViewById(R.id.tagsLayout)
        val tvAddress: TextView = view.findViewById(R.id.tvAddress)
        val tvCollection: TextView = view.findViewById(R.id.tvCollection)
        val tvContainerCount: TextView = view.findViewById(R.id.tvContainerCount)
        val tvFillPercent: TextView = view.findViewById(R.id.tvFillPercent)
        val progressBar: ProgressBar = view.findViewById(R.id.progressFill)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_container_site, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = items[position]

        holder.tvAddress.text = item.address
        holder.tvCollection.text = "Вивіз: незабаром"

        // Кількість контейнерів
        val count = item.containerCount
        holder.tvContainerCount.text = "$count контейнер${
            when {
                count % 10 == 1 && count % 100 != 11 -> ""
                count % 10 in 2..4 && count % 100 !in 12..14 -> "и"
                else -> "ів"
            }
        }"

        // Рівень заповнення
        val fill = item.avgFillLevel
        holder.tvFillPercent.text = "$fill%"
        holder.progressBar.progress = fill

        val tintColor = when {
            fill >= 80 -> Color.parseColor("#F39C12")
            fill >= 50 -> Color.parseColor("#E5B93D")
            else -> Color.parseColor("#41B87A")
        }
        holder.tvFillPercent.setTextColor(tintColor)
        holder.progressBar.progressTintList = ColorStateList.valueOf(tintColor)

        // Теги типів відходів
        holder.tagsLayout.removeAllViews()
        item.wasteTypes.forEach { type ->
            val tag = TextView(holder.itemView.context).apply {
                text = type
                textSize = 12f
                setPadding(24, 8, 24, 8)
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { marginEnd = 8 }
            }
            val (bgRes, color) = when (type.lowercase()) {
                "скло" -> Pair(R.drawable.tag_green, "#41B87A")
                "папір" -> Pair(R.drawable.tag_blue, "#5D9CEC")
                "пластик" -> Pair(R.drawable.tag_yellow, "#E5B93D")
                else -> Pair(R.drawable.tag_green, "#41B87A")
            }
            tag.setBackgroundResource(bgRes)
            tag.setTextColor(Color.parseColor(color))
            holder.tagsLayout.addView(tag)
        }
    }

    override fun getItemCount() = items.size

    fun submitList(newItems: List<ContainerSiteCard>) {
        items = newItems
        notifyDataSetChanged()
    }
}
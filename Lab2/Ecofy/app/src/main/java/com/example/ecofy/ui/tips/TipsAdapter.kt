package com.example.ecofy.ui.tips

import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.ecofy.R
import com.example.ecofy.data.model.tip.Tip

class TipsAdapter(
    private var items: List<Tip> = emptyList()
) : RecyclerView.Adapter<TipsAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val categoryBar: View = view.findViewById(R.id.categoryBar)
        val tvCategory: TextView = view.findViewById(R.id.tvCategory)
        val tvTitle: TextView = view.findViewById(R.id.tvArticleTitle)
        val tvDescription: TextView = view.findViewById(R.id.tvDescription)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_tip, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val tip = items[position]
        holder.tvCategory.text = tip.category ?: ""
        holder.tvTitle.text = tip.title
        holder.tvDescription.text = tip.content ?: ""

        val (barColor, bgColor, textColor, tagBg) = when (tip.category?.lowercase()) {
            "скло" -> arrayOf("#2196F3", "#EEF6FF", "#2196F3", "#DCEFFE")
            "папір" -> arrayOf("#FF9800", "#FFF8EE", "#FF9800", "#FFE0B2")
            "пластик" -> arrayOf("#4CAF50", "#F0FFF4", "#4CAF50", "#C8E6C9")
            "метал" -> arrayOf("#9E9E9E", "#F5F5F5", "#9E9E9E", "#E0E0E0")
            else -> arrayOf("#4CAF50", "#F0FFF4", "#4CAF50", "#C8E6C9")
        }

        val parsedBar = Color.parseColor(barColor)
        val parsedBg = Color.parseColor(bgColor)
        val parsedText = Color.parseColor(textColor)

        // Смужка
        holder.categoryBar.setBackgroundColor(parsedBar)

        // Фон картки
        holder.itemView.setBackgroundColor(parsedBg)

        // Текст категорії
        holder.tvCategory.setTextColor(parsedText)

        // Фон тегу категорії
        val tagDrawable = GradientDrawable().apply {
            shape = GradientDrawable.RECTANGLE
            cornerRadius = 20f
            setColor(Color.parseColor(tagBg))
        }
        holder.tvCategory.background = tagDrawable
    }
    override fun getItemCount() = items.size

    fun submitList(newItems: List<Tip>) {
        items = newItems
        notifyDataSetChanged()
    }
}
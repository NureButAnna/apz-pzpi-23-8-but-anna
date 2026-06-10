package com.example.ecofy.data.model.tip

data class Tip(
    val tip_id: Int,
    val title: String,
    val content: String?,
    val category: String?,
    val image_url: String?,
    val is_published: Boolean
)
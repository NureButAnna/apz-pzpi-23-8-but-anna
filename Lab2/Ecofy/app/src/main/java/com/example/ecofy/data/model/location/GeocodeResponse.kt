package com.example.ecofy.data.model.location

data class GeocodeResponse(
    val features: List<Feature>
)

data class Feature(
    val properties: Properties
)

data class Properties(
    val name: String,
    val category: String
)
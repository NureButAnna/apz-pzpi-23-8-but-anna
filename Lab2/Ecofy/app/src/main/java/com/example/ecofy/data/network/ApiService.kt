package com.example.ecofy.data.network

import com.example.ecofy.data.model.reg.UserCreate
import com.example.ecofy.data.model.reg.RegisterResponse
import com.example.ecofy.data.model.auth.LoginResponse
import com.example.ecofy.data.model.auth.MeResponse

import com.example.ecofy.data.model.user.UserResponse
import com.example.ecofy.data.model.container.ContainerSite
import com.example.ecofy.data.model.container.ContainerStatus
import com.example.ecofy.data.model.location.GeocodeResponse
import com.example.ecofy.data.model.notification.Notification
import com.example.ecofy.data.model.tip.Tip
import com.example.ecofy.data.model.user.City
import com.example.ecofy.data.model.user.UpdateCity
import com.example.ecofy.data.model.user.UserUpdate

import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    /** Авторизація **/

    @FormUrlEncoded
    @POST("auth/login")
    suspend fun login(
        @Field("username") email: String,
        @Field("password") password: String
    ): Response<LoginResponse>


    /** Отримання поточного користувача **/

    @GET("auth/me")
    suspend fun getMe(
        @Header("Authorization") token: String
    ): Response<MeResponse>


    /** Реєстрація **/

    @POST("users/register")
    suspend fun register(
        @Body user: UserCreate
    ): Response<RegisterResponse>


    /** Контейнерні майданчики **/

    @GET("users/container-sites")
    suspend fun getContainerSites(
        @Header("Authorization") token: String,
        @Query("waste_type") wasteType: String? = null
    ): Response<List<ContainerSite>>


    /** Статус контейнерів **/

    @GET("users/containers/status")
    suspend fun getContainerStatus(
        @Header("Authorization") token: String
    ): Response<List<ContainerStatus>>


    /** Повідомлення **/

    @GET("users/notifications/container-sites")
    suspend fun getNewContainerNotifications(
        @Header("Authorization") token: String
    ): Response<List<Notification>>

    @GET("users/notifications/collection")
    suspend fun getCollectionNotifications(
        @Header("Authorization") token: String
    ): Response<List<Notification>>


    /** Користувач **/

    @GET("users/{user_id}")
    suspend fun getUser(
        @Header("Authorization") token: String,
        @Path("user_id") userId: Int
    ): Response<UserResponse>

    @PUT("users/{user_id}")
    suspend fun updateUser(
        @Header("Authorization") token: String,
        @Path("user_id") userId: Int,
        @Body data: UserCreate
    ): Response<UserResponse>

    @GET("data-api/5.0/uk/geocode.json")
    suspend fun searchLocations(

        @Query("text")
        text: String,

        @Query("limit")
        limit: Int = 10,

        @Query("country")
        country: String = "UA",

        @Query("categories")
        categories: String = "settlement",

        @Query("key")
        key: String

    ): Response<GeocodeResponse>

    @GET("cities/search")
    suspend fun searchCities(
        @Query("query") query: String
    ): Response<List<City>>

    @PATCH("users/{user_id}/city")
    suspend fun updateUserCity(
        @Header("Authorization") token: String,
        @Path("user_id") userId: Int,
        @Body request: UpdateCity
    ): Response<UserResponse>

    @GET("tips/")
    suspend fun getTips(
        @Query("category") category: String? = null
    ): Response<List<Tip>>

    @PUT("users/{user_id}")
    suspend fun updateUser(
        @Header("Authorization") token: String,
        @Path("user_id") userId: Int,
        @Body data: UserUpdate
    ): Response<UserResponse>
    @GET("tips/categories")
    suspend fun getTipCategories(): Response<List<String>>

}
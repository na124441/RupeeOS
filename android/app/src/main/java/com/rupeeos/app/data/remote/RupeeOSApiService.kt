package com.rupeeos.app.data.remote

import kotlinx.serialization.Serializable
import retrofit2.Response
import retrofit2.http.*

@Serializable
data class SyncPayloadDto(
    val version: String = "1.0.0",
    val monthKey: String,
    val availableMoney: Long,
    val allocations: Map<String, Long>,
    val transactions: List<TransactionDto>,
    val essentials: List<EssentialDto>
)

@Serializable
data class TransactionDto(
    val id: String,
    val type: String,
    val amount: Long,
    val categoryId: String,
    val note: String,
    val date: String,
    val merchant: String? = null
)

@Serializable
data class EssentialDto(
    val id: String,
    val name: String,
    val quantity: String,
    val unit: String,
    val estimatedCost: Long,
    val actualCost: Long? = null,
    val isPurchased: Boolean,
    val preferredProvider: String,
    val categoryId: String
)

@Serializable
data class SyncResponseDto(
    val success: Boolean,
    val message: String,
    val serverTimestamp: Long
)

interface RupeeOSApiService {
    @GET("api/v1/plans/{monthKey}")
    suspend fun getMonthlyPlan(@Path("monthKey") monthKey: String): Response<SyncPayloadDto>

    @POST("api/v1/sync")
    suspend fun syncData(@Body payload: SyncPayloadDto): Response<SyncResponseDto>

    @POST("api/v1/transactions")
    suspend fun postTransaction(@Body transaction: TransactionDto): Response<TransactionDto>
}

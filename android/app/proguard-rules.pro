# RupeeOS Proguard Rules
-keepattributes *Annotation*
-keepclassmembers class * {
    @androidx.room.* <methods>;
    @androidx.room.* <fields>;
}
-keep class * extends androidx.room.RoomDatabase
-dontwarn kotlinx.serialization.**

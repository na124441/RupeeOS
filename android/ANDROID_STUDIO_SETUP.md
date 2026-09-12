# RupeeOS: Android Studio Setup & Manual Execution Guide

This document contains step-by-step instructions for opening, configuring, building, running, and debugging the native **RupeeOS Android Companion App** manually inside **Android Studio**.

> [!NOTE]
> All source code, Gradle configurations, Room SQLite database migrations, and Jetpack Compose screens have been created for you. You do **not** need to generate code from scratch. Simply follow these steps to launch the app on your emulator or physical Android device.

---

## 1. Prerequisites & System Requirements

| Tool | Recommended Version | Minimum Version |
| :--- | :--- | :--- |
| **Android Studio** | **Android Studio Ladybug (2024.2.1+)** or **Koala Feature Drop (2024.1.2+)** | Android Studio Iguana (2023.2.1) |
| **JDK (Java Development Kit)** | **OpenJDK 17** or **OpenJDK 21** (bundled with Android Studio as `jbr-17` or `jbr-21`) | JDK 17 |
| **Android SDK Platform** | **Android 15 (API 35)** | Android 8.0 (API 26) |
| **Android Build-Tools** | `35.0.0` | `34.0.0` |
| **Gradle** | `8.9` (automatically handled by Gradle Wrapper) | `8.7` |

---

## 2. Step-by-Step: Opening the Project in Android Studio

1. Launch **Android Studio**.
2. On the Welcome Screen, click **Open** (or go to **File $\rightarrow$ Open...**).
3. In the file picker, browse to:
   ```text
   e:\RuppeOS\android
   ```
   > [!IMPORTANT]
   > Make sure to select the **`android`** folder itself (not the root `e:\RuppeOS` web folder). The `android` folder contains `settings.gradle.kts` and `build.gradle.kts`.
4. Click **OK** / **Open**.
5. Android Studio will open the project and automatically begin the **Initial Gradle Sync**.

---

## 3. Verifying JDK & SDK Configuration

If Android Studio prompts for JDK configuration or if sync encounters JDK version mismatches:

1. Open **File $\rightarrow$ Settings...** (on macOS: **Android Studio $\rightarrow$ Settings...**).
2. Navigate to:
   ```text
   Build, Execution, Deployment → Build Tools → Gradle
   ```
3. Under **Gradle JDK**, verify that either:
   - **`Embedded JDK (version 17 or 21)`** is selected, OR
   - A local **JDK 17 / JDK 21** installation is selected.
4. Navigate to:
   ```text
   Languages & Frameworks → Android SDK
   ```
5. In the **SDK Platforms** tab, ensure **Android 15.0 ("VanillaIceCream") / API Level 35** is checked.
6. In the **SDK Tools** tab, verify:
   - Android SDK Build-Tools 35
   - Android SDK Platform-Tools
   - Android Emulator
7. Click **Apply** $\rightarrow$ **OK**.

---

## 4. Performing Gradle Sync

1. In the top-right toolbar of Android Studio, click the **Sync Project with Gradle Files** icon (the elephant with a blue circular arrow), or go to:
   ```text
   File → Sync Project with Gradle Files
   ```
2. Open the **Build** tab at the bottom to monitor the sync progress.
3. **Expected Result**:
   ```text
   BUILD SUCCESSFUL in 15s - 30s
   ```
   The Project tool window on the left will now display the project tree under the **Android** view (`app`, `manifests`, `java`, `res`).

---

## 5. Setting Up an Android Emulator

To test the application on an emulator:

1. In Android Studio, open the **Device Manager** (icon in top-right toolbar, or **Tools $\rightarrow$ Device Manager**).
2. Click **Create Virtual Device** (`+`).
3. Select **Phone**:
   - Recommended hardware: **Pixel 8** or **Pixel 7** (Medium phone, $1080 \times 2400$).
4. Click **Next**.
5. In the **System Image** list, select:
   - **VanillaIceCream (API 35)** with `x86_64` (Google Play), OR
   - **UpsideDownCake (API 34)**.
6. Click **Download** if the image is not yet installed, then click **Next**.
7. Name the AVD (e.g. `Pixel 8 API 35`) and click **Finish**.
8. In Device Manager, click the green **Play ($\blacktriangleright$)** button next to your virtual device to boot the emulator.

---

## 6. Connecting a Physical Android Device (Alternative)

1. On your Android phone, enable **Developer Options**:
   - Go to **Settings $\rightarrow$ About Phone** $\rightarrow$ tap **Build Number** 7 times.
2. Go to **Settings $\rightarrow$ System / Additional Settings $\rightarrow$ Developer Options**:
   - Enable **USB Debugging**.
3. Connect your phone to your PC via a USB cable.
4. When prompted on your phone screen, check *"Always allow from this computer"* and tap **Allow**.
5. In Android Studio's target device dropdown in the top toolbar, your device model will appear.

---

## 7. Running the Application

1. In the top toolbar, ensure **`app`** is selected in the run configuration dropdown.
2. Ensure your target device (emulator or physical phone) is selected in the device selector.
3. Click the green **Run ($\blacktriangleright$)** button (or press `Shift + F10`).
4. Android Studio will compile the Kotlin sources, run KSP Room annotation processing, generate the APK, install it on the device, and launch `MainActivity`.

---

## 8. What You Should See on First Launch

1. **Dashboard / Home Screen**:
   - **Active Month**: Displays current month (e.g. `September 2026`).
   - **Hero Card**: **"SAFE TO SPEND TODAY"** showing the daily burn rate (e.g. `₹580 / day`).
   - **Metrics Row**: 4 cards showing Available, Spent, Committed, and Flexible Pool.
   - **Quick Actions**: 1-tap buttons for `+ Expense`, `+ Income`, and `What-If?`.
   - **Recent Transactions**: Sample ledger entries with category indicators.
2. **Bottom Navigation**:
   - **Home**: Financial command center
   - **Budget**: Zero-based category allocation cards with 1-tap **50/30/20 Rule**
   - **Center (+) FAB**: Opens the rapid **Quick Expense Bottom Sheet**
   - **Essentials**: Grocery checklist with instant Blinkit/Zepto deep links and actual price confirmation dialog
   - **Insights**: Financial Health Score (0–100) and spending velocity

---

## 9. Running Unit Tests from Android Studio

To verify financial formulas and invariants without launching the UI:

1. In the Project tool window, expand:
   ```text
   app → java → com.rupeeos.app (test) → domain.usecase → CalculateSafeSpendUseCaseTest
   ```
2. Right-click `CalculateSafeSpendUseCaseTest` and select **Run 'CalculateSafeSpendUseCaseTest'** (or press `Ctrl + Shift + F10`).
3. **Expected Result**:
   - All tests pass with green checkmarks:
     - `testSafeDailySpendCalculation()`: PASS
     - `testFlexibleMoneyNeverDropsBelowZero()`: PASS

---

## 10. Inspecting Logcat

To view debug logs and database operations:

1. Open the **Logcat** tool window at the bottom (`Alt + 6`).
2. In the filter bar at the top, type:
   ```text
   package:mine
   ```
3. When you record transactions or check off essentials, Logcat will stream UI state transitions and Room database commits.

---

## 11. Troubleshooting Common Gradle & Build Issues

### Issue 1: "Unsupported class file major version" or "Java version mismatch"
- **Cause**: Gradle 8.9 requires JDK 17 or JDK 21. If Android Studio is using Java 8, 11, or 23, it will fail.
- **Fix**: Go to **File $\rightarrow$ Settings $\rightarrow$ Build, Execution, Deployment $\rightarrow$ Build Tools $\rightarrow$ Gradle**. Change **Gradle JDK** to **Embedded JDK (jbr-17 or jbr-21)**. Click **Apply** and re-sync.

### Issue 2: "Android SDK location not found"
- **Cause**: Missing `local.properties` specifying `sdk.dir`.
- **Fix**: Android Studio automatically creates this when opening the project. If missing, create a file named `local.properties` in `e:\RuppeOS\android\` with:
  ```properties
  sdk.dir=C\:\\Users\\nayan\\AppData\\Local\\Android\\Sdk
  ```
  *(Adjust the path to match your user directory if different).*

### Issue 3: KSP or Room compilation warnings
- **Cause**: First-time KSP index building.
- **Fix**: Run **Build $\rightarrow$ Clean Project**, then **Build $\rightarrow$ Rebuild Project**.

---

## 12. Backend Cloud Sync Configuration (Optional)

RupeeOS is **100% functional offline** with local SQLite storage. If you later run a local backend or cloud API:

1. Open `android/app/src/main/java/com/rupeeos/app/data/remote/RupeeOSApiService.kt`.
2. Configure the Retrofit `baseUrl` to point to your development server:
   - For Android Emulator to host PC: `http://10.0.2.2:8000/`
   - For Physical Device on same Wi-Fi: `http://192.168.x.x:8000/`
   - For Production HTTPS: `https://api.yourdomain.com/`

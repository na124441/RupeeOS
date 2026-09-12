# RupeeOS Android: Architecture & Data Flow Specification

## 1. Architectural Philosophy

The **RupeeOS Android Companion App** follows Google's official Android Architecture Guide, adhering to **Clean Architecture** and **Unidirectional Data Flow (UDF)**.

```
┌────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                   │
│   Jetpack Compose UI  ◄──── StateFlow ──── ViewModels   │
│            │                                  │        │
│            ▼ User Actions                     ▼        │
├────────────────────────────────────────────────────────┤
│                      DOMAIN LAYER                      │
│   Use Cases (CalculateSafeSpend, RecordExpense,        │
│              ToggleEssential, SimulatePurchase)        │
│   Domain Models (MonthlyPlan, Transaction, Essential)  │
│   Repository Interface (FinanceRepository)             │
├────────────────────────────────────────────────────────┤
│                       DATA LAYER                       │
│   FinanceRepositoryImpl (Local-First Offline Sync)     │
│            │                                  │        │
│            ▼                                  ▼        │
│   Local DataSource (Room)            Remote DataSource │
│   SQLite (`rupeeos.db`)               Retrofit API     │
└────────────────────────────────────────────────────────┘
```

---

## 2. Layer Responsibilities

### Presentation Layer (`com.rupeeos.app.presentation`)
- **Declarative UI**: Built 100% in **Jetpack Compose** with Material 3 components.
- **State Preservation**: Uses `MainViewModel` with `StateFlow<MainUiState>`, surviving screen rotations and system configuration changes.
- **Navigation**: Implements single-activity typed navigation via `Navigation Compose`.
- **Rapid Actions**: Fast numeric bottom sheets (`AddExpenseSheet`) designed to achieve sub-10-second transaction entries.

### Domain Layer (`com.rupeeos.app.domain`)
- **Framework Independence**: Pure Kotlin code with zero Android dependencies, making financial logic testable in pure JVM unit tests.
- **Invariants & Use Cases**:
  - `CalculateSafeSpendUseCase`: Encapsulates the safe daily burn algorithm.
  - `RecordExpenseUseCase`: Enforces transaction validation and category binding.
  - `ToggleEssentialUseCase`: Bridges grocery item purchase with automated expense creation.
  - `SimulatePurchaseUseCase`: Predicts the exact impact on safe daily burn without persisting data.

### Data Layer (`com.rupeeos.app.data`)
- **Local-First SQLite (`Room`)**: Room DAOs emit continuous `Flow<List<T>>` streams. Any database change automatically triggers UI re-composition without manual polling.
- **Pre-Population Callback**: Seeds initial demo data on initial database creation so the app opens with rich context.
- **Cloud Readiness**: `RupeeOSApiService` defines standard REST DTOs and endpoints for future synchronization.

---

## 3. Financial Invariants & Mathematical Model

The core value proposition of RupeeOS is providing constant clarity on **"How much money can I safely spend today?"**

```
Total Monthly Available ($M_{\text{inflow}}$)
   ├── Minus: Month-to-date Outflow ($S_{\text{total}}$)
   │     └── = Remaining Balance ($B_{\text{rem}} = \max(0, M_{\text{inflow}} - S_{\text{total}})$)
   │
   └── Minus: Known Upcoming Commitments ($C_{\text{upcoming}}$)
         ├── Unpurchased Essentials ($E_{\text{pending}}$)
         └── Upcoming Active Subscriptions ($R_{\text{pending}}$)
         └── = Flexible Spending Pool ($F_{\text{flex}} = \max(0, B_{\text{rem}} - C_{\text{upcoming}})$)
```

$$\text{Safe Daily Spend} = \left\lfloor \frac{F_{\text{flex}}}{\max(1, D_{\text{rem}})} \right\rfloor$$

$$\text{Weekly Safe Budget} = \text{Safe Daily Spend} \times 7$$

---

## 4. Local Database Schema (`RupeeOSDatabase`)

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│          transactions           │       │          monthly_plans          │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ PK  id               TEXT       │       │ PK  monthKey         TEXT       │
│     type             TEXT       │       │     availableMoney   INTEGER    │
│     amount           INTEGER    │       │     allocationsJson  TEXT       │
│     categoryId       TEXT       │       │     updatedAt        INTEGER    │
│     note             TEXT       │       └─────────────────────────────────┘
│     date             TEXT       │
│     merchant         TEXT       │       ┌─────────────────────────────────┐
│     essentialId      TEXT       │       │            essentials           │
│     createdAt        INTEGER    │       ├─────────────────────────────────┤
│     isSynced         INTEGER    │       │ PK  id               TEXT       │
└─────────────────────────────────┘       │     name             TEXT       │
                                          │     quantity         TEXT       │
┌─────────────────────────────────┐       │     unit             TEXT       │
│              goals              │       │     estimatedCost    INTEGER    │
├─────────────────────────────────┤       │     actualCost       INTEGER    │
│ PK  id               TEXT       │       │     isPurchased      INTEGER    │
│     name             TEXT       │       │     purchasedDate    TEXT       │
│     targetAmount     INTEGER    │       │     preferredProvider TEXT      │
│     currentAmount    INTEGER    │       │     categoryId       TEXT       │
│     targetDate       TEXT       │       │     monthKey         TEXT       │
│     category         TEXT       │       └─────────────────────────────────┘
└─────────────────────────────────┘
```

---

## 5. Navigation Graph

```
                   Scaffold
                      │
   ┌──────────────────┴──────────────────┐
   ▼                                     ▼
TopAppBar                             BottomNavBar
(Month switcher,                       (Home, Budget, Quick Add,
 Settings action)                       Essentials, Insights)
   │                                     │
   └───────────────┬─────────────────────┘
                   ▼
               NavHost
       ┌───────────┼───────────┬───────────┐
       ▼           ▼           ▼           ▼
   [HomeScreen] [Budget]  [Essentials] [Insights]
       │
       ├──► [SimulatorScreen]
       ├──► [GoalsScreen]
       └──► [SettingsScreen]
```

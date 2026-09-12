# RupeeOS 💰

> **"I tell the app how much money I have for this month, and it helps me decide where every rupee should go."**

RupeeOS is a personal financial operating system built as a responsive Progressive Web App (PWA). It converts your available monthly money into zero-based allocation buckets, manages grocery essentials with quick commerce deep-links (Blinkit, Zepto, Swiggy Instamart, Amazon India), calculates dynamic safe daily spending burn rates, tracks goals & subscriptions, simulates purchases ("What If?"), and computes an explainable **Financial Health Score (0–100)**.

---

## ✨ Features

- **🏠 Safe Spending Engine ("How much can I safely spend today?")**:
  - Dynamically calculates daily safe burn rate factoring upcoming essential commitments and recurring subscriptions.
  - Real-time weekly burn velocity tracker (`₹1,870 / ₹2,500`) and month-end projection.
- **💵 Zero-Based Monthly Money Planning**:
  - Start-of-month wizard: Set available inflow (`₹20,000`).
  - Category allocation with over-allocation warnings (`Allocated ≤ Available`).
  - One-click **Auto-Apply 50/30/20 Rule**.
  - **Mental Money Buckets Model** (*Essentials*, *Daily Living*, *Future & Safety*, *Growth & Gear*, *Flexible Buffer*).
- **🛒 Monthly Essentials & Quick Commerce Deep Links**:
  - Full checklist (e.g. Oats, Milk, Sattu, Paneer, Soap, Shampoo).
  - Direct 1-click search deep-links for **Blinkit**, **Zepto**, **Swiggy Instamart**, and **Amazon India**.
  - Ticking an essential automatically logs the expense in the ledger.
  - Reusable recurring templates for monthly staples.
- **⚡ Fast Expense Entry & Smart Categorization**:
  - Rapid entry modal with quick rupee presets (`+₹50`, `+₹100`, `+₹200`, `+₹500`, `+₹1,000`).
  - Deterministic auto-categorizer matching Indian merchants and daily keywords.
  - Desktop centered modal and mobile-first slide-up bottom sheet.
- **🧮 "What If?" Purchase Simulator**:
  - Simulate hypothetical purchases (e.g. ₹5,000) before spending.
  - Instantly reveals impact on remaining balance, category limits, and new daily burn rate with clear verdict badges (🟢 Affordable, 🟡 Tight, 🔴 Not Recommended).
- **🎯 Sinking Funds & Savings Goals**:
  - Dedicated asset targets (e.g. *RTX Laptop*, *Emergency Reserve*, *Vacations*) with progress bars and direct deposits.
- **🔁 Subscriptions & Fixed Commitments Tracker**:
  - Manage Netflix, Spotify, Cloud, Broadband with relative due notices (*"Tomorrow"*, *"In 3 days"*).
- **📅 Spending Heatmap Calendar**:
  - Monthly calendar showing daily spending intensity with interactive day inspector.
- **🧠 Financial Health Score (0–100)**:
  - Transparent, explainable scoring breakdown (Budget Adherence, Savings Rate, Obligations Buffer, Spending Sustainability, Goal Progress).
- **🌓 Design System & Motion**:
  - Multi-tier obsidian dark mode + high-contrast light mode.
  - GSAP-powered animated numbers (`AnimatedNumber`), smooth page entrance reveals, and micro-interactions.
  - Tabular financial typography (`font-feature-settings: 'tnum' 1`).
- **🔐 Local-First Privacy & Data Portability**:
  - 100% private: stored in local storage with zero cloud tracking or telemetry.
  - 1-click **Full JSON Backup & Restore** and **CSV Exports** (Transactions & Essentials).

---

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Custom CSS Variables Design Tokens
- **Motion & Animations:** GSAP 3
- **Icons:** Lucide React
- **Architecture:** Local-first Repository Pattern + Context API

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
git clone https://github.com/na124441/RupeeOS.git
cd RupeeOS
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📱 Mobile PWA Installation
Open the app URL in Chrome or Safari on your phone and select **"Add to Home Screen"** to install RupeeOS as a native-feeling standalone app.

---

## 📄 License
MIT License.

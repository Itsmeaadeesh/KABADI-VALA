# Kabadiwala Connect (कबाड़ीवाला कनेक्ट)

> **“From Kabadiwala to Circular Economy — Bringing the Informal Collector into the Formal Recycling Chain”**

**Smart India Hackathon Problem Statement ID**: `26229`  
**Issuing Authority**: Ministry of Mines (MoM) / Jawaharlal Nehru Aluminium Research Development and Design Centre (JNARDDC)  
**Target Users**: Informal E-Waste Collectors (Kabadiwalas), CPCB Authorized Recyclers, Ministry & CPCB Oversight Authorities.

---

## 1. Project Overview

Over 90% of India’s electronic waste is processed through informal scrap yards where scrap pickers and kabadiwalas suffer from opaque daily rates, middleman exploitation, and severe health hazards from rudimentary dismantling (open cable burning, acid leaching). Simultaneously, India loses thousands of kilograms of strategic critical minerals (Copper, Lithium, Cobalt, Neodymium, Gold).

**Kabadiwala Connect** delivers a production-grade full-stack digital bridge:
- **Collector Mobile PWA**: Vernacular (Hindi, Marathi, English), 360px-first tactile design, voice-assisted with Web Speech synthesis, offline-first with IndexedDB replication, 3-step digital lot creator with demo AI vision classification, instant pricing calculator with strategic mineral warnings, and a digital Khata passbook.
- **Authorized Recycler Dashboard**: Real-time incoming lot queue, dynamic per-KG price management, pickup logistics dispatching, and digital handover verification with calibrated scale reconciliation.
- **Admin & Ministry Oversight**: Pan-India and Maharashtra regional heatmaps, real-time diverted e-waste tracking, critical mineral recovery analytics, unit economics calculator, and CPCB accreditation audits.

---

## 2. Key Highlights & Core Principles

| Principle | Implementation |
| :--- | :--- |
| **Simplicity** | Mobile-first 360px view with large touch targets (≥48px), icon-first visual cards, and minimal typing. |
| **Trust** | Transparent benchmark prices linked to Ministry of Mines standards; certified CPCB facility numbers. |
| **Safety** | Pictorial DOs and DONTs flashcards with audio alerts preventing toxic open-air burning and acid baths. |
| **Transparency** | Verifiable immutable digital lot codes (e.g. `LOT-2026-MH-4821`) and calibrated digital scale reconciliation. |
| **Traceability** | Complete chain-of-custody lifecycle: `CREATED` ➔ `ACCEPTED` ➔ `SCHEDULED` ➔ `VERIFIED` ➔ `PAID`. |
| **Inclusion** | Full multi-lingual dictionary in **English, हिंदी, and मराठी** with natural voice speech synthesis. |
| **Offline Resilience** | Browser IndexedDB (**Dexie.js**) storage with automatic background synchronization upon reconnection. |

---

## 3. Tech Stack

- **Frontend**:
  - React 18 + Vite + TypeScript
  - Tailwind CSS + Lucide React + Framer Motion
  - Dexie.js (IndexedDB wrapper for offline storage & sync queue)
  - Web Speech API (`SpeechSynthesis` with colloquial Hindi/Marathi voices)
  - Leaflet + OpenStreetMap + React-Leaflet
  - Recharts (Historical 7d/30d price curves, regional flows, mineral yield bars)
  - Canvas-Confetti
  - PWA Web Manifest & Service Worker
- **Backend**:
  - Node.js + Express + TypeScript (ESM)
  - SQLite (WAL mode with enforced Foreign Keys)
  - REST API with batch synchronization endpoints
- **Hardware & Environment**:
  - Windows / Linux / macOS cross-platform compatibility.

---

## 4. Quick Start & Installation

### Prerequisites
- Node.js v18+ or v24+
- npm v9+

### Setup Commands
```bash
# Clone or navigate to the repository
cd "C:\Users\Aadeesh Jain\.gemini\antigravity\scratch\kabadiwala-connect"

# Install backend dependencies
cd server
npm install

# Initialize and seed the SQLite database with realistic Indian e-waste demo data
npm run seed

# Build and start backend REST API (Runs on port 5001)
npm run build
node dist/index.js

# In a separate terminal, install and run frontend (Runs on port 5173)
cd ../client
npm install
npm run dev
```

Visit the application in your browser at:
👉 **`http://localhost:5173`**

---

## 5. Instant Demo Mode & Credentials

To enable seamless jury evaluation without real SMS or OTP setup, the application includes a top **🎬 DEMO MODE** bar:

| Role | Demo User Name | Demo Phone | Demo OTP | Default Screen |
| :--- | :--- | :--- | :--- | :--- |
| **Collector** | Ramesh Kumar (कबाड़ीवाला) | `9999999999` | `123456` | Mobile PWA Home (`/`) |
| **Recycler** | Rajesh Sharma (GreenCycle) | `8888888888` | `123456` | Operations Dashboard (`/recycler`) |
| **Admin** | Dr. S. K. Verma (JNARDDC / MoM) | `7777777777` | `123456` | National Oversight (`/admin`) |

Judges can toggle between all three roles in one click from the top header!

---

## 6. Three-Minute SIH Jury Presentation Flow

Click the top **🏆 3-Min Jury Flow** button in the app to launch the interactive 20-step checklist:

1. **Collector Login**: Switch to Ramesh (`9999999999` / `123456`).
2. **Vernacular & Voice**: Toggle language to **हिंदी** or **मराठी**, tap 🔊 **Listen** on today's price card.
3. **Sell E-Waste**: Click 📸 **SELL E-WASTE**.
4. **AI Vision Classifier**: Select the Server Motherboard image; observe the demo AI tag: *“Motherboard / PCB — 94% Confidence”*.
5. **Critical Mineral Indicator**: Note the strategic alert: *“Contains Copper (22%), Gold (250g/t), Tantalum. Do NOT burn or acid-leach!”*
6. **Tactile Weight Entry**: Use the `[-1]` `[+1]` `[-5]` `[+5]` stepper to set **12.5 KG**.
7. **Instant Pricing**: Observe live calculation: `12.5 KG × ₹425/KG = ~₹5,312`.
8. **Offline Demonstration**: Tap **🟠 Offline Sim** in the header, submit lot ➔ Note badge updates to **🟠 Offline — Saved Locally**. Tap **🟢 Online** ➔ Auto-syncs to cloud!
9. **Find Recycler**: Open map; observe 5-factor smart matching score ranking GreenCycle Recycling as **BEST MATCH**.
10. **Recycler Portal**: Switch to **Recycler** in the top bar; inspect newly created lot in the **Incoming Lots** queue.
11. **Scale Verification & Handover**: Open Handover scanner, enter verified scale weight (`12.2 KG`), adjust final payout (`₹5,185`), and confirm UPI payment.
12. **Digital Certificate**: View the CPCB-compliant official handover certificate with QR verification.
13. **Passbook (Mera Khata)**: Return to Collector; verify payment is immediately logged in monthly earnings with downloadable proof of regular income.
14. **Ministry Oversight**: Switch to **Admin**; review diverted tonnage, critical minerals recovered (Copper 92.4t, Lithium 4.8t, Cobalt 1.7t, Gold 21.4kg), and interactive Unit Economics calculator.

---

## 7. Offline-First Architecture

```text
Collector Action (Sell Lot)
        │
        ▼
IndexedDB (Dexie.js)
        ├── 1. Optimistic write to local `lots` table
        ├── 2. Enqueue mutation in `syncQueue` (UUID, timestamp)
        └── 3. Display badge: 🟠 Offline — Saved Locally
        │
Network Reconnected / Online Event
        │
        ▼
POST /api/sync/batch
        ├── Server idempotently applies mutations
        ├── Logs immutable traceability events
        └── Returns sync confirmation
        │
        ▼
IndexedDB `syncQueue` flushed ➔ Display badge: 🟢 Synced
```

---

## 8. Unit Economics Summary (100 KG Lot Example)

| Stream | Informal Channel | Formal Platform (Kabadiwala Connect) |
| :--- | :--- | :--- |
| **Gross Benchmark Value** | ₹5,000 | ₹5,500 |
| **Middleman Deduction** | -₹800 (16%) | ₹0 for collector |
| **Quality Sorting Premium** | ₹0 | +₹275 (+5% intact bonus) |
| **Platform Fee** | ₹0 | Paid by recycler (~2%) |
| **Net Collector Payout** | **₹4,200** | **₹5,775** |
| **Net Collector Gain** | - | **+₹1,575 (+37.5% net income)** |
| **Financial Inclusion** | Zero record | Certified income passbook statement |

---

## 9. Comprehensive Documentation Index

- [`/docs/architecture.md`](./docs/architecture.md): Deep-dive into technical components, database relations, and security.
- [`/docs/offline-sync.md`](./docs/offline-sync.md): Full synchronization lifecycle, Dexie schemas, and retry policies.
- [`/docs/unit-economics.md`](./docs/unit-economics.md): Detailed value leakage analysis and platform sustainability models.
- [`/docs/demo-script.md`](./docs/demo-script.md): 3-minute oral pitch script formatted for SIH jury presentation.

---

## 10. Important Mock & Demo Data Notice

All recycler authorization numbers (e.g. `CPCB/E-WASTE/2023/MH-092`), AI classification confidence scores, mineral recovery tonnage calculations, and GPS coordinates are seeded as **DEMO / MOCK DATA** for the purpose of the Smart India Hackathon prototype and do not represent verified industrial facility audits.

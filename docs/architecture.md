# Kabadiwala Connect — System Architecture Document

**Smart India Hackathon Problem Statement ID: 26229**  
**"Kabadiwala Connect – Bringing the Informal Collector into the Formal Recycling Chain"**  
Issued by: **Ministry of Mines (MoM) / Jawaharlal Nehru Aluminium Research Development and Design Centre (JNARDDC)**

---

## 1. Executive Summary & Core Mission

In India's current electronic waste ecosystem, over 90% of discarded electronics flow through informal channels—waste pickers, itinerant collectors, and informal aggregator scrap yards ("Kabadiwalas"). While these grassroots workers form an agile collection network, they suffer from:
1. Lack of transparent daily benchmark pricing, leading to exploitation by unregulated middlemen.
2. Unsafe, hazardous rudimentary dismantling (acid leaching of PCBs, cable burning, battery smashing).
3. Zero verifiable transaction records or chain of custody.
4. Total disconnect from CPCB/SPCB authorized formal recyclers and Extended Producer Responsibility (EPR) credit schemes.
5. Inability of government bodies (Ministry of Mines, JNARDDC, CPCB) to track critical mineral recovery (Copper, Lithium, Cobalt, Neodymium, Gold).

**Kabadiwala Connect** provides a tripartite digital bridge:
- **Informal Collector PWA**: Low-literacy, voice-assisted, vernacular (Hindi, Marathi, English), offline-first mobile application.
- **Authorized Recycler Portal**: Desktop lot management, dynamic price setting, pickup logistics, and digital handover verification.
- **Government Oversight Dashboard**: Real-time regional heatmaps, formalization tracking, and critical mineral recovery analytics.

---

## 2. High-Level Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT APPLICATIONS                               │
├───────────────────────┬─────────────────────────────┬───────────────────────┤
│    COLLECTOR PWA      │     RECYCLER DASHBOARD      │    ADMIN OVERSIGHT    │
│  (Mobile 360px-first) │    (Desktop Logistics)      │   (JNARDDC / MoM)     │
│                       │                             │                       │
│ • Large Touch Targets │ • Incoming Lot Queue        │ • National/State Maps │
│ • Voice Synth Engine  │ • Dynamic Per-KG Pricing    │ • Formalization KPIs  │
│ • Offline Dexie.js    │ • Pickup Dispatching        │ • Critical Minerals   │
│ • Demo AI Classifier  │ • QR Handover Verification  │ • Unit Economics Calc │
│ • Vernacular i18n     │ • CPCB Facility Profile     │ • Compliance Audits   │
└───────────▲───────────┴──────────────▲──────────────┴───────────▲───────────┘
            │                          │                          │
            ▼                          ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      OFFLINE / SYNC LAYER (COLLECTOR)                       │
│   • Dexie.js IndexedDB Schema (lots, transactions, syncQueue, priceCache)   │
│   • PWA Service Worker (Cache-first app shell, Network-first API cache)     │
│   • Background Mutation Queue (FIFO retry on online event)                  │
└──────────────────────────────────────▲──────────────────────────────────────┘
                                       │
                                   REST / JSON
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             BACKEND SERVICES                                │
│                          (Node.js + Express + TS)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Auth Controller (Mock OTP: 123456 with Role Resolution)                  │
│  • Lots Controller (Creation, Estimation, Photo metadata, Lifecycle)       │
│  • Recycler Controller (5-Factor Ranking Algorithm, Geospatial Radius)      │
│  • Pricing & History Controller (Moving averages, Anomaly Detection)        │
│  • Handover & Chain of Custody Controller (Verified Weight, UPI/Cash, QR)    │
│  • Batch Sync Controller (Reconciles offline mutation queue idempotent)    │
│  • Analytics Engine (Critical mineral yields, Tonnage, Material flows)      │
└──────────────────────────────────────▲──────────────────────────────────────┘
                                       │
                                 SQLite Engine
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        RELATIONAL DATABASE SCHEMA                           │
│  users | collectors | recyclers | materials | prices | lots | pickups        │
│  handover_records | transactions | payments | traceability | safety_guides  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Flow: From Informal Pick to Formal Recovery

```text
Step 1: Collector captures photo of e-waste component.
   │
Step 2: Lightweight AI classification suggests category (e.g. PCB - 94% confidence)
   │    and alerts on critical minerals (Cu, Au, Ta) and toxic hazards.
   │
Step 3: Collector enters weight with quick-step buttons ([-1] [+1] [-5] [+5] KG).
   │    Instant Price Estimator computes benchmark vs. recycler rate.
   │
Step 4: Unique Lot Manifest created (e.g. LOT-2026-MH-4821).
   │    If offline: Saved to IndexedDB syncQueue; UI indicates 🟠 Saved Locally.
   │    If online: Synced to SQLite; UI indicates 🟢 Synced.
   │
Step 5: Smart Recycler Matching ranks nearest CPCB authorized recyclers.
   │    Collector requests pickup or reserves guaranteed rate.
   │
Step 6: Handover & Verification. Recycler inspects lot, weighs on calibrated scale,
   │    and enters verified weight (e.g., 12.2 KG vs 12.5 KG estimated).
   │
Step 7: Instant Handover Receipt issued with QR verification & UPI reference.
   │
Step 8: Real-time ledger updates:
   │    • Collector's Mera Khata records payment.
   │    • Recycler inventory increments.
   │    • JNARDDC oversight updates critical mineral recovery & formalization stats.
```

---

## 4. Security & Privacy Philosophy

1. **Minimal Collector PII**: No Aadhaar or invasive personal biometric documents collected during demo. Only phone number and nickname/first name.
2. **Deterministic Role Segregation**: Role-based access tokens guarantee collectors cannot modify recycler buy prices, and recyclers cannot alter audit logs.
3. **Data Integrity**: Immutable `traceability_events` table appends every state transition (`CREATED`, `OFFERED`, `SCHEDULED`, `VERIFIED`, `PAID`) with timestamps, actor IDs, and physical GPS coordinates.
4. **Transparent Labelling**: All simulated components (AI classification confidence, mock CPCB numbers, estimated mineral metrics) are clearly designated as **Demo / Mock Data** in alignment with SIH evaluation guidelines.

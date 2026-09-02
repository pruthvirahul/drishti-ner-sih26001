# DRISHTI-NER: AI-Based Early Warning & Landslide Risk Monitoring System
### Ministry of Development of North Eastern Region (MDoNER) | Problem Statement: SIH26001

---

## 🌟 Executive Summary
The **North Eastern Region (NER)** of India experiences extreme seasonal precipitation and fragile geological conditions, leading to recurrent slope failures, severe loss of life, and disruption of critical economic lifelines such as **NH-6, NH-10, NH-29, and NH-13**.

**DRISHTI-NER** (*Disaster Risk Intelligence & Spatial Hazard Tracking Interface for NER*) is an end-to-end, AI-powered landslide monitoring and early warning system specifically tailored to the unique terrain and connectivity constraints of the 8 North Eastern States (**Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Sikkim, Tripura**).

---

## 🚀 Key Innovations & Features

1. **Multi-Factor Dynamic Risk Scoring (0–100):**
   - Integrates 72-hour antecedent precipitation (IMD AWS), SRTM topographic slope & aspect, soil moisture saturation (Copernicus / ISRO Bhuvan), lithological vulnerability, and distance to road cut-slopes.
   - Real-time hazard classification: **Low (Green)**, **Moderate (Yellow)**, **High (Orange)**, and **Critical (Red)**.

2. **Explainable AI (XAI) with SHAP Diagnostics:**
   - Moves beyond black-box predictions by breaking down the exact percentage contributions of each triggering factor (e.g., *72h Rainfall: +36.2%*, *Slope Angle (44.5°): +23.8%*, *Soil Moisture (92.5%): +19.4%*).

3. **High-Fidelity GIS Command Map:**
   - Interactive Leaflet.js map with layer toggles (Dark Carto, OpenTopo Terrain, Standard OSM).
   - Radar danger zones with pulsing animations for critical sectors (Sonapur Tunnel, Melli-Teesta, Kohima).
   - Polyline overlays for key national highway lifelines with real-time passability statuses.

4. **"What-If" Scenario Simulation Sandbox:**
   - Stress-test disaster resilience by simulating cloudburst rainfall surges (+0% to +150%), extreme 72h precipitation overrides (0–450mm), and seismic tremors (M3.0–M6.5).

5. **Common Alerting Protocol (CAP) Multi-Agency Broadcaster:**
   - Common Alerting Protocol (CAP) compliant dispatcher sending structured emergency alerts to **SDMA, BRO, NDRF, NHIDCL, and Citizen Cell Broadcasts**.

6. **Offline Sync & Geotagged Field Reporting:**
   - Specially designed for low-connectivity eastern regions: field officers and commuters can capture geotagged photos and roadblock reports offline; data is cached in IndexedDB/LocalStorage and auto-synced upon reconnecting.

---

## 👥 6-Member Team Role Distribution

| Team Member Role | Focus Area | Key Deliverables |
| :--- | :--- | :--- |
| **AI / ML Engineers (1–2)** | Risk Prediction & XAI | Dynamic Landslide Susceptibility Index (LSI), XGBoost/Random Forest models, SHAP feature importance. |
| **GIS & Backend Developers (1–2)** | API & Spatial Engine | FastAPI backend, ISRO Bhuvan/OSM integration, highway corridor buffer analysis, CAP alert dispatcher. |
| **Frontend & Mobile Developer (1)** | UI / UX & Offline PWA | React + Vite GIS Command Dashboard, What-If simulation studio, offline geotagging interface. |
| **Documentation & Pitch Lead (1)** | Hackathon Presentation | MDoNER alignment, live jury demo script, system architecture & user manual. |

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, React-Leaflet, Recharts
- **Backend:** Python 3.13, FastAPI, Uvicorn, Pydantic, NumPy, Pandas, Scikit-learn, XGBoost
- **GIS & Mapping:** Leaflet.js, OpenStreetMap, OpenTopoMap, GeoJSON
- **Protocols:** CAP (Common Alerting Protocol), WebSockets, REST API, Offline IndexedDB

---

## 🏃 Quickstart Guide

### 1. Launch Backend Server:
```bash
cd backend
python run_backend.py
```
*Backend runs on:* `http://127.0.0.1:8000`  
*API Documentation (Swagger):* `http://127.0.0.1:8000/docs`

### 2. Launch Frontend Dashboard:
```bash
cd frontend
npm run dev
```
*Frontend runs on:* `http://localhost:5173`

---

## 🏛️ Ministry Alignment
- **Problem Statement ID:** SIH26001
- **Target Organization:** Ministry of Development of North Eastern Region (MDoNER)
- **Primary Stakeholders:** State Disaster Management Authorities (SDMAs), Border Roads Organisation (BRO), National Highways and Infrastructure Development Corporation Limited (NHIDCL), National Disaster Response Force (NDRF), District Emergency Operation Centers (DEOCs).

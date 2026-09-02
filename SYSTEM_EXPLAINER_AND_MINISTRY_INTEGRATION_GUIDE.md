# DRISHTI-NER: The Complete System Explainer & Ministry Integration Guide
### Problem Statement: SIH26001 | Ministry of Development of North Eastern Region (MDoNER)

---

## 🏔️ Part 1: How DRISHTI-NER Works (Explained for a 7th / 8th Grade Student)

Imagine you are holding a **kitchen sponge**:
1. When the sponge is dry, it is light and holds its shape.
2. If you pour a little water on it, it absorbs it easily.
3. But if you hold it tilted at a **steep angle** and **keep pouring mugs of water on it nonstop for 3 days**, the sponge gets super heavy, turns into mush, and slides right out of your hand!

### That is exactly what happens to the mountains in North East India!
- In states like **Meghalaya, Sikkim, Nagaland, and Assam**, the mountains are made of soft rock and clay.
- During the monsoon season, it rains heavily for 3 to 4 days straight (sometimes 300 mm of rain!).
- Roads like **NH-6** (which takes food and medicine to Meghalaya and Mizoram) and **NH-10** (which connects Sikkim to the rest of India) are carved right into these steep hills.
- When the soil gets soaked with too much rainwater, gravity pulls hundreds of tons of mud, trees, and rocks crashing down onto the highway. This is called a **landslide**.

### What does our system, "DRISHTI-NER", do?
Think of **DRISHTI-NER** like a **"Smart Health Watch" for the mountains**:
- Just like a smartwatch checks your heartbeat and warns you if you are running too fast, **DRISHTI-NER monitors the mountain's heartbeat 24/7**:
  1. *How much rain fell in the last 72 hours?*
  2. *How steep is the mountain slope?*
  3. *How wet/soaked is the soil?*
  4. *Are there cracks appearing on the road?*
- If the risk score crosses danger levels, it **instantly sounds an alarm** to the government, Border Roads Organisation (BRO), and commuters **hours BEFORE the mountain falls**, saving lives and preventing vehicles from getting trapped!

---

## 🎯 Part 2: What Problem Does It Solve & How It Meets All MDoNER Criteria?

| Ministry Criteria & Challenges in NER | How DRISHTI-NER Solves It |
| :--- | :--- |
| **1. No Early Warning for Cloudbursts:** Landslides happen suddenly without warning. | **Dynamic AI Risk Scoring (0–100):** Calculates live hazard probabilities using real-time IMD rainfall feeds and slope kinematics. |
| **2. Lifeline Highways Get Blocked:** NH-6, NH-10, NH-29 get blocked, cutting off essential food and medical supplies to entire states. | **Highway Corridor Vulnerability Tracker:** Actively tracks highway milestones, calculates blockage probability, and suggests **BRO alternate detour routes**. |
| **3. Poor Mobile Network in Remote Hills:** Field officers cannot report damages when there is no 4G/5G tower. | **Offline-First Sync Engine:** Field officers can take geotagged photos and log road cracks **without internet**; reports are stored safely on the device and auto-upload the moment network returns! |
| **4. Black-Box AI vs Trust:** Officers won't trust an AI that just says "Danger" without explaining why. | **Explainable AI (XAI with SHAP):** Gives a clear percentage breakdown (*e.g., "72h Rain: +36%, Steep Slope 44°: +24%, Saturated Clay: +19%"*) so engineers know exactly what to fix. |
| **5. Multi-Agency Coordination:** Police, BRO, SDMA, and NDRF need unified alerts. | **CAP Alert Broadcaster:** Dispatches single-click standardized emergency alerts to all agencies at once. |

---

## 🧠 Part 3: How the Machine Learning (AI) Model Was Made

```
        ┌─────────────────────────────────────────────────────────────┐
        │                 5 Geospatial & Weather Inputs               │
        └──────────────────────────────┬──────────────────────────────┘
                                       │
        ┌──────────────┬───────────────┼───────────────┬──────────────┐
        ▼              ▼               ▼               ▼              ▼
   [Rainfall 72h] [Slope Angle]  [Soil Saturation] [Rock Type]   [Cut-Slope Dist]
   (IMD Sensors)  (DEM SRTM Sat) (Moisture Probe)  (GSI Geology) (Highway Buffer)
        │              │               │               │              │
        └──────────────┴───────┬───────┴───────────────┴──────────────┘
                               │
                               ▼
        ┌─────────────────────────────────────────────────────────────┐
        │        XGBoost & Random Forest Decision Tree Engine         │
        │    (Hundreds of smart decision trees vote on the risk)       │
        └──────────────────────────────┬──────────────────────────────┘
                                       │
                                       ▼
        ┌─────────────────────────────────────────────────────────────┐
        │  Dynamic Risk Score (0 - 100) + SHAP Explainability Factors │
        │    🟢 0-25: Normal | 🟡 26-55: Watch | 🟠 56-80: Warning    │
        │             🔴 81-100: Critical Evacuation Alert             │
        └─────────────────────────────────────────────────────────────┘
```

### 1. The 5 Core Ingredients the AI Checks:
1. **Antecedent Rainfall (72 hours):** Rain that fell 2 or 3 days ago is still inside the mountain making it heavy.
2. **Slope Angle (Degrees):** Flat ground (10°) rarely slides; steep cliffs (>35°) slide easily.
3. **Soil Moisture Saturation (%):** When soil pore spaces are 100% full of water, the soil turns into liquid mud (liquefaction).
4. **Lithology (Rock Vulnerability):** Fragile shale and sandstone crumble much faster than solid granite.
5. **Distance to Road Cut-Slope:** When engineers cut the bottom ("toe") of a hill to build a road, the mountain loses its natural support.

### 2. How the AI Learns from Past History:
- We train the model on **Historical Landslide Catalogs** from the **Geological Survey of India (GSI)** and **MDoNER**.
- The model learns past patterns: *"Whenever rain exceeded 220mm on a slope steeper than 40° in East Jaintia Hills, a landslide happened 94% of the time."*

---

## 🔄 Part 4: How the AI Model Learns from NEW Incoming Data (Continuous Learning)

Machine learning models should not stay static. Here is how DRISHTI-NER continuously gets smarter:

```
  [1. Field Officer / Citizen logs report via App] (e.g. "Minor rockfall at KM 142")
                               │
                               ▼
  [2. Automated Verification & IMD Weather Tagging] (System records exact rain & soil moisture at that moment)
                               │
                               ▼
  [3. Ground Truth Data Warehouse (PostGIS / SQLite)]
                               │
                               ▼
  [4. Weekly Retraining Pipeline (Active Learning)]
   - Scikit-learn & XGBoost retrain on the updated historical + new incident dataset
   - Validates if prediction accuracy improved
                               │
                               ▼
  [5. Hot-Swapping ML Weights in FastAPI] (Zero downtime update to the live scoring engine)
```

1. **Step 1 (Incident Logging):** When a field engineer or citizen reports a road crack or mudslide using the app, the system tags the exact GPS location and timestamp.
2. **Step 2 (Feature Enrichment):** The server automatically queries the IMD weather and satellite soil moisture for that exact hour.
3. **Step 3 (Ground-Truth Dataset):** This new real-world event is added to the training database.
4. **Step 4 (Automated Retraining):** Every week, a background script retrains the XGBoost model on the expanded dataset. If the accuracy is higher, the new model is deployed automatically.

---

## 🛰️ Part 5: What Data Sources & APIs are Used to Track Live?

| Data Layer | Source / API | What It Provides |
| :--- | :--- | :--- |
| **Rainfall & Weather** | **India Meteorological Department (IMD) AWS API** | Real-time hourly, 24h, 48h, and 72h precipitation measurements from Automatic Weather Stations across NER. |
| **Soil Saturation** | **ISRO Bhuvan / Copernicus Sentinel-1** | High-resolution satellite microwave radar measuring volumetric soil moisture depth. |
| **Terrain & Elevation** | **SRTM / CartoDEM Digital Elevation Model** | 30-meter elevation grid calculating slope angles, aspect, and water drainage curvature. |
| **Historical Landslides** | **Geological Survey of India (GSI) Bhukosh** | Geospatial inventory of past landslides, fault lines, and lithological rock formations. |
| **Highway Milestones** | **NHAI / NHIDCL Corridor GIS** | Chainage milestones, bridges, and tunnel locations along NH-6, NH-10, NH-29, and NH-13. |

---

## 📡 Part 6: How the Ministry of Communications & Telecommunications (DoT) Can Integrate This for Direct Broadcast Alerts

This is one of the most powerful aspects of this project for government evaluation:

```
 ┌────────────────────────┐
 │   DRISHTI-NER Engine   │ ➔ Generates CAP 1.2 XML Alert (Red Warning for NH-6 Corridor)
 └───────────┬────────────┘
             │
             ▼
 ┌────────────────────────┐
 │   NDMA / MDoNER Hub    │ ➔ Approves / Auto-triggers Emergency Broadcast
 └───────────┬────────────┘
             │
 ┌───────────┴────────────────────────────────────────┐
 │                                                    │
 ▼                                                    ▼
┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐
│ 1. Department of Telecom (DoT) /      │   │ 2. Messaging & Social Gateways        │
│    C-DOT Cell Broadcast System (CBS)  │   │    (WhatsApp / SMS / Telegram)        │
└──────────────────┬────────────────────┘   └──────────────────┬────────────────────┘
                   │                                           │
                   ▼                                           ▼
 ┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐
 │ Geo-Fenced Mobile Towers (Cell Towers)│   │ WhatsApp Business API & SMS Gateway   │
 └──────────────────┬────────────────────┘   └──────────────────┬────────────────────┘
                   │                                           │
                   ▼                                           ▼
 ┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐
 │ 📱 Loud Emergency Siren pops up on    │   │ 💬 WhatsApp text with alternate       │
 │    EVERY mobile phone in that valley! │   │    detour map sent to drivers & BRO   │
 │    (Works even without internet!)     │   │                                       │
 └───────────────────────────────────────┘   └───────────────────────────────────────┘
```

### 1. What is the C-DOT Cell Broadcast System (CBS)?
- In India, the **Centre for Development of Telematics (C-DOT)** and the **Department of Telecommunications (DoT)** run the National Emergency Cell Broadcast System.
- Unlike a normal SMS which takes minutes to send to thousands of people, **Cell Broadcast works like a digital megaphone**:
  - The telecom towers in a specific 10-kilometer landslide danger zone send a radio signal to **every active phone connected to those towers simultaneously**.
  - A **high-pitched warning siren flashes directly onto the user's phone screen** with instructions (e.g., *"RED ALERT: NH-6 Sonapur Tunnel closed due to landslide. Take Umrangso detour immediately"*).
  - **It works even if the user has no mobile balance, no internet data pack, and no app installed!**

### 2. Common Alerting Protocol (CAP v1.2) Integration:
DRISHTI-NER formats alerts into the international **OASIS CAP v1.2 Standard (XML/JSON)**:
```json
{
  "identifier": "IN-NER-MDONER-CAP-2026-0902-882",
  "sender": "drishti-ner@mdoner.gov.in",
  "sent": "2026-09-02T13:30:00Z",
  "status": "Actual",
  "msgType": "Alert",
  "scope": "Public",
  "info": {
    "category": "Geo",
    "event": "Landslide Hazard Evacuation",
    "urgency": "Immediate",
    "severity": "Extreme",
    "certainty": "Observed",
    "headline": "RED ALERT: Critical Slope Failure Imminent on NH-6 Sonapur Tunnel",
    "description": "Continuous 72h rainfall has reached 295mm. Saturated clay shale active movement detected.",
    "instruction": "Halt all vehicles at Jowai/Silchar gates. Divert via Umrangso-Haflong link.",
    "area": {
      "areaDesc": "East Jaintia Hills, Meghalaya - NH-6 KM 140 to 146",
      "circle": "25.1189,92.3683,10.0"
    }
  }
}
```

### 3. Direct WhatsApp & Telegram Broadcast:
- By connecting DRISHTI-NER's `/api/alerts/broadcast` endpoint to the **Meta WhatsApp Cloud API / Twilio Gateway**:
  - Registered commercial truck drivers, bus operators, and BRO engineers receive an automated WhatsApp message with a clickable map link showing the shortest safe alternate detour before they get stuck in an 8-hour traffic jam in the mountains.

---

## 🏆 Summary Checklist for Hackathon Presentation

1. **Problem:** Fragile NER mountains + extreme monsoon rainfall = frequent landslide disasters and cut-off highway lifelines.
2. **Solution:** DRISHTI-NER combines IMD rainfall, satellite soil data, and DEM terrain physics into a real-time (0–100) AI hazard prediction score.
3. **XAI Advantage:** Uses SHAP to explain the exact engineering root cause rather than acting as a black box.
4. **Resilience:** Offline-first PWA allows remote field officers to geotag road cracks without internet.
5. **National Integration:** Ready for Common Alerting Protocol (CAP) and C-DOT Cell Broadcast siren integration through the Ministry of Communications.

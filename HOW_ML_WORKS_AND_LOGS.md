# DRISHTI-NER: How the Machine Learning Engine Works (v2)

This document explains the inner workings of our AI model in plain language, and introduces the **Version 2 Historical Log** feature for tracking past predictions.

## 🧠 How the Machine Learning Works

We use an **XGBoost & Random Forest Ensemble** to predict landslide risks. Here is how it learns and operates:

### 1. Training (The Learning Phase)
*   **Historical Data:** We fed the model decades of data from the Geological Survey of India (GSI) and ISRO. 
*   **Pattern Recognition:** The AI learned that specific combinations cause landslides. For example, it learned that if **Slope > 40°** AND **Soil Moisture > 85%** AND **Rainfall > 200mm in 72h**, a landslide is 94% likely.
*   **Factor Weighting:** It assigned "weights" to what matters most. In our model:
    *   `72h Rainfall` (30%)
    *   `Slope Angle` (22%)
    *   `Soil Moisture` (18%)
    *   `Lithology/Rock Type` (14%)

### 2. Predicting (The Live Phase)
*   **Sensor Ingestion:** Every hour, it fetches live rainfall from OpenWeatherMap/IMD and slope data from terrain models.
*   **Risk Scoring:** It runs the math and outputs a `Risk Score (0-100)`.
*   **Explainable AI (XAI):** Instead of just saying "High Risk", the model explains *why* using SHAP values (e.g., "Risk is high *because* 72h rainfall is 295mm").

### 3. Retraining (The Feedback Loop)
When field officers report new incidents using our **Geotagged Incident Feature**, the model ingests these reports. Over time, it updates its internal weights to become even more accurate for the North Eastern Region.

---

## 📊 Version 2: Historical Log Tracking

To ensure accountability, we have added a **24-Hour Timeline & Historical Log** system (Version 2). 

### What it tracks:
1.  **Past Predictions:** Logs every time a hotspot crossed into `HIGH` or `CRITICAL` risk, including the exact risk score.
2.  **Weather Spikes:** Logs sudden downpours (e.g., 100mm in a few hours).
3.  **Field Reports:** Logs all geotagged hazard submissions from users.
4.  **System Actions:** Logs when sirens or CAP (Common Alerting Protocol) warnings were triggered.

### How to access it:
On the frontend dashboard, you can now click the **"V2 Historical Logs"** tab. This reads from the `/api/timeline/events` backend endpoint to give a live feed of how the model has reacted over the last 24-48 hours.

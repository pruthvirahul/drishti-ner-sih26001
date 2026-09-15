# DRISHTI-NER Version 2: Prediction Evidence & Validation Engine

This document outlines the architectural enhancements introduced in Version 2 of the DRISHTI-NER platform. The primary goal of this upgrade is to provide transparency, accountability, and traceability to the machine learning predictions without modifying or artificially lowering the raw risk scores.

## Key Principles
1. **Preserve Raw Model Outputs:** The original XGBoost risk scores are kept exactly as they are calculated.
2. **Accountability via Persistent Logs:** Every prediction and observation is logged.
3. **Data-Driven Calibration:** Raw scores are mapped to calibrated probabilities based on historical performance, providing realistic confidence intervals.
4. **External Verification:** Live news and official links (IMD, NRSC/NDEM) are pulled as supporting evidence, never as direct modifiers to the risk engine.

## New Components

### 1. Historical Data Stores (Simulation for Demo)
- **Prediction Log (`PredictionRecord`):** Captures timestamp, location, inputs (rainfall, slope), raw score, and lead time.
- **Observation Database (`ObservationRecord`):** Captures verified ground-truth events (landslides, roadblock) from field officers or official channels.

### 2. Validation Engine
The backend `ValidationEngine` continually evaluates predictions against observations.
- **Matching Algorithm:** Uses spatial (location ID) and temporal (48-hour window) constraints to link a prediction with an outcome.
- **Metrics Calculation:** Computes Confusion Matrix (True/False Positives/Negatives), Precision, Recall, F1-Score, False Positive Rate (FPR), and Average Lead Time.

### 3. Calibration & Similarity Search
- **Calibration Layer:** A statistical layer that interprets a raw score (e.g., `85/100`) as a calibrated probability (e.g., `92% probability of failure`) by analyzing historical performance.
- **Similarity Search (KNN Concept):** When a new prediction is made, the system finds past events with similar feature vectors (e.g., `72h rainfall ~ 200mm` and `slope ~ 40°`). This gives the user contextual proof: *"The last 3 times these exact conditions occurred here, a major landslide followed."*

### 4. Evidence Service
- A module designed to query trusted external sources.
- **Simulated Fetch:** For the hackathon demo, it searches a mock database of news headlines and official updates.
- **Links:** Extracts the affected infrastructure and provides clickable URLs to sources like the India Meteorological Department (IMD) or ISRO NRSC NDEM.

## The Frontend Validation Dashboard
All these components are brought together in the new `ValidationDashboard.jsx` tab. It clearly distinguishes between:
- **Predicted:** What the ML model forecasted.
- **Observed/Verified:** What actually happened on the ground.
- **Unverified/Simulated:** Mock data used for demo purposes.

By incorporating these features, DRISHTI-NER proves that it is not merely a "black-box" risk calculator, but a scientifically validated, self-correcting early warning system.

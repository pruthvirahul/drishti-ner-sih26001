# DRISHTI-NER Complete Deployment Guide
### Deploy Frontend on Vercel + Backend on Render (100% Free)

---

## 🎯 Architecture Overview

```
 ┌────────────────────────────────────────┐
 │   Frontend: React + Leaflet GIS        │
 │   Hosted on: Vercel                    │
 │   URL: https://drishti-ner.vercel.app  │
 └───────────────────┬────────────────────┘
                     │ (Calls API via HTTPS)
                     ▼
 ┌────────────────────────────────────────┐
 │   Backend: FastAPI + ML Risk Engine    │
 │   Hosted on: Render.com                │
 │   URL: https://drishti-api.onrender.com│
 └────────────────────────────────────────┘
```

---

## 🚀 Part 1: Deploy Backend on Render (Deploy Backend FIRST)

Render offers a 100% free hosting tier for Python/FastAPI web services.

### Step 1: Create Account & Connect Repo
1. Go to **[https://render.com](https://render.com)** and Sign In with your **GitHub account**.
2. Click the **"New +"** button at the top right and select **"Web Service"**.
3. Under *Connect a repository*, choose **`pruthvirahul/drishti-ner-sih26001`**.

### Step 2: Configure Web Service Settings
Fill in the following fields exactly:

| Field | Value to Enter |
| :--- | :--- |
| **Name** | `drishti-ner-backend` |
| **Region** | `Singapore (Southeast Asia)` or `Frankfurt` (closest to India) |
| **Branch** | `main` |
| **Root Directory** | `backend` ⚠️ *(Very Important!)* |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` ($0/month) |

### Step 3: (Optional) Environment Variables on Render
Click on the **"Environment Variables"** tab on Render.
> **Note:** The backend has built-in calibrated telemetry and **works 100% without any paid API keys** out of the box! If you want to connect live external APIs later, you can add:

```env
ENVIRONMENT=production
OPENWEATHER_API_KEY=your_key_here
WHATSAPP_ACCESS_TOKEN=your_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_id_here
```

### Step 4: Click "Create Web Service"
- Render will start building the Python environment and install all ML libraries (`xgboost`, `scikit-learn`, `fastapi`).
- In ~2 minutes, your backend will be live at:  
  👉 **`https://drishti-ner-backend.onrender.com`**
- Test it in your browser: `https://drishti-ner-backend.onrender.com/docs` (Swagger UI will open).
- **Copy your Render backend URL!** (You will need it for Vercel in Part 2).

---

## ⚡ Part 2: Deploy Frontend on Vercel

### Step 1: Create Account & Import Repo
1. Go to **[https://vercel.com](https://vercel.com)** and Sign In with **GitHub**.
2. Click **"Add New..." ➔ "Project"**.
3. Select your repository: **`pruthvirahul/drishti-ner-sih26001`**.

### Step 2: Configure Project Settings on Vercel

| Setting | Value to Set |
| :--- | :--- |
| **Framework Preset** | `Vite` (automatically detected) |
| **Root Directory** | Click *Edit* and select **`frontend`** ⚠️ *(Crucial!)* |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Step 3: Add Environment Variable on Vercel
Expand the **"Environment Variables"** section and add:

| Key | Value |
| :--- | :--- |
| **`VITE_API_BASE_URL`** | `https://drishti-ner-backend.onrender.com/api` *(replace with your actual Render URL + `/api`)* |

### Step 4: Click "Deploy"
- Vercel will build your React application in ~30 seconds.
- You will receive your live, public HTTPS production URL (e.g. `https://drishti-ner-sih26001.vercel.app`).

---

## 🧪 Part 3: Live Verification Checklist

Once both are deployed, test your live Vercel URL:
1. ✅ **GIS Map:** Interactive Leaflet map loads with terrain tiles and pulsing radar rings on Sonapur Tunnel (NH-6) and Teesta Valley (NH-10).
2. ✅ **XAI Modal:** Click "Inspect Explainable AI Breakdown" to see SHAP factor attribution plots.
3. ✅ **Simulation Studio:** Click "What-If Simulator", drag rainfall surge slider, and observe live recalculation from your Render backend.
4. ✅ **Highway Corridors:** Check status of NH-6, NH-10, NH-29, NH-13 and detour advisories.
5. ✅ **Offline Reporting:** Turn off browser internet, submit a geotagged hazard report, turn internet back on, and watch it auto-sync.

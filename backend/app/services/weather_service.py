"""
IMD Weather & Precipitation Telemetry Service
Uses OpenWeatherMap API when OPENWEATHER_API_KEY is set.
Falls back to calibrated NER monsoon simulation when key is not present.
"""
import os
import random
import logging
from typing import Dict
from app.models.schemas import WeatherMetrics

logger = logging.getLogger(__name__)

# NER station coordinates for live API lookups
STATION_COORDS = {
    "IMD-AWS-MEG-01": {"lat": 25.1189, "lon": 92.3683, "name": "Sonapur, Meghalaya"},
    "IMD-AWS-SIK-02": {"lat": 27.0987, "lon": 88.4612, "name": "Melli, Sikkim"},
    "IMD-AWS-NAG-01": {"lat": 25.6747, "lon": 94.0722, "name": "Kohima, Nagaland"},
    "IMD-AWS-MAN-03": {"lat": 24.8170, "lon": 93.9368, "name": "Imphal, Manipur"},
    "IMD-AWS-ASM-04": {"lat": 26.1445, "lon": 91.7362, "name": "Guwahati, Assam"},
    "IMD-AWS-ARU-01": {"lat": 27.5897, "lon": 92.1783, "name": "Tawang, Arunachal"},
    "IMD-AWS-MIZ-01": {"lat": 23.1645, "lon": 92.9376, "name": "Aizawl, Mizoram"},
    "IMD-AWS-TRI-01": {"lat": 23.9408, "lon": 91.9882, "name": "Agartala, Tripura"},
}

# Calibrated NER baseline data (fallback simulation)
BASELINE_DATA = {
    "IMD-AWS-MEG-01": {"temp": 21.5, "humidity": 94.0, "rf_24h": 145.0, "rf_72h": 295.0, "soil": 92.5},
    "IMD-AWS-SIK-02": {"temp": 19.0, "humidity": 91.0, "rf_24h": 128.0, "rf_72h": 260.0, "soil": 89.0},
    "IMD-AWS-NAG-01": {"temp": 18.5, "humidity": 88.0, "rf_24h": 95.0,  "rf_72h": 210.0, "soil": 84.0},
    "IMD-AWS-MAN-03": {"temp": 23.0, "humidity": 93.0, "rf_24h": 110.0, "rf_72h": 270.0, "soil": 94.0},
    "IMD-AWS-ASM-04": {"temp": 24.5, "humidity": 86.0, "rf_24h": 75.0,  "rf_72h": 180.0, "soil": 79.0},
    "IMD-AWS-ARU-01": {"temp": 20.0, "humidity": 90.0, "rf_24h": 105.0, "rf_72h": 240.0, "soil": 86.5},
    "IMD-AWS-MIZ-01": {"temp": 22.0, "humidity": 87.0, "rf_24h": 82.0,  "rf_72h": 195.0, "soil": 82.0},
    "IMD-AWS-TRI-01": {"temp": 26.0, "humidity": 78.0, "rf_24h": 38.0,  "rf_72h": 85.0,  "soil": 62.0},
}

class WeatherService:
    def __init__(self):
        self.api_key = os.getenv("OPENWEATHER_API_KEY", "")
        if self.api_key:
            logger.info("WeatherService: OpenWeatherMap API key found — LIVE mode active.")
        else:
            logger.info("WeatherService: No API key found — running calibrated NER simulation mode.")

    def _fetch_live(self, lat: float, lon: float) -> dict | None:
        """Fetch current weather from OpenWeatherMap API."""
        try:
            import httpx
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={self.api_key}&units=metric"
            resp = httpx.get(url, timeout=5.0)
            if resp.status_code == 200:
                data = resp.json()
                rain_1h = data.get("rain", {}).get("1h", 0.0)
                return {
                    "temp": data["main"]["temp"],
                    "humidity": data["main"]["humidity"],
                    "rf_24h": round(rain_1h * 24, 1),   # Estimate 24h from 1h reading
                    "rf_72h": round(rain_1h * 24 * 2.2, 1),  # Estimate 72h antecedent
                    "wind": data["wind"]["speed"] * 3.6,  # m/s to km/h
                }
        except Exception as e:
            logger.warning(f"OpenWeatherMap API call failed: {e} — falling back to simulation.")
        return None

    def get_latest_weather(self, station_id: str) -> WeatherMetrics:
        base = BASELINE_DATA.get(station_id, {"temp": 22.0, "humidity": 85.0, "rf_24h": 90.0, "rf_72h": 200.0, "soil": 80.0})
        fluct = random.uniform(-1.5, 1.5)
        wind = round(14.0 + random.uniform(-2, 4), 1)

        # Try live API if key exists
        if self.api_key and station_id in STATION_COORDS:
            coords = STATION_COORDS[station_id]
            live = self._fetch_live(coords["lat"], coords["lon"])
            if live:
                logger.info(f"LIVE weather fetched for {station_id} from OpenWeatherMap.")
                return WeatherMetrics(
                    temperature=round(live["temp"], 1),
                    humidity=round(min(100.0, live["humidity"]), 1),
                    rainfall_24h=live["rf_24h"],
                    rainfall_48h=round(live["rf_24h"] * 1.5, 1),
                    rainfall_72h=live["rf_72h"],
                    soil_moisture_pct=round(min(100.0, max(10.0, base["soil"] + (live["rf_24h"] / 200) * 10)), 1),
                    wind_speed=live.get("wind", wind),
                    station_id=station_id
                )

        # Simulation fallback
        return WeatherMetrics(
            temperature=round(base["temp"] + fluct * 0.2, 1),
            humidity=round(min(100.0, base["humidity"] + fluct * 0.5), 1),
            rainfall_24h=round(max(0.0, base["rf_24h"] + fluct * 2.0), 1),
            rainfall_48h=round(max(0.0, base["rf_24h"] * 1.5 + fluct * 2.5), 1),
            rainfall_72h=round(max(0.0, base["rf_72h"] + fluct * 3.0), 1),
            soil_moisture_pct=round(min(100.0, max(10.0, base["soil"] + fluct * 0.8)), 1),
            wind_speed=wind,
            station_id=station_id
        )

weather_service = WeatherService()


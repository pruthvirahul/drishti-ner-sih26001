"""
IMD Weather & Precipitation Telemetry Service
Simulates live data streams from Automatic Weather Stations (AWS) across NER.
"""
import random
from typing import Dict, List
from app.models.schemas import WeatherMetrics

class WeatherService:
    def __init__(self):
        self.stations = {
            "IMD-AWS-MEG-01": {"temp": 21.5, "humidity": 94.0, "rf_24h": 145.0, "rf_72h": 295.0, "soil": 92.5},
            "IMD-AWS-SIK-02": {"temp": 19.0, "humidity": 91.0, "rf_24h": 128.0, "rf_72h": 260.0, "soil": 89.0},
            "IMD-AWS-NAG-01": {"temp": 18.5, "humidity": 88.0, "rf_24h": 95.0, "rf_72h": 210.0, "soil": 84.0},
            "IMD-AWS-MAN-03": {"temp": 23.0, "humidity": 93.0, "rf_24h": 110.0, "rf_72h": 270.0, "soil": 94.0},
            "IMD-AWS-ASM-04": {"temp": 24.5, "humidity": 86.0, "rf_24h": 75.0, "rf_72h": 180.0, "soil": 79.0},
            "IMD-AWS-ARU-01": {"temp": 20.0, "humidity": 90.0, "rf_24h": 105.0, "rf_72h": 240.0, "soil": 86.5},
            "IMD-AWS-MIZ-01": {"temp": 22.0, "humidity": 87.0, "rf_24h": 82.0, "rf_72h": 195.0, "soil": 82.0},
            "IMD-AWS-TRI-01": {"temp": 26.0, "humidity": 78.0, "rf_24h": 38.0, "rf_72h": 85.0, "soil": 62.0}
        }

    def get_latest_weather(self, station_id: str) -> WeatherMetrics:
        base = self.stations.get(station_id, {"temp": 22.0, "humidity": 85.0, "rf_24h": 90.0, "rf_72h": 200.0, "soil": 80.0})
        # Add micro fluctuation
        fluct = random.uniform(-1.5, 1.5)
        return WeatherMetrics(
            temperature=round(base["temp"] + fluct * 0.2, 1),
            humidity=round(min(100.0, base["humidity"] + fluct * 0.5), 1),
            rainfall_24h=round(max(0.0, base["rf_24h"] + fluct * 2.0), 1),
            rainfall_48h=round(max(0.0, base["rf_24h"] * 1.5 + fluct * 2.5), 1),
            rainfall_72h=round(max(0.0, base["rf_72h"] + fluct * 3.0), 1),
            soil_moisture_pct=round(min(100.0, max(10.0, base["soil"] + fluct * 0.8)), 1),
            wind_speed=round(14.0 + random.uniform(-2, 4), 1),
            station_id=station_id
        )

weather_service = WeatherService()

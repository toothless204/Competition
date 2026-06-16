import random
import json
from datetime import datetime, timedelta

SENSOR_HISTORY = []
try:
    with open("../sample_data/sensor_logs.json") as f:
        SENSOR_HISTORY = json.load(f)
except Exception:
    pass


def gaussian(mean, std, min_val=None, max_val=None):
    val = random.gauss(mean, std)
    if min_val is not None:
        val = max(val, min_val)
    if max_val is not None:
        val = min(val, max_val)
    return round(val, 1)


def get_time_of_day_factor():
    hour = datetime.now().hour
    if 6 <= hour < 18:
        return 1.0
    elif 18 <= hour < 22:
        return 1.15
    else:
        return 1.25


def generate_iot_data(anomaly: bool = False) -> dict:
    factor = get_time_of_day_factor()

    if anomaly:
        return {
            "CO": gaussian(36, 5, 28, 55),
            "CO2": gaussian(900, 120, 700, 1200),
            "NH3": gaussian(8, 2, 5, 14),
            "H2S": gaussian(9, 2, 6, 14),
            "temperature": gaussian(41, 2, 37, 46),
            "humidity": gaussian(72, 5, 60, 85),
            "active_sensors": 13,
            "anomaly_detected": True,
        }

    return {
        "CO": gaussian(12 * factor, 3, 5, 22),
        "CO2": gaussian(500 * factor, 80, 380, 750),
        "NH3": gaussian(3 * factor, 0.8, 1, 6),
        "H2S": gaussian(1.2 * factor, 0.4, 0.2, 3),
        "temperature": gaussian(28, 2, 24, 34),
        "humidity": gaussian(62, 5, 50, 75),
        "active_sensors": 13,
        "anomaly_detected": False,
    }


def generate_cctv_events(anomaly: bool = False) -> dict:
    if anomaly:
        ppe_ok = random.randint(6, 9)
        restricted_breach = random.randint(2, 5)
        unsafe = random.randint(1, 4)
    else:
        ppe_ok = random.randint(10, 13)
        restricted_breach = 0
        unsafe = 0

    events = [
        {
            "type": "PPE_DETECTION",
            "zone": "Zone A",
            "compliant": ppe_ok,
            "violation": 12 - ppe_ok,
            "severity": "high" if (12 - ppe_ok) > 3 else "normal",
        },
        {
            "type": "RESTRICTED_AREA",
            "zone": "Zone B",
            "breach_count": restricted_breach,
            "severity": "high" if restricted_breach > 0 else "normal",
        },
        {
            "type": "UNSAFE_BEHAVIOR",
            "zone": "Zone C",
            "count": unsafe,
            "severity": "medium" if unsafe > 0 else "normal",
        },
    ]

    return {
        "events": events,
        "ppe_compliance": ppe_ok,
        "ppe_violation": 12 - ppe_ok,
        "restricted_breach": restricted_breach,
        "unsafe_behavior": unsafe,
        "feeds_active": 6,
    }


def get_historical_trend() -> list:
    trend = []
    base_incidents = 4
    for day in range(30):
        date_obj = datetime.now() - timedelta(days=30 - day)
        date_str = date_obj.strftime("%d/%m")
        day_of_week = date_obj.weekday()
        multiplier = 1.3 if day_of_week == 0 else (0.7 if day_of_week == 6 else 1.0)
        incidents = max(0, int(random.gauss(base_incidents * multiplier, 1.5)))
        near_miss = max(0, int(random.gauss(incidents * 3, 2)))
        trend.append({
            "date": date_str,
            "incidents": incidents,
            "nearMiss": near_miss,
        })
    return trend

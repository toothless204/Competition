def determine_alert_level(risk_score: float, anomaly: bool = False) -> str:
    if risk_score >= 75 or (anomaly and risk_score >= 55):
        return "LEVEL_3"
    elif risk_score >= 55 or (anomaly and risk_score >= 38):
        return "LEVEL_2"
    elif risk_score >= 35:
        return "LEVEL_1"
    else:
        return "SAFE"

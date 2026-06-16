def calculate_risk(iot_data: dict, cctv_data: dict, anomaly: bool = False) -> dict:
    score = 0.0
    factors = []

    co = iot_data.get("CO", 0)
    if co >= 35:
        score += 30
        factors.append({"factor": "CO Level Critical", "value": f"{co} ppm", "severity": "critical"})
    elif co >= 25:
        score += 18
        factors.append({"factor": "CO Level Elevated", "value": f"{co} ppm", "severity": "warning"})
    else:
        score += max(0, (co - 10) / 15 * 8)

    h2s = iot_data.get("H2S", 0)
    if h2s >= 10:
        score += 25
        factors.append({"factor": "H2S Critical", "value": f"{h2s} ppm", "severity": "critical"})
    elif h2s >= 5:
        score += 15
        factors.append({"factor": "H2S Elevated", "value": f"{h2s} ppm", "severity": "warning"})
    else:
        score += max(0, h2s / 5 * 5)

    temp = iot_data.get("temperature", 25)
    if temp >= 45:
        score += 20
        factors.append({"factor": "Temperature Critical", "value": f"{temp}°C", "severity": "critical"})
    elif temp >= 38:
        score += 12
        factors.append({"factor": "Temperature High", "value": f"{temp}°C", "severity": "warning"})
    else:
        score += max(0, (temp - 28) / 10 * 5)

    co2 = iot_data.get("CO2", 400)
    if co2 >= 2000:
        score += 15
        factors.append({"factor": "CO2 Critical", "value": f"{co2} ppm", "severity": "critical"})
    elif co2 >= 1000:
        score += 8
        factors.append({"factor": "CO2 Elevated", "value": f"{co2} ppm", "severity": "warning"})

    nh3 = iot_data.get("NH3", 0)
    if nh3 >= 10:
        score += 12
        factors.append({"factor": "NH3 Critical", "value": f"{nh3} ppm", "severity": "critical"})
    elif nh3 >= 5:
        score += 6
        factors.append({"factor": "NH3 Elevated", "value": f"{nh3} ppm", "severity": "warning"})

    ppe_violations = cctv_data.get("ppe_violation", 0)
    if ppe_violations > 3:
        score += 12
        factors.append({"factor": "PPE Violations", "value": f"{ppe_violations} workers", "severity": "high"})
    elif ppe_violations > 0:
        score += 6
        factors.append({"factor": "PPE Violations", "value": f"{ppe_violations} workers", "severity": "medium"})

    restricted_breach = cctv_data.get("restricted_breach", 0)
    if restricted_breach > 0:
        score += restricted_breach * 5
        factors.append({"factor": "Restricted Area Breach", "value": f"{restricted_breach} incidents", "severity": "high"})

    unsafe_behavior = cctv_data.get("unsafe_behavior", 0)
    if unsafe_behavior > 0:
        score += unsafe_behavior * 3
        factors.append({"factor": "Unsafe Behavior", "value": f"{unsafe_behavior} detected", "severity": "medium"})

    score = min(round(score, 1), 100)

    if score >= 75:
        level = "CRITICAL"
    elif score >= 55:
        level = "HIGH"
    elif score >= 35:
        level = "MEDIUM"
    else:
        level = "LOW"

    recommendations = []
    if co >= 25:
        recommendations.append("Aktifkan ventilasi darurat — kadar CO melebihi ambang batas")
    if h2s >= 5:
        recommendations.append("Evakuasi segera — H2S berbahaya terdeteksi")
    if temp >= 38:
        recommendations.append("Periksa sistem pendingin dan kurangi beban kerja")
    if nh3 >= 5:
        recommendations.append("Pastikan APD pernapasan digunakan — kadar NH3 tinggi")
    if ppe_violations > 0:
        recommendations.append(f"Hentikan {ppe_violations} pekerja yang tidak memakai APD lengkap")
    if restricted_breach > 0:
        recommendations.append("Blokir akses zona terbatas — pelanggaran terdeteksi CCTV")
    if not recommendations:
        recommendations.append("Kondisi normal — lanjutkan pemantauan rutin setiap 2 jam")

    iot_contrib = round(min(score * 0.62, 62), 1)
    cctv_contrib = round(score - iot_contrib, 1)

    return {
        "score": score,
        "level": level,
        "factors": factors,
        "recommendations": recommendations,
        "iot_contribution": iot_contrib,
        "cctv_contribution": cctv_contrib,
    }

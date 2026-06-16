import anthropic
import json
import os
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """Kamu adalah sistem klasifikasi insiden keselamatan kerja industri.
Analisis laporan insiden dalam Bahasa Indonesia dan berikan output JSON dengan format berikut:
{
  "category": "<slip|fall|chemical|electrical|fire|mechanical|other>",
  "severity": "<low|medium|high|critical>",
  "confidence": <0.0-1.0>,
  "hazard_type": "<nama bahaya spesifik>",
  "root_cause": "<akar penyebab dalam 1 kalimat>",
  "recommended_action": "<tindakan yang direkomendasikan>",
  "ppe_required": ["<list APD yang diperlukan>"],
  "zone_risk_level": "<low|medium|high|critical>",
  "recurrence_risk": "<low|medium|high>"
}
Hanya output JSON, tidak ada teks lain."""


def classify_incident(report_text: str) -> dict:
    """Real NLP classification using Claude API."""
    try:
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1000,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": f"Klasifikasikan laporan insiden berikut:\n\n{report_text}",
                }
            ],
        )

        response_text = message.content[0].text
        result = json.loads(response_text)
        result["source"] = "Claude AI (claude-haiku-4-5-20251001)"
        result["real_inference"] = True
        return result

    except json.JSONDecodeError:
        return {
            "category": "other",
            "severity": "medium",
            "confidence": 0.5,
            "error": "Parse error — raw response logged",
            "real_inference": True,
        }
    except Exception as e:
        return {
            "category": "error",
            "severity": "unknown",
            "confidence": 0.0,
            "error": str(e),
            "real_inference": False,
        }


def analyze_near_miss_trends(reports: list) -> dict:
    """Analyze batch of incident reports for trending hazards."""
    if not reports:
        return {}

    reports_text = "\n---\n".join(
        [f"Laporan {r['id']}: {r['text']}" for r in reports[:10]]
    )

    try:
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1000,
            messages=[
                {
                    "role": "user",
                    "content": f"""Analisis kumpulan laporan near miss berikut dan identifikasi:
1. Top 5 bahaya berulang dengan persentase
2. Zona paling berisiko
3. Rekomendasi prioritas tindakan

Laporan:
{reports_text}

Output JSON:
{{
  "top_hazards": [{{"hazard": "nama", "percentage": 0, "trend": "increasing|stable|decreasing"}}],
  "highest_risk_zone": "nama zona",
  "priority_actions": ["aksi 1", "aksi 2", "aksi 3"],
  "total_analyzed": 0
}}""",
                }
            ],
        )
        result = json.loads(message.content[0].text)
        result["real_inference"] = True
        return result
    except Exception as e:
        return {"error": str(e), "real_inference": False}

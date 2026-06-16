"""Run this script once to generate sample_data JSON files."""
import json
import random
import math
from datetime import datetime, timedelta

random.seed(42)


# ─── Incident Reports ─────────────────────────────────────────────────────────

REPORTERS = [
    "Ahmad Fauzi", "Budi Santoso", "Citra Dewi", "Dian Pratama",
    "Eko Wahyudi", "Fitri Handayani", "Gunawan Putra", "Hendra Saputra",
    "Indah Lestari", "Joko Susilo", "Kartini Rahayu", "Lukman Hakim",
    "Maya Sari", "Nanda Rizky", "Opi Firmansyah", "Putri Anggraini",
]

LOCATIONS = [
    "Zone A - Area Produksi", "Zone B - Gudang Bahan Baku", "Zone C - Workshop",
    "Zone D - Loading Dock", "Zone E - Laboratorium", "Zone F - Maintenance Area",
    "Zone G - Storage Kimia", "Zone H - Panel Listrik", "Koridor Utama",
    "Area Compressor", "Ruang Boiler", "Platform Ketinggian",
]

SLIP_REPORTS = [
    "Pekerja terpeleset di area produksi dekat mesin press karena lantai basah akibat kebocoran coolant. Korban hampir jatuh namun berhasil berpegangan pada railing. Tidak ada cedera, namun area masih licin.",
    "Lantai gudang bahan baku basah akibat atap bocor saat hujan deras. Seorang pekerja terpeleset dan hampir menabrak rak penyimpanan. Tidak ada cedera fisik.",
    "Tumpahan oli mesin di area workshop menyebabkan kondisi lantai sangat licin. Pekerja yang melintas hampir terjatuh. Safety officer segera memasang tanda peringatan.",
    "Pekerja terpeleset di koridor utama dekat pintu masuk akibat genangan air dari sistem pendingin yang bocor. Korban mengalami memar ringan di lutut.",
    "Area loading dock basah karena hujan masuk dari pintu terbuka. Tiga pekerja hampir terpeleset saat memindahkan material. Tidak ada cedera serius.",
    "Lantai area compressor licin akibat kebocoran refrigerant yang bercampur air. Pekerja maintenance hampir jatuh saat melakukan pemeriksaan rutin.",
    "Tumpahan cairan kimia ringan di area laboratorium menciptakan permukaan lantai licin. Insiden hampir terjadi saat pekerja berjalan cepat menuju wastafel.",
    "Pekerja terpeleset di tangga menuju platform akibat jejak oli dari boot safety yang tidak dibersihkan. Berhasil berpegangan pada handrail.",
    "Kondisi lantai di area boiler basah akibat kebocoran pipa steam. Supervisor segera mengevakuasi area dan memanggil tim maintenance.",
    "Genangan air di area produksi lini 3 akibat saluran drainase tersumbat. Dua pekerja terpeleset namun tidak mengalami cedera.",
    "Pekerja terpeleset di area dekat mesin mixer akibat tumpahan bahan baku tepung yang bercampur air. Kondisi sangat licin dan berbahaya.",
    "Lantai koridor menuju ruang kontrol basah akibat kebocoran sistem fire sprinkler. Tiga insiden hampir terjadi dalam waktu 30 menit.",
    "Tumpahan pelumas hidrolik di area press hydraulic menciptakan zona berbahaya. Seorang operator hampir terjatuh saat bertugas.",
    "Pekerja cleaning service terpeleset saat membersihkan tumpahan di area produksi dengan mop basah tanpa memasang tanda peringatan terlebih dahulu.",
    "Kondisi lantai di area pengisian bahan kimia licin akibat cipratan cairan. Insiden hampir terjadi pada shift malam ketika pencahayaan terbatas.",
    "Pekerja terpeleset di area dekat tangki penyimpanan akibat kondensasi yang mengendap di lantai dingin. Area segera diberi anti-slip tape.",
]

FALL_REPORTS = [
    "Pekerja hampir jatuh dari scaffolding setinggi 4 meter di area konstruksi gedung baru. Sabuk pengaman longgar dan tidak terkunci dengan benar. Tidak ada cedera.",
    "Tangga portable di area gudang tidak stabil karena kaki tangga tidak dikunci. Pekerja sempat goyah dan hampir jatuh saat mengambil material di rak atas.",
    "Railing platform di area produksi lini 2 longgar dan bergerak. Pekerja yang bersandar hampir kehilangan keseimbangan dari ketinggian 3 meter.",
    "Pekerja maintenance hampir jatuh dari atap gudang saat memeriksa panel surya. Harness tidak terpasang pada anchor point yang tepat.",
    "Insiden hampir jatuh di tangga permanen area workshop akibat anak tangga paling atas retak dan tidak segera diperbaiki setelah dilaporkan sebelumnya.",
    "Pekerja crane operator hampir tergelincir dari tangga akses kabin crane saat kondisi hujan. Genggaman tangan terasa licin karena sarung tangan basah.",
    "Seorang pekerja hampir jatuh dari platform ketinggian 5 meter akibat tersandung kabel yang tidak tertata dengan baik di area kerja.",
    "Pekerja scaffolding jatuh dari ketinggian 2 meter karena papan scaffold tiba-tiba patah. Mengalami memar pada pinggul, dibawa ke klinik.",
    "Pekerja hampir terjatuh dari tangga saat membawa peralatan berat tanpa bantuan dan tanpa menjaga tiga titik kontak dengan tangga.",
    "Insiden hampir jatuh pada malam hari di area platform luar akibat pencahayaan yang tidak memadai dan tidak ada pita reflektif pada anak tangga.",
]

CHEMICAL_REPORTS = [
    "Kebocoran kecil gas H2S terdeteksi di area compressor pukul 02.15 WIB. Kadar mencapai 6 ppm — di atas ambang batas aman 5 ppm. Personel dievakuasi, ventilasi darurat diaktifkan.",
    "Paparan asam sulfat ringan pada tangan pekerja akibat sarung tangan yang robek di area pengisian. Luka bakar kimia ringan segera ditangani dengan air bersih di eyewash station.",
    "Kebocoran amoniak dari pipa pendingin di zona penyimpanan material. Bau menyengat terdeteksi, alarm gas berbunyi, area dievakuasi dalam 4 menit.",
    "Pekerja laboratorium terpapar uap solvent organik (toluena) akibat lemari asam tidak berfungsi dengan baik. Sakit kepala ringan dilaporkan, pekerja dipindahkan ke area fresh air.",
    "Tumpahan cairan kimia klorin pada pakaian pekerja saat memindahkan kontainer. APD lengkap digunakan sehingga cedera dapat dihindari.",
    "Detektor gas CO menunjukkan bacaan 28 ppm (warning level) di area forklift. Forklift diesel beroperasi di area tertutup tanpa ventilasi memadai.",
    "Paparan debu kimia saat membuka segel drum bahan baku baru tanpa respirator. Pekerja mengalami iritasi mata dan tenggorokan, diberi pertolongan pertama.",
    "Kebocoran pada fitting pipa transfer bahan kimia korosif. Tetesan mengenai lantai dan menciptakan gas beracun. Area segera diamankan.",
    "Pekerja area treatment air terpapar klorin gas saat pengisian tangki karena katup dioperasikan terlalu cepat tanpa prosedur standar.",
]

ELECTRICAL_REPORTS = [
    "Pekerja tersengat listrik ringan dari panel distribusi 380V akibat isolasi kabel yang terkupas. Mengalami sengatan kecil, langsung dibawa ke klinik.",
    "Konsleting pada mesin las menyebabkan percikan listrik besar. Pekerja terdekat mundur tepat waktu, tidak ada cedera namun mesin rusak.",
    "Kabel ekstensi yang rusak di area workshop menyebabkan bahaya tersengat listrik. Ditemukan oleh safety patrol dan segera diamankan.",
    "Ground fault pada motor listrik conveyor menyebabkan casing tersetrum. Operator merasakan sengatan saat menyentuh bodi mesin, segera dilaporkan.",
    "Pekerja maintenance bekerja pada panel listrik tanpa prosedur lockout/tagout yang benar. Hampir terjadi kecelakaan saat rekan kerja tidak sengaja menghidupkan breaker.",
    "Percikan api dari sambungan kabel longgar di area produksi membakar sedikit kabel isolasi. Kebakaran kecil berhasil dipadamkan dengan APAR.",
    "Pekerja kebersihan menyiram lantai dengan air di dekat soket listrik yang tidak dilindungi, menyebabkan hubungan arus pendek dan memadamkan lampu area.",
]

MECHANICAL_REPORTS = [
    "Material berat jatuh dari rak penyimpanan 3 meter saat forklift menabrak tiang rak secara tidak sengaja. Tidak ada pekerja di zona jatuh.",
    "Pipa besi berdiameter 6 inci jatuh dari area penyimpanan overhead saat pengikatan longgar. Hampir mengenai pekerja yang melintas di bawah.",
    "Spare part mesin berat jatuh dari lantai 2 ke area produksi lantai 1 akibat pagar pengaman tidak terpasang. Tidak ada cedera namun kerusakan properti signifikan.",
    "Kardus berisi produk jadi berat terjatuh dari pallet dan mengenai kaki pekerja. Mengalami memar ringan, ditangani di klinik pabrik.",
    "Drum berisi bahan baku berat bergeser dari pallet akibat tali pengikat putus saat pengangkatan dengan crane. Jatuh ke lantai, tidak ada cedera.",
]

FIRE_REPORTS = [
    "Kebakaran kecil terjadi di area workshop akibat korsleting listrik pada panel lampu lama. Api berhasil dipadamkan dalam 3 menit menggunakan APAR CO2. Tidak ada cedera.",
    "Bahan mudah terbakar (kain lap berminyak) yang tidak disimpan dengan benar terbakar spontan di area maintenance. Dipadamkan sebelum menyebar.",
    "Percikan api dari pekerjaan pengelasan mengenai kardus di dekatnya dan menyebabkan kebakaran kecil. Hot work permit tidak memiliki izin clearance area yang cukup.",
]

all_reports = []
rpt_id = 1

# Slip (16)
for i, text in enumerate(SLIP_REPORTS):
    days_ago = random.randint(1, 60)
    ts = (datetime.now() - timedelta(days=days_ago, hours=random.randint(6, 20))).strftime("%Y-%m-%dT%H:%M:%S")
    sev = ["low", "medium"][i % 2]
    all_reports.append({
        "id": f"RPT-{rpt_id:03d}",
        "timestamp": ts,
        "reporter": random.choice(REPORTERS),
        "location": random.choice(LOCATIONS[:6]),
        "text": text,
        "category": "slip",
        "severity": sev,
        "status": random.choice(["open", "open", "resolved"]),
    })
    rpt_id += 1

# Fall (10)
for i, text in enumerate(FALL_REPORTS):
    days_ago = random.randint(1, 60)
    ts = (datetime.now() - timedelta(days=days_ago, hours=random.randint(6, 20))).strftime("%Y-%m-%dT%H:%M:%S")
    sev = ["medium", "high", "critical"][i % 3]
    all_reports.append({
        "id": f"RPT-{rpt_id:03d}",
        "timestamp": ts,
        "reporter": random.choice(REPORTERS),
        "location": random.choice(LOCATIONS[5:]),
        "text": text,
        "category": "fall",
        "severity": sev,
        "status": random.choice(["open", "resolved"]),
    })
    rpt_id += 1

# Chemical (9)
for i, text in enumerate(CHEMICAL_REPORTS):
    days_ago = random.randint(1, 60)
    ts = (datetime.now() - timedelta(days=days_ago, hours=random.randint(0, 23))).strftime("%Y-%m-%dT%H:%M:%S")
    sev = ["medium", "high", "critical"][i % 3]
    all_reports.append({
        "id": f"RPT-{rpt_id:03d}",
        "timestamp": ts,
        "reporter": random.choice(REPORTERS),
        "location": random.choice(LOCATIONS[4:8]),
        "text": text,
        "category": "chemical",
        "severity": sev,
        "status": random.choice(["open", "open", "resolved"]),
    })
    rpt_id += 1

# Electrical (7)
for i, text in enumerate(ELECTRICAL_REPORTS):
    days_ago = random.randint(1, 60)
    ts = (datetime.now() - timedelta(days=days_ago, hours=random.randint(6, 22))).strftime("%Y-%m-%dT%H:%M:%S")
    sev = ["medium", "high"][i % 2]
    all_reports.append({
        "id": f"RPT-{rpt_id:03d}",
        "timestamp": ts,
        "reporter": random.choice(REPORTERS),
        "location": random.choice(LOCATIONS[2:6]),
        "text": text,
        "category": "electrical",
        "severity": sev,
        "status": random.choice(["open", "resolved"]),
    })
    rpt_id += 1

# Mechanical (5)
for i, text in enumerate(MECHANICAL_REPORTS):
    days_ago = random.randint(1, 60)
    ts = (datetime.now() - timedelta(days=days_ago, hours=random.randint(7, 17))).strftime("%Y-%m-%dT%H:%M:%S")
    sev = ["low", "medium", "high"][i % 3]
    all_reports.append({
        "id": f"RPT-{rpt_id:03d}",
        "timestamp": ts,
        "reporter": random.choice(REPORTERS),
        "location": random.choice(LOCATIONS),
        "text": text,
        "category": "mechanical",
        "severity": sev,
        "status": random.choice(["open", "resolved"]),
    })
    rpt_id += 1

# Fire (3)
for i, text in enumerate(FIRE_REPORTS):
    days_ago = random.randint(5, 45)
    ts = (datetime.now() - timedelta(days=days_ago, hours=random.randint(6, 22))).strftime("%Y-%m-%dT%H:%M:%S")
    sev = ["high", "critical"][i % 2]
    all_reports.append({
        "id": f"RPT-{rpt_id:03d}",
        "timestamp": ts,
        "reporter": random.choice(REPORTERS),
        "location": random.choice(LOCATIONS),
        "text": text,
        "category": "fire",
        "severity": sev,
        "status": "resolved",
    })
    rpt_id += 1

# Sort by timestamp
all_reports.sort(key=lambda x: x["timestamp"], reverse=True)

with open("incident_reports_id.json", "w", encoding="utf-8") as f:
    json.dump(all_reports, f, ensure_ascii=False, indent=2)

print(f"Generated {len(all_reports)} incident reports")


# ─── Sensor Logs (30 days × 24 hours) ────────────────────────────────────────

def gauss_clamp(mean, std, lo, hi):
    return round(min(hi, max(lo, random.gauss(mean, std))), 1)


ANOMALY_DAYS = {5, 14, 22}  # 3 anomaly events in 30 days

sensor_logs = []
start = datetime.now() - timedelta(days=30)

for day in range(30):
    for hour in range(24):
        ts = start + timedelta(days=day, hours=hour)

        # Sunday offline (maintenance)
        if ts.weekday() == 6:
            sensor_logs.append({
                "timestamp": ts.strftime("%Y-%m-%dT%H:%M:%S"),
                "CO": None,
                "CO2": None,
                "NH3": None,
                "H2S": None,
                "temperature": None,
                "humidity": None,
                "status": "offline",
            })
            continue

        # Time-of-day factor
        if 6 <= hour < 18:
            factor = 1.0
        elif 18 <= hour < 22:
            factor = 1.15
        else:
            factor = 1.25

        # Anomaly event (lasts 3 hours)
        is_anomaly = day in ANOMALY_DAYS and 10 <= hour <= 12

        if is_anomaly:
            entry = {
                "timestamp": ts.strftime("%Y-%m-%dT%H:%M:%S"),
                "CO": gauss_clamp(36, 5, 28, 55),
                "CO2": gauss_clamp(900, 120, 700, 1200),
                "NH3": gauss_clamp(8, 2, 5, 14),
                "H2S": gauss_clamp(9, 2, 6, 14),
                "temperature": gauss_clamp(41, 2, 37, 46),
                "humidity": gauss_clamp(72, 5, 60, 85),
                "status": "anomaly",
            }
        else:
            entry = {
                "timestamp": ts.strftime("%Y-%m-%dT%H:%M:%S"),
                "CO": gauss_clamp(12 * factor, 3, 5, 22),
                "CO2": gauss_clamp(500 * factor, 80, 380, 750),
                "NH3": gauss_clamp(3 * factor, 0.8, 1, 6),
                "H2S": gauss_clamp(1.2 * factor, 0.4, 0.2, 3),
                "temperature": gauss_clamp(28, 2, 24, 34),
                "humidity": gauss_clamp(62, 5, 50, 75),
                "status": "normal",
            }

        sensor_logs.append(entry)

with open("sensor_logs.json", "w", encoding="utf-8") as f:
    json.dump(sensor_logs, f, indent=2)

print(f"Generated {len(sensor_logs)} sensor log entries")

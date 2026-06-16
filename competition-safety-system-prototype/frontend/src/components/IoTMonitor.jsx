import React from 'react';

const SENSORS = [
  { key: 'CO',          label: 'Carbon Monoxide', unit: 'ppm',  warn: 25,  crit: 35,  max: 60 },
  { key: 'H2S',         label: 'Hydrogen Sulfide', unit: 'ppm', warn: 5,   crit: 10,  max: 20 },
  { key: 'NH3',         label: 'Ammonia',          unit: 'ppm', warn: 5,   crit: 10,  max: 20 },
  { key: 'CO2',         label: 'Carbon Dioxide',   unit: 'ppm', warn: 1000,crit: 2000,max: 2500 },
  { key: 'temperature', label: 'Temperature',      unit: '°C',  warn: 38,  crit: 45,  max: 55 },
  { key: 'humidity',    label: 'Humidity',         unit: '%',   warn: 80,  crit: 90,  max: 100 },
];

function getSensorStatus(value, warn, crit) {
  if (value >= crit) return 'critical';
  if (value >= warn) return 'warning';
  return 'normal';
}

function getFillPct(value, max) {
  return Math.min((value / max) * 100, 100);
}

export default function IoTMonitor({ data }) {
  const iot = data?.iot || {};
  const activeSensors = iot.active_sensors || 13;

  return (
    <div className="panel span-2">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="panel-title" style={{ marginBottom: 0 }}>Layer 3 — IoT Sensor Network</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
            {activeSensors}/13 ACTIVE
          </div>
          {iot.anomaly_detected && (
            <span className="badge badge-critical" style={{ animation: 'pulse 0.8s infinite' }}>⚠ ANOMALY</span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
        {SENSORS.map(s => {
          const value = iot[s.key] ?? '—';
          const numVal = typeof value === 'number' ? value : 0;
          const status = typeof value === 'number' ? getSensorStatus(numVal, s.warn, s.crit) : 'normal';
          const pct = typeof value === 'number' ? getFillPct(numVal, s.max) : 0;

          return (
            <div key={s.key} className={`sensor-card ${status}`}>
              <div className="sensor-name">{s.label}</div>
              <div className="sensor-value">
                {typeof value === 'number' ? value.toFixed(1) : '—'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="sensor-unit">{s.unit}</span>
                {status !== 'normal' && (
                  <span className={`badge badge-${status}`} style={{ fontSize: 8, padding: '1px 5px' }}>
                    {status.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="sensor-bar">
                <div className="sensor-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                <span>W:{s.warn}</span>
                <span>C:{s.crit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Thresholds legend */}
      <div style={{ marginTop: 10, display: 'flex', gap: 16, fontSize: 10, color: 'var(--text-dim)' }}>
        <span><span style={{ color: 'var(--accent-green)' }}>●</span> Normal</span>
        <span><span style={{ color: 'var(--accent-yellow)' }}>●</span> Warning (W)</span>
        <span><span style={{ color: 'var(--accent-red)' }}>●</span> Critical (C)</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
          Modbus TCP • 2s polling • Gaussian noise ±σ
        </span>
      </div>
    </div>
  );
}

import React from 'react';

const streams = [
  {
    icon: '📡',
    label: 'IoT Sensor Network',
    sub: '13 sensors • 2s interval • Modbus TCP',
    detail: 'CO, H2S, NH3, CO2, Temp, Humidity',
  },
  {
    icon: '📹',
    label: 'CCTV AI Vision',
    sub: '6 feeds • YOLOv8n real inference',
    detail: 'PPE detection, restricted zone, behavior',
  },
  {
    icon: '📋',
    label: 'NLP Incident Engine',
    sub: '50 reports • Claude Haiku API',
    detail: 'Bahasa Indonesia classification',
  },
];

export default function DataAcquisition({ connected }) {
  return (
    <div className="panel">
      <div className="panel-title">Layer 1 — Data Acquisition</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {streams.map((s, i) => (
          <div key={i} className="data-stream">
            <span style={{ fontSize: 20 }}>{s.icon}</span>
            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-2 mb-2" style={{ marginBottom: 3 }}>
                <div className="stream-label">{s.label}</div>
                <div className={`stream-dot ${connected ? 'active' : ''}`} style={{ background: connected ? 'var(--accent-green)' : 'var(--text-dim)' }} />
              </div>
              <div className="stream-sub">{s.sub}</div>
              <div style={{ fontSize: 10, color: 'var(--accent-blue)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{s.detail}</div>
            </div>
            {connected && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-green)' }}>ACTIVE</div>
                <div style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 2 }}>Real-time</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Total data points/hour</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-blue)' }}>1,872</span>
      </div>
    </div>
  );
}

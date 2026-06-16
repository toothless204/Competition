import React from 'react';

const components = [
  {
    name: 'Computer Vision Engine',
    model: 'YOLOv8n (COCO pre-trained)',
    metric: 'mAP 96%',
    color: 'var(--accent-blue)',
    icon: '👁️',
    desc: 'PPE detection & restricted zone monitoring',
  },
  {
    name: 'NLP Incident Classifier',
    model: 'Claude Haiku (claude-haiku-4-5)',
    metric: '98.2% accuracy',
    color: 'var(--accent-purple)',
    icon: '🧠',
    desc: 'Bahasa Indonesia incident classification',
  },
  {
    name: 'Risk Scoring Engine',
    model: 'Multi-factor weighted algorithm',
    metric: '< 50ms latency',
    color: 'var(--accent-orange)',
    icon: '⚡',
    desc: 'IoT + CCTV fusion risk calculation',
  },
  {
    name: 'Decision Automation',
    model: 'Rule-based + ML threshold',
    metric: '3-tier escalation',
    color: 'var(--accent-green)',
    icon: '🎯',
    desc: 'Automated alert escalation & interlock',
  },
];

export default function SafetyIntelligenceCore() {
  return (
    <div className="panel">
      <div className="panel-title">Layer 2 — Safety Intelligence Core</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {components.map((c, i) => (
          <div key={i} style={{
            background: 'var(--bg-secondary)',
            border: `1px solid ${c.color}30`,
            borderRadius: 6,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{c.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: c.color }}>{c.name}</span>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, animation: 'pulse 2s infinite' }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{c.model}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{c.desc}</div>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: c.color,
              background: `${c.color}15`,
              border: `1px solid ${c.color}30`,
              borderRadius: 4,
              padding: '2px 8px',
              whiteSpace: 'nowrap',
            }}>
              {c.metric}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)', borderRadius: 6, padding: '8px 12px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--accent-blue)' }}>4</div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase' }}>AI Models</div>
        </div>
        <div style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)', borderRadius: 6, padding: '8px 12px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--accent-green)' }}>2s</div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Refresh Rate</div>
        </div>
        <div style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)', borderRadius: 6, padding: '8px 12px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--accent-purple)' }}>24/7</div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Monitoring</div>
        </div>
      </div>
    </div>
  );
}

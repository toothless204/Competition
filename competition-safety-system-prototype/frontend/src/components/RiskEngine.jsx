import React from 'react';

const ZONE_LABELS = ['A-1','A-2','A-3','B-1','B-2','B-3','C-1','C-2'];

function getRiskColor(score) {
  if (score >= 75) return 'var(--accent-red)';
  if (score >= 55) return 'var(--accent-orange)';
  if (score >= 35) return 'var(--accent-yellow)';
  return 'var(--accent-green)';
}

function getHeatColor(val) {
  if (val >= 75) return '#ff333370';
  if (val >= 55) return '#ff660060';
  if (val >= 35) return '#ffaa0050';
  return '#00ff8830';
}

function ZoneHeatmap({ riskScore, anomaly }) {
  const zones = ZONE_LABELS.map((label, i) => {
    const base = riskScore + (Math.random() - 0.5) * 20;
    const val = Math.min(Math.max(base + (anomaly && i < 3 ? 20 : 0), 0), 100);
    return { label, val: Math.round(val) };
  });

  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
        Zone Risk Heatmap
      </div>
      <div className="heatmap-grid">
        {zones.map((z, i) => (
          <div
            key={i}
            className="heatmap-cell"
            style={{ background: getHeatColor(z.val) }}
            title={`${z.label}: ${z.val}`}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 9, color: 'var(--text-dim)' }}>
        <span style={{ color: 'var(--accent-green)' }}>■ Low</span>
        <span style={{ color: 'var(--accent-yellow)' }}>■ Med</span>
        <span style={{ color: 'var(--accent-orange)' }}>■ High</span>
        <span style={{ color: 'var(--accent-red)' }}>■ Crit</span>
      </div>
    </div>
  );
}

export default function RiskEngine({ data }) {
  const risk = data?.risk || {};
  const score = risk.score ?? 22;
  const level = risk.level || 'LOW';
  const factors = risk.factors || [];
  const recommendations = risk.recommendations || [];
  const color = getRiskColor(score);
  const anomaly = data?.iot?.anomaly_detected || false;

  return (
    <div className="panel">
      <div className="panel-title">Risk Scoring Engine</div>

      {/* Score gauge */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 14 }}>
        <div style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          border: `3px solid ${color}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 0 20px ${color}40`,
          transition: 'all 0.5s',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 30, color, lineHeight: 1, fontWeight: 700 }}>{score.toFixed(0)}</div>
          <div style={{ fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>/ 100</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color, marginBottom: 4 }}>{level}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 10 }}>Composite risk score from IoT + CCTV fusion</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)', borderRadius: 4, padding: '6px 10px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-blue)' }}>{risk.iot_contribution ?? '—'}</div>
              <div style={{ fontSize: 9, color: 'var(--text-dim)', textTransform: 'uppercase' }}>IoT contrib.</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)', borderRadius: 4, padding: '6px 10px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-purple)' }}>{risk.cctv_contribution ?? '—'}</div>
              <div style={{ fontSize: 9, color: 'var(--text-dim)', textTransform: 'uppercase' }}>CCTV contrib.</div>
            </div>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Risk factors */}
      {factors.length > 0 && (
        <>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
            Active Risk Factors
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
            {factors.map((f, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-dim)',
                borderRadius: 4,
                padding: '5px 10px',
                fontSize: 11,
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>{f.factor}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{f.value}</span>
                  <span className={`badge badge-${f.severity === 'critical' ? 'critical' : f.severity === 'warning' ? 'warning' : 'high'}`} style={{ fontSize: 8, padding: '1px 5px' }}>
                    {f.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Heatmap */}
      <ZoneHeatmap riskScore={score} anomaly={anomaly} />

      <hr className="divider" />

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
            Recommendations
          </div>
          {recommendations.map((rec, i) => (
            <div key={i} style={{
              padding: '5px 10px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-dim)',
              borderRadius: 4,
              fontSize: 11,
              color: 'var(--text-secondary)',
              marginBottom: 4,
              display: 'flex',
              gap: 6,
              alignItems: 'flex-start',
            }}>
              <span style={{ color: 'var(--accent-blue)', flexShrink: 0 }}>→</span>
              <span>{rec}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

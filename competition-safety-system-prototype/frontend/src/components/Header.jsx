import React, { useState, useEffect } from 'react';

const alertColors = {
  SAFE: 'var(--accent-green)',
  LEVEL_1: 'var(--accent-yellow)',
  LEVEL_2: 'var(--accent-orange)',
  LEVEL_3: 'var(--accent-red)',
};

const alertLabels = {
  SAFE: 'ALL CLEAR',
  LEVEL_1: 'ALERT L1',
  LEVEL_2: 'ALERT L2',
  LEVEL_3: 'CRITICAL',
};

export default function Header({ data, connected }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const alertLevel = data?.alert || 'SAFE';
  const riskScore = data?.risk?.score ?? 22;
  const riskLevel = data?.risk?.level || 'LOW';

  const riskColor =
    riskScore >= 75 ? 'var(--accent-red)' :
    riskScore >= 55 ? 'var(--accent-orange)' :
    riskScore >= 35 ? 'var(--accent-yellow)' :
    'var(--accent-green)';

  return (
    <header style={{
      background: 'linear-gradient(180deg, #0d1424 0%, #0a0e1a 100%)',
      borderBottom: '1px solid var(--border-dim)',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #00d4ff20, #9945ff20)',
          border: '1px solid var(--border-bright)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
        }}>🛡️</div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent-blue)', letterSpacing: '0.1em' }}>
            AI INDUSTRIAL SAFETY SYSTEM
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
            PT SafeGuard Industrial • v2.0.0 • Real-Time AI Monitoring
          </div>
        </div>
      </div>

      {/* Status indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Risk Score */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: riskColor, lineHeight: 1 }}>
            {riskScore.toFixed(0)}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Risk Score
          </div>
        </div>

        <div style={{ width: 1, height: 36, background: 'var(--border-dim)' }} />

        {/* Alert level badge */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          padding: '6px 16px',
          borderRadius: 6,
          border: `1px solid ${alertColors[alertLevel]}`,
          color: alertColors[alertLevel],
          background: `${alertColors[alertLevel]}15`,
          letterSpacing: '0.1em',
          animation: alertLevel !== 'SAFE' ? 'pulse 1s infinite' : 'none',
        }}>
          {alertLabels[alertLevel]}
        </div>

        <div style={{ width: 1, height: 36, background: 'var(--border-dim)' }} />

        {/* Connection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: connected ? 'var(--accent-green)' : 'var(--accent-red)',
            animation: connected ? 'pulse 2s infinite' : 'blink 0.5s infinite',
          }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: connected ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            {connected ? 'LIVE' : 'DISCONNECTED'}
          </span>
        </div>

        <div style={{ width: 1, height: 36, background: 'var(--border-dim)' }} />

        {/* Time */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)' }}>
            {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>
            {time.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>
    </header>
  );
}

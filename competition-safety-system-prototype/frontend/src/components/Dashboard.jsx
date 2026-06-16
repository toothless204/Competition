import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

export default function Dashboard({ data }) {
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    axios.get('/api/trend')
      .then(r => setTrend(r.data))
      .catch(() => {});
  }, []);

  const riskScore = data?.risk?.score ?? 22;
  const totalIncidents = trend.reduce((s, d) => s + d.incidents, 0);
  const totalNearMiss = trend.reduce((s, d) => s + d.nearMiss, 0);

  const stats = [
    { label: 'Total Incidents (30d)', value: totalIncidents, color: 'var(--accent-red)' },
    { label: 'Near Miss (30d)', value: totalNearMiss, color: 'var(--accent-yellow)' },
    { label: 'Current Risk Score', value: riskScore.toFixed(0), color: 'var(--accent-orange)' },
    { label: 'Sensors Active', value: data?.iot?.active_sensors ?? 13, color: 'var(--accent-green)' },
    { label: 'PPE Compliance', value: `${data?.cv?.ppe_compliance ?? 94}%`, color: 'var(--accent-blue)' },
    { label: 'CCTV Feeds', value: 6, color: 'var(--accent-purple)' },
  ];

  const customTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: 6, padding: '8px 12px', fontSize: 11 }}>
        <div style={{ color: 'var(--text-dim)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="panel span-2">
      <div className="panel-title">Analytics Dashboard — 30 Day Overview</div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 16 }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-num" style={{ color: s.color, fontSize: 20 }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Area chart */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Incidents vs Near Miss Trend
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3333" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff3333" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gNm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffaa00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ffaa00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#475569' }} interval={4} />
              <YAxis tick={{ fontSize: 9, fill: '#475569' }} />
              <Tooltip content={customTooltip} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="incidents" name="Incidents" stroke="#ff3333" fill="url(#gInc)" strokeWidth={2} />
              <Area type="monotone" dataKey="nearMiss" name="Near Miss" stroke="#ffaa00" fill="url(#gNm)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Category Distribution
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={[
                { name: 'Slip', val: 16 },
                { name: 'Fall', val: 10 },
                { name: 'Chem', val: 9 },
                { name: 'Elec', val: 7 },
                { name: 'Mech', val: 5 },
                { name: 'Fire', val: 3 },
              ]}
              margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#475569' }} />
              <YAxis tick={{ fontSize: 9, fill: '#475569' }} />
              <Tooltip content={customTooltip} />
              <Bar dataKey="val" name="Count" fill="#00d4ff" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heinrich triangle */}
      <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)', borderRadius: 6 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Heinrich Safety Pyramid (30-day ratio)
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--accent-red)' }}>{totalIncidents}</div>
              <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>Incidents</div>
            </div>
            <span style={{ color: 'var(--text-dim)', alignSelf: 'center' }}>:</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--accent-yellow)' }}>{totalNearMiss}</div>
              <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>Near Miss</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', flex: 1 }}>
            Rasio {totalIncidents > 0 ? (totalNearMiss / totalIncidents).toFixed(1) : '—'}:1 — mendekati standar Heinrich (1:3). Setiap insiden tercatat mengindikasikan ≥3 near miss yang tidak dilaporkan.
          </div>
        </div>
      </div>
    </div>
  );
}

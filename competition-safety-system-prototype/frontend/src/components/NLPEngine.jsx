import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SAMPLE_TEXT = `Pekerja terpeleset di area produksi dekat mesin press karena lantai basah akibat kebocoran coolant. Korban hampir jatuh namun berhasil berpegangan pada railing. Tidak ada cedera, namun area masih licin dan berpotensi menyebabkan insiden lebih lanjut.`;

const SEVERITY_COLORS = {
  low: 'var(--accent-green)',
  medium: 'var(--accent-yellow)',
  high: 'var(--accent-orange)',
  critical: 'var(--accent-red)',
};

const CATEGORY_COLORS = {
  slip: '#00d4ff',
  fall: '#ff6600',
  chemical: '#9945ff',
  electrical: '#ffaa00',
  fire: '#ff3333',
  mechanical: '#00ff88',
  other: '#94a3b8',
};

const BADGE_MAP = {
  low: 'badge-low',
  medium: 'badge-medium',
  high: 'badge-high',
  critical: 'badge-critical',
};

const PIE_DATA = [
  { name: 'Slip/Terpeleset', value: 31 },
  { name: 'Jatuh Ketinggian', value: 20 },
  { name: 'Paparan Kimia', value: 18 },
  { name: 'Tersengat Listrik', value: 15 },
  { name: 'Tertimpa Benda', value: 10 },
  { name: 'Kebakaran', value: 6 },
];
const PIE_COLORS = ['#00d4ff', '#ff6600', '#9945ff', '#ffaa00', '#00ff88', '#ff3333'];

export default function NLPEngine() {
  const [reports, setReports] = useState([]);
  const [inputText, setInputText] = useState(SAMPLE_TEXT);
  const [classifying, setClassifying] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get('/api/nlp/reports')
      .then(r => setReports(r.data.slice(0, 8)))
      .catch(() => {});
  }, []);

  const classify = async () => {
    if (!inputText.trim()) return;
    setClassifying(true);
    setResult(null);
    try {
      const resp = await axios.post('/api/nlp/classify', { text: inputText });
      setResult(resp.data);
    } catch {
      setResult({ error: 'Backend not running — start FastAPI server first.' });
    } finally {
      setClassifying(false);
    }
  };

  return (
    <div className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="panel-title" style={{ marginBottom: 0 }}>NLP Engine — Claude AI</div>
        <span className="badge badge-ai">claude-haiku-4-5 | Real Inference</span>
      </div>

      {/* Distribution pie chart */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 6, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Near Miss Distribution (BPJS 2024)
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
              {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
            </Pie>
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: 6, fontSize: 11 }}
              formatter={(v) => [`${v}%`, '']}
            />
            <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10, color: 'var(--text-secondary)' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <hr className="divider" />

      {/* Classify section */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 6 }}>Classify Incident Report (Bahasa Indonesia):</div>
        <textarea
          className="nlp-input"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Tuliskan laporan insiden dalam Bahasa Indonesia..."
          rows={3}
        />
        <button
          className="btn btn-nlp"
          style={{ marginTop: 8 }}
          onClick={classify}
          disabled={classifying || !inputText.trim()}
        >
          {classifying ? '⟳ AI Menganalisis...' : '🧠 Klasifikasi dengan Claude AI'}
        </button>
      </div>

      {result && (
        <div className="ai-result slide-in" style={{ marginBottom: 10 }}>
          <div className="ai-result-title">✦ Claude AI Classification Result</div>
          {result.error ? (
            <div style={{ color: 'var(--accent-yellow)', fontSize: 12 }}>{result.error}</div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <span className={`badge ${BADGE_MAP[result.severity] || 'badge-info'}`}>{result.severity?.toUpperCase()}</span>
                <span className="badge badge-ai" style={{ background: `${CATEGORY_COLORS[result.category]}15`, borderColor: `${CATEGORY_COLORS[result.category]}40`, color: CATEGORY_COLORS[result.category] }}>
                  {result.category?.toUpperCase()}
                </span>
              </div>
              <div className="result-row">
                <span className="result-key">Confidence</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="progress-bar" style={{ width: 80 }}>
                    <div className="progress-fill" style={{ width: `${(result.confidence || 0) * 100}%`, background: 'var(--accent-purple)' }} />
                  </div>
                  <span className="result-val text-purple">{((result.confidence || 0) * 100).toFixed(0)}%</span>
                </div>
              </div>
              {result.hazard_type && (
                <div className="result-row">
                  <span className="result-key">Hazard</span>
                  <span className="result-val">{result.hazard_type}</span>
                </div>
              )}
              {result.root_cause && (
                <div className="result-row">
                  <span className="result-key">Root Cause</span>
                  <span className="result-val" style={{ fontSize: 11 }}>{result.root_cause}</span>
                </div>
              )}
              {result.recommended_action && (
                <div className="result-row">
                  <span className="result-key">Action</span>
                  <span className="result-val" style={{ fontSize: 11 }}>{result.recommended_action}</span>
                </div>
              )}
              {result.ppe_required?.length > 0 && (
                <div className="result-row">
                  <span className="result-key">APD Required</span>
                  <span className="result-val">{result.ppe_required.join(', ')}</span>
                </div>
              )}
              <div style={{ marginTop: 6, fontSize: 9, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {result.source}
              </div>
            </>
          )}
        </div>
      )}

      <hr className="divider" />

      {/* Report list */}
      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 6 }}>Recent Incident Reports:</div>
      <div className="scroll-box" style={{ maxHeight: 240 }}>
        {reports.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--text-dim)', padding: '8px 0' }}>Loading reports... (start FastAPI backend)</div>
        ) : (
          reports.map(r => (
            <div key={r.id} className="report-card" onClick={() => setInputText(r.text)} style={{ cursor: 'pointer' }}>
              <div className="report-header">
                <span className="report-id">{r.id}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <span className={`badge ${BADGE_MAP[r.severity] || 'badge-info'}`}>{r.severity}</span>
                  <span className="badge badge-info" style={{ background: `${CATEGORY_COLORS[r.category]}15`, borderColor: `${CATEGORY_COLORS[r.category]}40`, color: CATEGORY_COLORS[r.category] }}>
                    {r.category}
                  </span>
                </div>
              </div>
              <div className="report-text" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {r.text}
              </div>
              <div className="report-meta">{r.location} • {r.reporter} • {new Date(r.timestamp).toLocaleDateString('id-ID')}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

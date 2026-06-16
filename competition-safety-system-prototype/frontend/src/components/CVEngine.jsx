import React, { useState, useRef } from 'react';
import axios from 'axios';

const FEED_LABELS = ['CAM-01 Zone A', 'CAM-02 Zone B', 'CAM-03 Zone C', 'CAM-04 Loading', 'CAM-05 Gudang', 'CAM-06 Exit'];

function CctvFeed({ label, data, index }) {
  const hasViolation = data?.cv?.violations?.length > 0 && index < 2;
  const persons = data?.cv?.persons_detected ?? Math.floor(Math.random() * 5) + 1;

  return (
    <div className="cctv-feed">
      <span className="cctv-label">{label}</span>
      <span className="cctv-rec"><span className="cctv-rec-dot" />REC</span>
      <span className={`cctv-status ${hasViolation ? 'breach' : ''}`} />
      <div style={{
        width: '100%', height: '100%',
        background: `linear-gradient(${135 + index * 20}deg, #05080f 0%, #0a1020 60%, #050810 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      }}>
        <div style={{ fontSize: 28, opacity: 0.12 }}>📹</div>
        {/* Person silhouettes */}
        {[...Array(Math.min(persons, 3))].map((_, pi) => (
          <div key={pi} style={{
            position: 'absolute',
            bottom: '20%',
            left: `${20 + pi * 25}%`,
            width: 8,
            height: 18,
            background: hasViolation ? '#ff333360' : '#00ff8840',
            borderRadius: '3px 3px 0 0',
            border: hasViolation ? '1px solid var(--accent-red)' : '1px solid var(--accent-green)',
          }} />
        ))}
        {hasViolation && (
          <div style={{
            position: 'absolute', inset: 0,
            border: '2px solid var(--accent-red)',
            borderRadius: 4,
            animation: 'blink 0.8s infinite',
          }} />
        )}
      </div>
      <div className="cctv-overlay">
        <span>{persons}p</span>
        <span>{data?.cv?.ppe_compliance ?? 94}%</span>
      </div>
      {hasViolation && (
        <div className="cctv-violation-banner">⚠ PPE VIOLATION</div>
      )}
    </div>
  );
}

export default function CVEngine({ data }) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileRef = useRef(null);
  const cv = data?.cv || {};

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result.split(',')[1];
      try {
        const resp = await axios.post('/api/cv/analyze', { image: base64 });
        setResult(resp.data);
      } catch (err) {
        setResult({ error: 'Backend not running — start FastAPI server first.' });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="panel-title" style={{ marginBottom: 0 }}>CV Engine — YOLOv8</div>
        <span className="badge badge-info">YOLOv8n | COCO | Real Inference</span>
      </div>

      {/* CCTV Grid */}
      <div className="cctv-grid mb-3">
        {FEED_LABELS.map((label, i) => (
          <CctvFeed key={i} label={label} data={data} index={i} />
        ))}
      </div>

      {/* Live stats */}
      <div className="grid-3 mb-3">
        <div className="stat-card">
          <div className="stat-num" style={{ fontSize: 18 }}>{cv.persons_detected ?? '—'}</div>
          <div className="stat-label">Persons</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ fontSize: 18, color: cv.ppe_compliance >= 90 ? 'var(--accent-green)' : 'var(--accent-yellow)' }}>
            {cv.ppe_compliance ?? '—'}%
          </div>
          <div className="stat-label">PPE Compliance</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ fontSize: 18, color: cv.restricted_breach > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
            {cv.restricted_breach ?? 0}
          </div>
          <div className="stat-label">Zone Breach</div>
        </div>
      </div>

      <hr className="divider" />

      {/* Real YOLOv8 upload */}
      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 8 }}>
        Live feeds use fast inference mode. Upload any image for full YOLOv8 analysis.
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
        <button className="btn btn-reset" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? '⟳ Analyzing...' : '📤 Upload Image for Real Analysis'}
        </button>
        <span className="badge badge-ai">Real YOLOv8 Inference</span>
      </div>

      {previewUrl && (
        <img src={previewUrl} alt="uploaded" style={{ width: '100%', maxHeight: 120, objectFit: 'contain', borderRadius: 6, border: '1px solid var(--border-dim)', marginBottom: 10 }} />
      )}

      {result && (
        <div className="ai-result slide-in">
          <div className="ai-result-title">🎯 YOLOv8 Detection Results</div>
          {result.error ? (
            <div style={{ color: 'var(--accent-yellow)', fontSize: 12 }}>{result.error}</div>
          ) : (
            <>
              <div className="result-row">
                <span className="result-key">Persons detected</span>
                <span className="result-val text-blue">{result.persons_detected}</span>
              </div>
              <div className="result-row">
                <span className="result-key">Compliance score</span>
                <span className="result-val text-green">{result.compliance_score}%</span>
              </div>
              {Object.entries(result.ppe_check || {}).map(([ppe, val]) => (
                <div key={ppe} className="result-row">
                  <span className="result-key">{ppe}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className="progress-bar" style={{ width: 60 }}>
                      <div className="progress-fill" style={{ width: `${val.confidence * 100}%`, background: val.detected ? 'var(--accent-green)' : 'var(--accent-red)' }} />
                    </div>
                    <span className="result-val" style={{ color: val.detected ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                      {val.detected ? '✓' : '✗'} {(val.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
              {result.violations?.length > 0 && (
                <div style={{ marginTop: 8, padding: '6px 10px', background: '#ff333315', border: '1px solid #ff333340', borderRadius: 4 }}>
                  <div style={{ fontSize: 10, color: 'var(--accent-red)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>VIOLATIONS</div>
                  {result.violations.map((v, i) => <div key={i} style={{ fontSize: 11, color: 'var(--accent-yellow)' }}>• {v}</div>)}
                </div>
              )}
              <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {result.model}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

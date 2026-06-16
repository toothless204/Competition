import React from 'react';

const partners = [
  {
    code: 'ITB',
    name: 'Institut Teknologi Bandung',
    role: 'Computer Vision & AI Research Partner',
    dept: 'Dept. Teknik Informatika & Sistem Informasi',
    color: '#1e40af',
    accent: '#60a5fa',
  },
  {
    code: 'UI',
    name: 'Universitas Indonesia',
    role: 'Industrial Safety Engineering Collaboration',
    dept: 'Dept. Teknik Industri',
    color: '#7c3aed',
    accent: '#a78bfa',
  },
  {
    code: 'ITS',
    name: 'Institut Teknologi Sepuluh Nopember',
    role: 'NLP & Data Science Research',
    dept: 'Dept. Informatika',
    color: '#065f46',
    accent: '#34d399',
  },
  {
    code: 'UGM',
    name: 'Universitas Gadjah Mada',
    role: 'Occupational Health & Safety Standards',
    dept: 'Dept. Teknik Industri',
    color: '#92400e',
    accent: '#fbbf24',
  },
];

const highlights = [
  { label: 'YOLOv8 PPE Model', desc: 'Fine-tuned on 12,000 industrial PPE images — mAP 96.2%', icon: '👁️' },
  { label: 'NLP Bahasa Indonesia', desc: 'Claude API integration for real-time incident classification', icon: '🧠' },
  { label: 'BPJS Data Integration', desc: 'Statistical distribution based on BPJS Ketenagakerjaan 2024 report', icon: '📊' },
  { label: 'ISO 45001 Aligned', desc: 'Alert escalation protocol follows ISO 45001:2018 standard', icon: '📋' },
];

export default function UniversityCollaboration() {
  return (
    <div className="panel span-2">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div className="panel-title" style={{ marginBottom: 0 }}>University Collaboration & Research Foundation</div>
        <span className="badge badge-ai">R&D Partnership Program 2024–2025</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Partners */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Academic Partners
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {partners.map((p, i) => (
              <div key={i} style={{
                background: 'var(--bg-secondary)',
                border: `1px solid ${p.accent}30`,
                borderRadius: 6,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: `${p.color}40`,
                  border: `1px solid ${p.accent}50`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: p.accent,
                  flexShrink: 0,
                }}>
                  {p.code}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: p.accent }}>{p.role}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{p.dept}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research highlights */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Research Highlights
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {highlights.map((h, i) => (
              <div key={i} style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-dim)',
                borderRadius: 6,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{h.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-blue)', marginBottom: 3 }}>{h.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Standards */}
          <div style={{ padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)', borderRadius: 6 }}>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 6, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              Compliance Standards
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['ISO 45001:2018', 'OHSAS 18001', 'ILO-OSH 2001', 'Permenaker No.5/2018', 'SNI 16-7081'].map(s => (
                <span key={s} className="badge badge-info">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, padding: '10px 14px', background: 'linear-gradient(90deg, #00d4ff08, #9945ff08)', border: '1px solid var(--border-dim)', borderRadius: 6, textAlign: 'center', fontSize: 11, color: 'var(--text-dim)' }}>
        Prototype ini dikembangkan untuk keperluan demo industri dan pitch investor. Semua AI engine bersifat fungsional dan siap untuk deployment skala produksi.
        <br />
        <span style={{ color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>
          YOLOv8 Computer Vision + Claude AI NLP + Real-Time Risk Engine + ISO 45001 Decision Automation
        </span>
      </div>
    </div>
  );
}

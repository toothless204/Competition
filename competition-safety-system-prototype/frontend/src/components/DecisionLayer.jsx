import React, { useState } from 'react';
import axios from 'axios';

export default function DecisionLayer({ data, onReset }) {
  const [approving, setApproving] = useState(false);
  const [injecting, setInjecting] = useState(false);

  const alert = data?.alert || 'SAFE';
  const locked = data?.locked || false;
  const incidentLog = data?.incident_log || [];

  const injectAnomaly = async () => {
    setInjecting(true);
    try { await axios.post('/api/inject-anomaly'); } catch {}
    setInjecting(false);
  };

  const reset = async () => {
    try { await axios.post('/api/reset'); } catch {}
    if (onReset) onReset();
  };

  const approve = async () => {
    setApproving(true);
    try { await axios.post('/api/supervisor-approve'); } catch {}
    setApproving(false);
  };

  return (
    <>
      {/* INTERLOCK OVERLAY — Level 3 */}
      {locked && (
        <div className="interlock-overlay">
          <div className="interlock-title">⛔ INTERLOCK ACTIVE ⛔</div>
          <div className="interlock-sub">EMERGENCY SHUTDOWN ENGAGED</div>
          <div className="interlock-info">
            Sistem telah mengunci operasi secara otomatis.<br />
            Semua mesin dalam kondisi STOP DARURAT.<br />
            Hubungi Supervisor dan Tim K3 segera.
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <button className="btn btn-emergency" onClick={approve} disabled={approving}>
              {approving ? '⟳ Processing...' : '🔑 SUPERVISOR OVERRIDE'}
            </button>
            <button className="btn btn-reset" style={{ padding: '12px 32px', fontSize: 14 }} onClick={reset}>
              🔄 FULL RESET
            </button>
          </div>
        </div>
      )}

      <div className="panel span-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div className="panel-title" style={{ marginBottom: 0 }}>Decision & Automation Layer</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-inject"
              onClick={injectAnomaly}
              disabled={injecting || alert !== 'SAFE'}
            >
              {injecting ? '⟳ Injecting...' : '⚡ INJECT ANOMALY'}
            </button>
            <button className="btn btn-reset" onClick={reset}>
              🔄 RESET
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
          {/* Level 1 */}
          <div className={`alert-card level1 ${alert === 'LEVEL_1' || alert === 'LEVEL_2' || alert === 'LEVEL_3' ? 'active' : ''}`}>
            <div className="alert-title">⚡ ALERT LEVEL 1</div>
            <div className="alert-desc">
              Risk 35–55<br />
              Audio alarm aktif.<br />
              Notifikasi supervisor via SMS.<br />
              Catat di incident log.
            </div>
            {(alert === 'LEVEL_1') && (
              <div style={{ marginTop: 8 }}>
                <button className="btn btn-approve btn-sm" onClick={approve} disabled={approving}>
                  {approving ? '...' : '✓ Acknowledge'}
                </button>
              </div>
            )}
          </div>

          {/* Level 2 */}
          <div className={`alert-card level2 ${alert === 'LEVEL_2' || alert === 'LEVEL_3' ? 'active' : ''}`}>
            <div className="alert-title">🔶 ALERT LEVEL 2</div>
            <div className="alert-desc">
              Risk 55–75<br />
              Supervisor wajib approve.<br />
              Partial shutdown zona berisiko.<br />
              Tim respons dikerahkan.
            </div>
            {alert === 'LEVEL_2' && (
              <div style={{ marginTop: 8 }}>
                <button className="btn btn-approve btn-sm" onClick={approve} disabled={approving}>
                  {approving ? '...' : '🔑 Supervisor Approve'}
                </button>
              </div>
            )}
          </div>

          {/* Level 3 */}
          <div className={`alert-card level3 ${alert === 'LEVEL_3' ? 'active' : ''}`}>
            <div className="alert-title">🚨 INTERLOCK L3</div>
            <div className="alert-desc">
              Risk {'>'} 75<br />
              FULL SHUTDOWN otomatis.<br />
              Emergency services diaktifkan.<br />
              Layar merah berkedip.
            </div>
            {alert === 'LEVEL_3' && (
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--accent-red)', fontFamily: 'var(--font-mono)', animation: 'pulse 0.8s infinite' }}>
                ▶ ACTIVE — INTERLOCK ENGAGED
              </div>
            )}
          </div>
        </div>

        <hr className="divider" />

        {/* Incident Log */}
        <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 6, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Incident Log
        </div>
        {incidentLog.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--text-dim)', padding: '6px 0' }}>
            No events recorded. Inject anomaly to test the system.
          </div>
        ) : (
          incidentLog.map((entry, i) => (
            <div key={i} className="log-entry">
              <span className="log-time">{entry.time}</span>
              <span className={`log-dot ${entry.level}`} />
              <span className="log-text">{entry.event}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
}

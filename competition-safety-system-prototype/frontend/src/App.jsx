import React from 'react';
import useWebSocket from './hooks/useWebSocket';
import Header from './components/Header';
import DataAcquisition from './components/DataAcquisition';
import SafetyIntelligenceCore from './components/SafetyIntelligenceCore';
import IoTMonitor from './components/IoTMonitor';
import CVEngine from './components/CVEngine';
import NLPEngine from './components/NLPEngine';
import RiskEngine from './components/RiskEngine';
import DecisionLayer from './components/DecisionLayer';
import Dashboard from './components/Dashboard';
import UniversityCollaboration from './components/UniversityCollaboration';
import './index.css';

export default function App() {
  const { data, connected } = useWebSocket('ws://localhost:8000/ws');

  return (
    <div className="app">
      <Header data={data} connected={connected} />

      <div className="app-grid" style={{ paddingTop: 12 }}>
        {/* Row 1: Data Acquisition + AI Core */}
        <DataAcquisition connected={connected} />
        <SafetyIntelligenceCore />

        {/* Row 2: IoT Monitor — full width */}
        <IoTMonitor data={data} />

        {/* Row 3: CV Engine + NLP Engine */}
        <CVEngine data={data} />
        <NLPEngine />

        {/* Row 4: Risk Engine + Decision Layer */}
        <RiskEngine data={data} />
        <DecisionLayer data={data} />

        {/* Row 5: Dashboard — full width */}
        <Dashboard data={data} />

        {/* Row 6: University Collaboration — full width */}
        <UniversityCollaboration />
      </div>
    </div>
  );
}

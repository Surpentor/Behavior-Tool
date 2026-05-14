import { Anomaly } from '../types';
import '../styles/Analysis.css';

interface AnomalyDetectionProps {
  anomalies: Anomaly[];
}

export default function AnomalyDetection({ anomalies }: AnomalyDetectionProps) {
  if (anomalies.length === 0) {
    return (
      <div className="analysis-card">
        <h3>🎯 Anomalies & Discrepancies</h3>
        <p className="empty-message">No anomalies detected - behavior appears consistent</p>
      </div>
    );
  }

  const highSeverity = anomalies.filter(a => a.severity === 'high');
  const mediumSeverity = anomalies.filter(a => a.severity === 'medium');

  return (
    <div className="analysis-card">
      <h3>🎯 Anomalies & Discrepancies</h3>
      {highSeverity.length > 0 && (
        <div className="anomaly-section">
          <h4 className="severity-title high">⚠️ High Severity ({highSeverity.length})</h4>
          <div className="anomaly-list">
            {highSeverity.map((anomaly, idx) => (
              <div key={idx} className="anomaly-item high">
                <div className="anomaly-time">
                  {anomaly.date.toLocaleDateString()} {anomaly.time}
                </div>
                <p className="anomaly-description">{anomaly.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {mediumSeverity.length > 0 && (
        <div className="anomaly-section">
          <h4 className="severity-title medium">⚡ Medium Severity ({mediumSeverity.length})</h4>
          <div className="anomaly-list">
            {mediumSeverity.map((anomaly, idx) => (
              <div key={idx} className="anomaly-item medium">
                <div className="anomaly-time">
                  {anomaly.date.toLocaleDateString()} {anomaly.time}
                </div>
                <p className="anomaly-description">{anomaly.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {anomalies.filter(a => a.severity === 'low').length > 0 && (
        <p className="low-severity-count">+ {anomalies.filter(a => a.severity === 'low').length} low severity items</p>
      )}
    </div>
  );
}

import { TrendData } from '../types';
import '../styles/Analysis.css';

interface TrendAnalysisProps {
  trends: TrendData[];
}

export default function TrendAnalysis({ trends }: TrendAnalysisProps) {
  if (trends.length === 0) {
    return (
      <div className="analysis-card">
        <h3>📈 Trend Analysis</h3>
        <p className="empty-message">No data available for trend analysis</p>
      </div>
    );
  }

  return (
    <div className="analysis-card">
      <h3>📈 Trend Analysis</h3>
      <div className="trend-list">
        {trends.map(trend => (
          <div key={trend.category} className={`trend-item ${trend.trend}`}>
            <div className="trend-header">
              <h4>{trend.category}</h4>
              <span className={`badge ${trend.trend}`}>
                {trend.trend === 'improving' && '📈'}
                {trend.trend === 'declining' && '📉'}
                {trend.trend === 'stable' && '→'}
              </span>
            </div>
            <p className="trend-change">
              {trend.change > 0 ? '+' : ''}{trend.change}% change over time
            </p>
            <p className="trend-datapoints">{trend.dataPoints} data points</p>
          </div>
        ))}
      </div>
    </div>
  );
}

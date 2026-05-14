import '../styles/OverviewCards.css';

interface OverviewCardsProps {
  totalPoints: number;
  recordCount: number;
  categoryCount: number;
  anomalyCount: number;
}

export default function OverviewCards({
  totalPoints,
  recordCount,
  categoryCount,
  anomalyCount,
}: OverviewCardsProps) {
  return (
    <div className="overview-cards">
      <div className="card">
        <h3>Total Points</h3>
        <p className="value">{totalPoints}</p>
        <p className="label">Behavior points collected</p>
      </div>

      <div className="card">
        <h3>Records</h3>
        <p className="value">{recordCount}</p>
        <p className="label">Data entries</p>
      </div>

      <div className="card">
        <h3>Categories</h3>
        <p className="value">{categoryCount}</p>
        <p className="label">Tracked behaviors</p>
      </div>

      <div className={`card ${anomalyCount > 0 ? 'warning' : ''}`}>
        <h3>Anomalies</h3>
        <p className="value">{anomalyCount}</p>
        <p className="label">Unusual patterns detected</p>
      </div>
    </div>
  );
}

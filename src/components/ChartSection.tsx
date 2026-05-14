import { useRef } from 'react';
import { BehaviorRecord, DailyStats, TimeOfDayStats } from '../types';
import PointsOverTimeChart from './charts/PointsOverTimeChart';
import CategoryDistributionChart from './charts/CategoryDistributionChart';
import TimeOfDayChart from './charts/TimeOfDayChart';
import ComparisonChart from './charts/ComparisonChart';
import '../styles/ChartSection.css';

interface ChartSectionProps {
  dailyStats: DailyStats[];
  timeOfDayStats: TimeOfDayStats[];
  categoryStats: Record<string, { total: number; average: number; count: number }>;
  records: BehaviorRecord[];
}

export default function ChartSection({
  dailyStats,
  timeOfDayStats,
  categoryStats,
  records,
}: ChartSectionProps) {
  const chartRefs = {
    pointsOverTime: useRef<HTMLDivElement>(null),
    categoryDistribution: useRef<HTMLDivElement>(null),
    timeOfDay: useRef<HTMLDivElement>(null),
    comparison: useRef<HTMLDivElement>(null),
  };

  const handlePrintChart = (title: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const chartElement = Object.values(chartRefs).find(ref =>
      ref.current?.querySelector(`.chart-title`)?.textContent?.includes(title)
    )?.current;

    if (chartElement) {
      const canvas = chartElement.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        const image = canvas.toDataURL('image/png');
        printWindow.document.write(`
          <html>
            <head><title>${title}</title></head>
            <body style="margin: 20px; text-align: center;">
              <h1>${title}</h1>
              <img src="${image}" style="max-width: 100%; height: auto;">
              <script>window.print();</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const hasData = dailyStats.length > 0;

  return (
    <div className="chart-section">
      <div className="print-hint">💡 Tip: Charts are printable - right-click and select Print</div>

      <div className="charts-grid">
        <div className="chart-container" ref={chartRefs.pointsOverTime}>
          <div className="chart-header">
            <h3 className="chart-title">📈 Points Over Time</h3>
            {hasData && (
              <button
                className="print-button"
                onClick={() => handlePrintChart('Points Over Time')}
              >
                🖨️
              </button>
            )}
          </div>
          <PointsOverTimeChart dailyStats={dailyStats} />
        </div>

        <div className="chart-container" ref={chartRefs.categoryDistribution}>
          <div className="chart-header">
            <h3 className="chart-title">🎯 Category Distribution</h3>
            {hasData && (
              <button
                className="print-button"
                onClick={() => handlePrintChart('Category Distribution')}
              >
                🖨️
              </button>
            )}
          </div>
          <CategoryDistributionChart categoryStats={categoryStats} />
        </div>

        <div className="chart-container" ref={chartRefs.timeOfDay}>
          <div className="chart-header">
            <h3 className="chart-title">⏰ Behavior by Time of Day</h3>
            {hasData && (
              <button
                className="print-button"
                onClick={() => handlePrintChart('Behavior by Time of Day')}
              >
                🖨️
              </button>
            )}
          </div>
          <TimeOfDayChart timeOfDayStats={timeOfDayStats} />
        </div>

        <div className="chart-container" ref={chartRefs.comparison}>
          <div className="chart-header">
            <h3 className="chart-title">📊 Category Comparison</h3>
            {hasData && (
              <button
                className="print-button"
                onClick={() => handlePrintChart('Category Comparison')}
              >
                🖨️
              </button>
            )}
          </div>
          <ComparisonChart categoryStats={categoryStats} />
        </div>
      </div>

      {!hasData && <p className="empty-message">No data to display for the selected filters</p>}
    </div>
  );
}

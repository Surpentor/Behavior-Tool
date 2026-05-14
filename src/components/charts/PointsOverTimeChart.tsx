import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { DailyStats } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PointsOverTimeChartProps {
  dailyStats: DailyStats[];
}

export default function PointsOverTimeChart({ dailyStats }: PointsOverTimeChartProps) {
  if (dailyStats.length === 0) {
    return <div className="empty-chart">No data available</div>;
  }

  const data = {
    labels: dailyStats.map(d => d.date),
    datasets: [
      {
        label: 'Total Daily Points',
        data: dailyStats.map(d => d.totalPoints),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
}

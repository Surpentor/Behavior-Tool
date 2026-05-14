import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ComparisonChartProps {
  categoryStats: Record<string, { total: number; average: number; count: number }>;
}

export default function ComparisonChart({ categoryStats }: ComparisonChartProps) {
  const categories = Object.keys(categoryStats);

  if (categories.length === 0) {
    return <div className="empty-chart">No data available</div>;
  }

  const totals = categories.map(cat => categoryStats[cat].total);
  const averages = categories.map(cat => categoryStats[cat].average);

  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Total Points',
        data: totals,
        backgroundColor: '#3b82f6',
        borderColor: '#1e40af',
        borderWidth: 1,
      },
      {
        label: 'Average Points',
        data: averages,
        backgroundColor: '#f59e0b',
        borderColor: '#b45309',
        borderWidth: 1,
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

  return <Bar data={data} options={options} />;
}

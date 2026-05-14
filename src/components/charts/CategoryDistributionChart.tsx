import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryDistributionChartProps {
  categoryStats: Record<string, { total: number; average: number; count: number }>;
}

export default function CategoryDistributionChart({ categoryStats }: CategoryDistributionChartProps) {
  const categories = Object.keys(categoryStats);
  const totals = categories.map(cat => categoryStats[cat].total);

  if (categories.length === 0) {
    return <div className="empty-chart">No data available</div>;
  }

  const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#f97316',
  ];

  const data = {
    labels: categories,
    datasets: [
      {
        data: totals,
        backgroundColor: colors.slice(0, categories.length),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: false,
      },
    },
  };

  return <Pie data={data} options={options} />;
}

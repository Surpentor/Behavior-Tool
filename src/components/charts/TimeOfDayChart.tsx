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
import { TimeOfDayStats } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TimeOfDayChartProps {
  timeOfDayStats: TimeOfDayStats[];
}

export default function TimeOfDayChart({ timeOfDayStats }: TimeOfDayChartProps) {
  if (timeOfDayStats.length === 0) {
    return <div className="empty-chart">No data available</div>;
  }

  const data = {
    labels: timeOfDayStats.map(t => t.timeSlot),
    datasets: [
      {
        label: 'Average Points',
        data: timeOfDayStats.map(t => t.averagePoints),
        backgroundColor: '#10b981',
        borderColor: '#059669',
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

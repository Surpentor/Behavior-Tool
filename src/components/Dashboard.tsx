import { useState, useMemo } from 'react';
import { StudentData, BehaviorRecord } from '../types';
import {
  calculateTrends,
  detectAnomalies,
  calculateDailyStats,
  calculateTimeOfDayStats,
  getCategoryStats,
  filterByDateRange,
  filterByCategory,
} from '../utils/analysis';
import { addDays, subDays } from 'date-fns';
import OverviewCards from './OverviewCards';
import TrendAnalysis from './TrendAnalysis';
import AnomalyDetection from './AnomalyDetection';
import ChartSection from './ChartSection';
import DataTable from './DataTable';
import Filters from './Filters';
import '../styles/Dashboard.css';

interface DashboardProps {
  data: StudentData;
}

export default function Dashboard({ data }: DashboardProps) {
  const [startDate, setStartDate] = useState(data.dateRange.start);
  const [endDate, setEndDate] = useState(data.dateRange.end);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(data.categories);
  const [quickRangeFilter, setQuickRangeFilter] = useState<string>('all');

  const filteredRecords = useMemo(() => {
    let records = data.records;

    if (quickRangeFilter !== 'all') {
      const today = new Date(data.dateRange.end);
      let rangeStart = today;

      switch (quickRangeFilter) {
        case 'last7':
          rangeStart = subDays(today, 6);
          break;
        case 'last30':
          rangeStart = subDays(today, 29);
          break;
        case 'last90':
          rangeStart = subDays(today, 89);
          break;
      }

      records = filterByDateRange(records, rangeStart, today);
    } else {
      records = filterByDateRange(records, startDate, endDate);
    }

    records = filterByCategory(records, selectedCategories);
    return records;
  }, [data.records, startDate, endDate, selectedCategories, quickRangeFilter]);

  const trends = useMemo(() => calculateTrends(filteredRecords), [filteredRecords]);
  const anomalies = useMemo(() => detectAnomalies(filteredRecords), [filteredRecords]);
  const dailyStats = useMemo(() => calculateDailyStats(filteredRecords), [filteredRecords]);
  const timeOfDayStats = useMemo(() => calculateTimeOfDayStats(filteredRecords), [filteredRecords]);
  const categoryStats = useMemo(() => getCategoryStats(filteredRecords), [filteredRecords]);

  const totalPoints = filteredRecords.reduce((sum, r) => sum + r.points, 0);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>{data.name}</h2>
          <p className="location">{data.location}</p>
        </div>
        <div className="data-summary">
          <p>
            <strong>Total Records:</strong> {filteredRecords.length}
          </p>
          <p>
            <strong>Total Points:</strong> {totalPoints}
          </p>
        </div>
      </div>

      <Filters
        categories={data.categories}
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        quickRangeFilter={quickRangeFilter}
        onQuickRangeChange={setQuickRangeFilter}
      />

      <OverviewCards
        totalPoints={totalPoints}
        recordCount={filteredRecords.length}
        categoryCount={selectedCategories.length}
        anomalyCount={anomalies.length}
      />

      <div className="dashboard-grid">
        <ChartSection
          dailyStats={dailyStats}
          timeOfDayStats={timeOfDayStats}
          categoryStats={categoryStats}
          records={filteredRecords}
        />

        <div className="analysis-section">
          <TrendAnalysis trends={trends} />
          <AnomalyDetection anomalies={anomalies} />
        </div>
      </div>

      <DataTable records={filteredRecords} />
    </div>
  );
}

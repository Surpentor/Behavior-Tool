import { StudentData, BehaviorRecord, TrendData, Anomaly, DailyStats, TimeOfDayStats } from '../types';

export function calculateTrends(records: BehaviorRecord[], category?: string): TrendData[] {
  const filtered = category ? records.filter(r => r.category === category) : records;

  if (filtered.length === 0) return [];

  const categoryGroups = new Map<string, BehaviorRecord[]>();

  filtered.forEach(record => {
    if (!categoryGroups.has(record.category)) {
      categoryGroups.set(record.category, []);
    }
    categoryGroups.get(record.category)!.push(record);
  });

  const trends: TrendData[] = [];

  categoryGroups.forEach((records, cat) => {
    if (records.length < 2) {
      trends.push({ category: cat, trend: 'stable', change: 0, dataPoints: records.length });
      return;
    }

    const sorted = [...records].sort((a, b) => a.date.getTime() - b.date.getTime());
    const mid = Math.floor(sorted.length / 2);
    const firstHalf = sorted.slice(0, mid).reduce((sum, r) => sum + r.points, 0) / mid;
    const secondHalf = sorted.slice(mid).reduce((sum, r) => sum + r.points, 0) / (sorted.length - mid);
    const change = ((secondHalf - firstHalf) / firstHalf) * 100;

    let trend: 'improving' | 'declining' | 'stable';
    if (Math.abs(change) < 5) {
      trend = 'stable';
    } else if (change > 0) {
      trend = 'improving';
    } else {
      trend = 'declining';
    }

    trends.push({ category: cat, trend, change: Math.round(change * 10) / 10, dataPoints: records.length });
  });

  return trends.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
}

export function detectAnomalies(records: BehaviorRecord[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const categoryStats = new Map<string, { mean: number; stdDev: number; records: BehaviorRecord[] }>();

  records.forEach(record => {
    if (!categoryStats.has(record.category)) {
      categoryStats.set(record.category, { mean: 0, stdDev: 0, records: [] });
    }
    categoryStats.get(record.category)!.records.push(record);
  });

  categoryStats.forEach((stats, category) => {
    const points = stats.records.map(r => r.points);
    stats.mean = points.reduce((a, b) => a + b, 0) / points.length;
    stats.stdDev = Math.sqrt(
      points.reduce((sum, p) => sum + Math.pow(p - stats.mean, 2), 0) / points.length
    );
  });

  records.forEach(record => {
    const stats = categoryStats.get(record.category);
    if (!stats) return;

    const zScore = Math.abs((record.points - stats.mean) / (stats.stdDev || 1));

    if (record.points > stats.mean + 2 * stats.stdDev) {
      const severity = zScore > 3 ? 'high' : zScore > 2 ? 'medium' : 'low';
      anomalies.push({
        date: record.date,
        time: record.time,
        category: record.category,
        points: record.points,
        type: 'spike',
        severity,
        description: `Unusual spike in ${record.category}: ${record.points} points (normal: ${Math.round(stats.mean)})`,
      });
    } else if (record.points > 0 && record.points < stats.mean - 2 * stats.stdDev) {
      const severity = zScore > 3 ? 'high' : zScore > 2 ? 'medium' : 'low';
      anomalies.push({
        date: record.date,
        time: record.time,
        category: record.category,
        points: record.points,
        type: 'drop',
        severity,
        description: `Unusual drop in ${record.category}: ${record.points} points (normal: ${Math.round(stats.mean)})`,
      });
    }
  });

  return anomalies.sort((a, b) => {
    const severityScore = { high: 3, medium: 2, low: 1 };
    return severityScore[b.severity] - severityScore[a.severity];
  });
}

export function calculateDailyStats(records: BehaviorRecord[]): DailyStats[] {
  const dayGroups = new Map<string, BehaviorRecord[]>();

  records.forEach(record => {
    const dateStr = record.date.toISOString().split('T')[0];
    if (!dayGroups.has(dateStr)) {
      dayGroups.set(dateStr, []);
    }
    dayGroups.get(dateStr)!.push(record);
  });

  const stats: DailyStats[] = [];

  dayGroups.forEach((recs, date) => {
    const categoryBreakdown: Record<string, number> = {};
    let totalPoints = 0;

    recs.forEach(rec => {
      categoryBreakdown[rec.category] = (categoryBreakdown[rec.category] || 0) + rec.points;
      totalPoints += rec.points;
    });

    stats.push({ date, totalPoints, categoryBreakdown });
  });

  return stats.sort((a, b) => a.date.localeCompare(b.date));
}

export function calculateTimeOfDayStats(records: BehaviorRecord[]): TimeOfDayStats[] {
  const timeGroups = new Map<string, BehaviorRecord[]>();

  records.forEach(record => {
    const slot = record.time.split(':')[0];
    if (!timeGroups.has(slot)) {
      timeGroups.set(slot, []);
    }
    timeGroups.get(slot)!.push(record);
  });

  const stats: TimeOfDayStats[] = [];

  timeGroups.forEach((recs, slot) => {
    const totalPoints = recs.reduce((sum, r) => sum + r.points, 0);
    stats.push({
      timeSlot: `${slot}:00`,
      averagePoints: totalPoints / recs.length,
      recordCount: recs.length,
    });
  });

  return stats.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
}

export function getCategoryStats(records: BehaviorRecord[]) {
  const stats: Record<string, { total: number; average: number; count: number }> = {};

  records.forEach(record => {
    if (!stats[record.category]) {
      stats[record.category] = { total: 0, average: 0, count: 0 };
    }
    stats[record.category].total += record.points;
    stats[record.category].count += 1;
  });

  Object.keys(stats).forEach(category => {
    stats[category].average = stats[category].total / stats[category].count;
  });

  return stats;
}

export function filterByDateRange(records: BehaviorRecord[], startDate: Date, endDate: Date): BehaviorRecord[] {
  return records.filter(record => {
    return record.date >= startDate && record.date <= endDate;
  });
}

export function filterByCategory(records: BehaviorRecord[], categories: string[]): BehaviorRecord[] {
  return records.filter(record => categories.includes(record.category));
}

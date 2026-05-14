export interface BehaviorRecord {
  date: Date;
  time: string;
  category: string;
  points: number;
}

export interface StudentData {
  name: string;
  location: string;
  date: string;
  records: BehaviorRecord[];
  totalPoints: number;
  categories: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  bipGoals?: string[];
  additionalTracking?: Record<string, unknown>;
}

export interface TrendData {
  category: string;
  trend: 'improving' | 'declining' | 'stable';
  change: number;
  dataPoints: number;
}

export interface Anomaly {
  date: Date;
  time: string;
  category: string;
  points: number;
  type: 'spike' | 'drop' | 'unusual_pattern';
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface DailyStats {
  date: string;
  totalPoints: number;
  categoryBreakdown: Record<string, number>;
}

export interface TimeOfDayStats {
  timeSlot: string;
  averagePoints: number;
  recordCount: number;
}

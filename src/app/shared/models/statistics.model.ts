export type StatisticsMetric = 'presence' | 'absence' | 'hours';

export interface StatisticsPieSlice {
  name: string;
  y: number;
  sliced?: boolean;
  selected?: boolean;
}

export interface StatisticsSummary {
  title: string;
  value: string;
  subtitle: string;
}

export interface PresenceLikeRow {
  matricule: string;
  fullName: string;
  department: string;
  site: string;
  status: string;
  reason?: string;
}

export interface LateRow {
  matricule: string;
  fullName: string;
  department: string;
  weeklyHours: string;
  targetHours: string;
  deficit: string;
}

export interface HoursRow {
  department: string;
  monthly: string;
  yearly: string;
}

export interface StatisticsViewModel {
  metric: StatisticsMetric;
  title: string;
  description: string;
  summaries: StatisticsSummary[];
  weekChartTitle?: string;
  monthChartTitle?: string;
  weekChart?: StatisticsPieSlice[];
  monthChart?: StatisticsPieSlice[];
  presenceRows?: PresenceLikeRow[];
  lateRows?: LateRow[];
  hoursRows?: HoursRow[];
}

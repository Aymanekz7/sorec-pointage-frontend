export interface PresenceRateSummaryCard {
  title: string;
  value: string;
  subtitle: string;
  tone: 'gold' | 'success' | 'warning' | 'neutral';
}

export interface PresenceRateDailyStat {
  date: string;
  dayLabel: string;
  presents: number;
  absents: number;
  travel: number;
  leave: number;
  total: number;
  rate: number;
}

export interface PresenceRateWeeklyStat {
  weekLabel: string;
  presents: number;
  total: number;
  rate: number;
  variation: number;
}

export interface PresenceRateViewModel {
  pageTitle: string;
  scopeLabel: string;
  departments: string[];
  selectedDepartment: string;
  targetRate: number;
  summaryCards: PresenceRateSummaryCard[];
  dailyStats: PresenceRateDailyStat[];
  weeklyStats: PresenceRateWeeklyStat[];
}

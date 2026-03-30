export interface AlertItem {
  type: string;
  employee: string;
  date: string;
  message: string;
  status: 'ACTIVE' | 'RESOLVED';
}

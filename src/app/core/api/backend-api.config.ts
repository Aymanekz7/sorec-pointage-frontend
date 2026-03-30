export const API_BASE_URL = 'http://localhost:8080/api';

// These routes mirror the current backend controller naming strategy.
// If your colleague uses another @RequestMapping prefix, only this file
// should need to change.
export const BACKEND_ENDPOINTS = {
  departments: `${API_BASE_URL}/departments`,
  employees: `${API_BASE_URL}/employees`,
  pointeuses: `${API_BASE_URL}/pointeuses`,
  sites: `${API_BASE_URL}/sites`,
  statuses: `${API_BASE_URL}/statuses`,
  systemConfig: `${API_BASE_URL}/system-config`,
  workSchedules: `${API_BASE_URL}/work-schedules`,
  alertRules: `${API_BASE_URL}/alert-rules`
} as const;

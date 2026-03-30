export interface AttendanceStatsDto {
  departmentName?: string;
  attendanceRate: number;
  absenceRate: number;
  lateCount: number;
  workedHours: number;
}

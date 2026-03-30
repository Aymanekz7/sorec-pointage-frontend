export interface WorkScheduleDto {
  id?: number;
  label?: string;
  startTime: string;
  endTime: string;
  weeklyHours?: number;
  departmentId?: number;
  active?: boolean;
}

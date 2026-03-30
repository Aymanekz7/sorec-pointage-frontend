export interface AttendanceDto {
  id?: number;
  employeeMatricule: string;
  attendanceDate: string;
  checkIn?: string;
  checkOut?: string;
  workedHours?: number;
  statusCode?: string;
  siteName?: string;
}

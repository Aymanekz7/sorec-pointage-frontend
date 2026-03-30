export interface Attendance {
  matricule: string;
  firstName: string;
  lastName: string;
  department: string;
  site: 'Zenith' | 'Hors Zenith' | '';
  date: string;
  checkIn: string;
  checkOut: string;
  workedHours: string;
  status: string;
}

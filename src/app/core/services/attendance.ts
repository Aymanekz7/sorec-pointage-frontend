import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Attendance } from '../../shared/models/attendance.model';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  constructor(private sessionService: SessionService) {}

  private readonly attendances: Attendance[] = [
    { matricule: 'EMP001', firstName: 'Ahmed', lastName: 'Alami', department: 'Direction IT', site: 'Zenith', date: '2026-03-16', checkIn: '08:12', checkOut: '17:03', workedHours: '08h51', status: 'Present' },
    { matricule: 'EMP002', firstName: 'Hamza', lastName: 'Alaoui', department: 'Ressources humaines', site: 'Zenith', date: '2026-03-16', checkIn: '08:35', checkOut: '16:40', workedHours: '08h05', status: 'Present' },
    { matricule: 'EMP003', firstName: 'Fatima', lastName: 'Benali', department: 'Direction IT', site: 'Hors Zenith', date: '2026-03-16', checkIn: '08:18', checkOut: '16:58', workedHours: '08h40', status: 'Present' },
    { matricule: 'EMP004', firstName: 'Maha', lastName: 'Boudhime', department: 'Operations', site: 'Zenith', date: '2026-03-16', checkIn: '-', checkOut: '-', workedHours: '00h00', status: 'Absent' },
    { matricule: 'EMP005', firstName: 'Driss', lastName: 'Cherki', department: 'Legal', site: 'Zenith', date: '2026-03-16', checkIn: '08:41', checkOut: '15:55', workedHours: '07h14', status: 'Autres' },
    { matricule: 'EMP006', firstName: 'Hanane', lastName: 'Doukkali', department: 'Legal', site: 'Hors Zenith', date: '2026-03-16', checkIn: '-', checkOut: '-', workedHours: '08h00', status: 'Conge' },
    { matricule: 'EMP007', firstName: 'Nadia', lastName: 'Fassi', department: 'Direction IT', site: 'Zenith', date: '2026-03-16', checkIn: '08:05', checkOut: '15:30', workedHours: '07h25', status: 'Deplacement' },
    { matricule: 'EMP008', firstName: 'Karim', lastName: 'Gharib', department: 'Marketing', site: 'Zenith', date: '2026-03-16', checkIn: '08:09', checkOut: '16:50', workedHours: '08h41', status: 'Present' },
    { matricule: 'EMP009', firstName: 'Laila', lastName: 'Haddad', department: 'Marketing', site: 'Hors Zenith', date: '2026-03-16', checkIn: '-', checkOut: '-', workedHours: '00h00', status: 'Absent' },
    { matricule: 'EMP010', firstName: 'Salma', lastName: 'Idrissi', department: 'Finance', site: 'Zenith', date: '2026-03-16', checkIn: '08:14', checkOut: '17:08', workedHours: '08h54', status: 'Present' },
    { matricule: 'EMP011', firstName: 'Youssef', lastName: 'Mansouri', department: 'Finance', site: 'Zenith', date: '2026-03-16', checkIn: '-', checkOut: '-', workedHours: '00h00', status: 'Absent' },
    { matricule: 'EMP012', firstName: 'Nawal', lastName: 'Rami', department: 'Finance', site: 'Hors Zenith', date: '2026-03-16', checkIn: '08:27', checkOut: '16:42', workedHours: '08h15', status: 'Deplacement' },
    { matricule: 'EMP013', firstName: 'Omar', lastName: 'Tazi', department: 'Finance', site: 'Zenith', date: '2026-03-16', checkIn: '-', checkOut: '-', workedHours: '08h00', status: 'Conge' },
    { matricule: 'EMP014', firstName: 'Sara', lastName: 'Berrada', department: 'Finance', site: 'Zenith', date: '2026-03-16', checkIn: '08:46', checkOut: '15:58', workedHours: '07h12', status: 'Autres' },
    { matricule: 'EMP015', firstName: 'Mehdi', lastName: 'Jabri', department: 'Finance', site: 'Zenith', date: '2026-03-16', checkIn: '08:11', checkOut: '17:01', workedHours: '08h50', status: 'Present' }
  ];

  getAttendances(): Observable<Attendance[]> {
    const data = this.sessionService.isRh()
      ? this.attendances
      : this.attendances.filter(item => item.department === this.sessionService.getDepartmentName());

    return of(data);
  }

  getPublicAttendances(): Observable<Attendance[]> {
    return of(
      this.attendances.map(item => ({
        ...item,
        status: item.status === 'Present' ? 'Present' : 'Absent',
        site: item.status === 'Present' ? item.site : ''
      }))
    );
  }
}

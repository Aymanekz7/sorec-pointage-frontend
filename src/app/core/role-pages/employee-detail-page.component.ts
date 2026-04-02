import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AttendanceService } from '../services/attendance';
import { Attendance } from '../../shared/models/attendance.model';

interface DailyAttendanceRecord {
  date: string;
  site: string;
  checkIn: string;
  checkOut: string;
  workedHours: string;
  status: string;
  note?: string;
}

@Component({
  selector: 'app-employee-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-detail-page.component.html',
  styleUrl: './employee-detail-page.component.scss'
})
export class EmployeeDetailPageComponent implements OnInit {
  employee?: Attendance;
  selectedPeriod: 'week' | 'month' = 'week';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    const matricule = this.route.snapshot.paramMap.get('matricule');
    if (!matricule) {
      return;
    }

    this.attendanceService.getAttendances().subscribe((rows) => {
      this.employee = rows.find((row) => row.matricule === matricule);
    });
  }

  setPeriod(period: 'week' | 'month'): void {
    this.selectedPeriod = period;
  }

  get recentRows(): DailyAttendanceRecord[] {
    const baseSite = this.employee?.site || 'Zenith';

    if (this.selectedPeriod === 'month') {
      return [
        { date: 'lun. 03 mars', site: baseSite, checkIn: '08:07', checkOut: '16:52', workedHours: '08h45', status: 'Present' },
        { date: 'ven. 07 mars', site: 'Hors Zenith', checkIn: '08:18', checkOut: '16:48', workedHours: '08h30', status: 'Present' },
        { date: 'mer. 12 mars', site: baseSite, checkIn: '08:29', checkOut: '16:36', workedHours: '08h07', status: 'Present' },
        { date: 'sam. 15 mars', site: '-', checkIn: '-', checkOut: '-', workedHours: '00h00', status: 'Absent', note: 'Sick leave' },
        { date: 'mar. 18 mars', site: '-', checkIn: '-', checkOut: '-', workedHours: '00h00', status: 'Conge', note: 'Annual leave' },
        { date: 'ven. 21 mars', site: baseSite, checkIn: '08:11', checkOut: '16:43', workedHours: '08h32', status: 'Present' },
        { date: 'lun. 24 mars', site: baseSite, checkIn: '08:15', checkOut: '17:06', workedHours: '08h51', status: 'Present' },
        { date: 'mer. 26 mars', site: 'Hors Zenith', checkIn: '08:42', checkOut: '15:58', workedHours: '07h16', status: 'Deplacement', note: 'Client visit' }
      ];
    }

    return [
      { date: 'ven. 27 mar.', site: baseSite, checkIn: '08:43', checkOut: '17:56', workedHours: '09h13', status: 'Present' },
      { date: 'lun. 30 mar.', site: baseSite, checkIn: '09:42', checkOut: '18:05', workedHours: '08h23', status: 'Present' },
      { date: 'mar. 31 mar.', site: baseSite, checkIn: '09:33', checkOut: '17:15', workedHours: '07h42', status: 'Present' },
      { date: 'mer. 1 avr.', site: baseSite, checkIn: '08:55', checkOut: '18:47', workedHours: '09h52', status: 'Present' },
      { date: 'jeu. 2 avr.', site: '-', checkIn: '-', checkOut: '-', workedHours: '00h00', status: 'Absent', note: 'Sick leave' }
    ];
  }

  get presentCount(): number {
    return this.recentRows.filter((row) => row.status === 'Present').length;
  }

  get absentCount(): number {
    return this.recentRows.filter((row) => row.status === 'Absent').length;
  }

  get tripCount(): number {
    return this.recentRows.filter((row) => row.status === 'Deplacement').length;
  }

  get leaveCount(): number {
    return this.recentRows.filter((row) => row.status === 'Conge').length;
  }

  get totalDays(): number {
    return this.recentRows.length;
  }

  get attendanceRate(): number {
    return this.totalDays ? Math.round((this.presentCount / this.totalDays) * 100) : 0;
  }

  get performanceStatus(): string {
    return this.attendanceRate >= 80 ? 'Good' : 'A surveiller';
  }

  get performanceTone(): string {
    return this.attendanceRate >= 80 ? 'is-good' : 'is-warning';
  }

  get primaryStatus(): string {
    return this.employee?.status === 'Present' ? 'Present' : 'Absent';
  }

  getPeriodTitle(): string {
    return this.selectedPeriod === 'week'
      ? 'Attendance History - Last 7 Days'
      : 'Attendance History - Last Month';
  }

  getPeriodFootnote(): string {
    return this.selectedPeriod === 'week' ? '7 days' : 'Month';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Present':
        return 'is-present';
      case 'Absent':
        return 'is-absent';
      case 'Deplacement':
        return 'is-trip';
      case 'Conge':
        return 'is-leave';
      case 'Autres':
        return 'is-other';
      default:
        return 'is-muted';
    }
  }

  getMetricLabel(status: string): string {
    switch (status) {
      case 'Present':
        return 'Present';
      case 'Absent':
        return 'Absent';
      case 'Deplacement':
        return 'On Trip';
      case 'Conge':
        return 'On Leave';
      default:
        return 'Other';
    }
  }
}

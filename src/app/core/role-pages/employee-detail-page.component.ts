import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AttendanceService } from '../services/attendance';
import { Attendance } from '../../shared/models/attendance.model';
import { SessionService } from '../services/session.service';

interface DailyAttendanceRecord {
  date: string;
  dayLabel: string;
  site: string;
  checkIn: string;
  checkOut: string;
  workedHours: string;
  status: string;
}

@Component({
  selector: 'app-employee-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './employee-detail-page.component.html',
  styleUrl: './employee-detail-page.component.scss'
})
export class EmployeeDetailPageComponent implements OnInit {
  employee?: Attendance;
  selectedPeriod: '7days' | 'lastMonth' = '7days';
  selectedMonth = '2026-02';
  readonly monthOptions = [
    { value: '2026-01', label: 'Janvier 2026' },
    { value: '2026-02', label: 'Fevrier 2026' },
    { value: '2026-03', label: 'Mars 2026' }
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly attendanceService: AttendanceService,
    public readonly sessionService: SessionService
  ) {}

  ngOnInit(): void {
    const matricule = this.route.snapshot.paramMap.get('matricule');
    if (!matricule) {
      return;
    }

    this.attendanceService.getAttendances().subscribe(rows => {
      this.employee = rows.find(row => row.matricule === matricule);
    });
  }

  get attendanceRate(): number {
    if (!this.employee) {
      return 0;
    }

    return this.selectedPeriod === '7days' ? 86 : 78;
  }

  get performanceStatus(): string {
    return this.attendanceRate >= 85 ? 'Stable' : 'A surveiller';
  }

  get performanceTone(): string {
    return this.attendanceRate >= 85 ? 'is-good' : 'is-warning';
  }

  get periodLabel(): string {
    return this.selectedPeriod === '7days' ? '7 jours' : 'Mois precedent';
  }

  get recentRows(): DailyAttendanceRecord[] {
    const baseSite = this.employee?.site || 'Zenith';

    if (this.selectedPeriod === 'lastMonth') {
      return [
        { date: `${this.selectedMonth}-03`, dayLabel: '03', site: baseSite, checkIn: '08:07', checkOut: '16:52', workedHours: '08h45', status: 'Present' },
        { date: `${this.selectedMonth}-07`, dayLabel: '07', site: 'Hors Zenith', checkIn: '08:18', checkOut: '16:48', workedHours: '08h30', status: 'Present' },
        { date: `${this.selectedMonth}-12`, dayLabel: '12', site: baseSite, checkIn: '08:29', checkOut: '16:36', workedHours: '08h07', status: 'Present' },
        { date: `${this.selectedMonth}-15`, dayLabel: '15', site: '-', checkIn: '-', checkOut: '-', workedHours: '00h00', status: 'Absent' },
        { date: `${this.selectedMonth}-18`, dayLabel: '18', site: baseSite, checkIn: '08:42', checkOut: '15:58', workedHours: '07h16', status: 'Autres' },
        { date: `${this.selectedMonth}-21`, dayLabel: '21', site: baseSite, checkIn: '08:11', checkOut: '16:43', workedHours: '08h32', status: 'Present' }
      ];
    }

    return [
      { date: '2026-03-10', dayLabel: 'Lun', site: baseSite, checkIn: '08:10', checkOut: '16:51', workedHours: '08h41', status: 'Present' },
      { date: '2026-03-11', dayLabel: 'Mar', site: 'Hors Zenith', checkIn: '08:16', checkOut: '16:47', workedHours: '08h31', status: 'Present' },
      { date: '2026-03-12', dayLabel: 'Mer', site: baseSite, checkIn: '08:24', checkOut: '16:34', workedHours: '08h10', status: 'Present' },
      { date: '2026-03-13', dayLabel: 'Jeu', site: '-', checkIn: '-', checkOut: '-', workedHours: '00h00', status: 'Absent' },
      { date: '2026-03-14', dayLabel: 'Ven', site: baseSite, checkIn: '08:39', checkOut: '15:48', workedHours: '07h09', status: 'Autres' },
      { date: '2026-03-15', dayLabel: 'Sam', site: '-', checkIn: '-', checkOut: '-', workedHours: '00h00', status: 'Conge' },
      { date: '2026-03-16', dayLabel: 'Dim', site: baseSite, checkIn: '08:12', checkOut: '17:03', workedHours: '08h51', status: 'Present' }
    ];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Present':
        return 'text-bg-success';
      case 'Absent':
        return 'text-bg-danger';
      case 'Conge':
      case 'Deplacement':
        return 'text-bg-info';
      case 'Autres':
        return 'text-bg-warning';
      default:
        return 'text-bg-secondary';
    }
  }
}

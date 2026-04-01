import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, interval, startWith, switchMap, takeUntil } from 'rxjs';
import { Attendance } from '../../../../shared/models/attendance.model';
import { AttendanceService } from '../../../../core/services/attendance';
import { SessionService } from '../../../../core/services/session.service';

@Component({
  selector: 'app-public-presence-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public-presence-page.component.html',
  styleUrl: './public-presence-page.component.scss'
})
export class PublicPresencePageComponent implements OnInit, OnDestroy {
  searchText = '';
  lastUpdated = '';
  rows: Attendance[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private attendanceService: AttendanceService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    interval(1800000)
      .pipe(
        startWith(0),
        switchMap(() => this.attendanceService.getPublicAttendances()),
        takeUntil(this.destroy$),
      )
      .subscribe((rows) => {
        this.rows = rows;
        this.lastUpdated = this.formatLastUpdated(new Date());
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get filteredRows(): Attendance[] {
    return this.rows.filter(item => {
      const query = this.searchText.trim().toLowerCase();
      const fullName = `${item.lastName} ${item.firstName}`.toLowerCase();
      const reverseName = `${item.firstName} ${item.lastName}`.toLowerCase();
      const department = item.department.toLowerCase();

      return !query
        || fullName.includes(query)
        || reverseName.includes(query)
        || item.firstName.toLowerCase().includes(query)
        || item.lastName.toLowerCase().includes(query)
        || department.includes(query);
    });
  }

  get canReturnToDashboard(): boolean {
    return this.sessionService.isAuthenticated() && !this.sessionService.isPublic();
  }

  goToDashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }

  private formatLastUpdated(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}

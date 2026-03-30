import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
export class PublicPresencePageComponent implements OnInit {
  searchText = '';
  lastUpdated = 'Today at 10:32 AM';
  rows: Attendance[] = [];

  constructor(
    private attendanceService: AttendanceService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.attendanceService.getPublicAttendances().subscribe(rows => {
      this.rows = rows;
    });
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
}

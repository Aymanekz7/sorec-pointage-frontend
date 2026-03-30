import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, inject, Type } from '@angular/core';
import { SessionService } from '../services/session.service';
import { AttendancePageComponent as ManagerAttendancePageComponent } from '../../features/manager/pages/attendance/attendance-page.component';
import { AttendancePageComponent as RhAttendancePageComponent } from '../../features/rh/pages/attendance/attendance-page.component';

@Component({
  selector: 'app-role-attendance-page',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  template: '<ng-container *ngComponentOutlet="component"></ng-container>'
})
export class RoleAttendancePageComponent {
  private readonly sessionService = inject(SessionService);

  get component(): Type<unknown> {
    return this.sessionService.isRh() ? RhAttendancePageComponent : ManagerAttendancePageComponent;
  }
}

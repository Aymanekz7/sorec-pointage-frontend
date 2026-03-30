import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, inject, Type } from '@angular/core';
import { SessionService } from '../services/session.service';
import { DashboardComponent as RhDashboardComponent } from '../../features/rh/pages/dashboard/dashboard.component';

@Component({
  selector: 'app-role-dashboard-page',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  template: '<ng-container *ngComponentOutlet="component"></ng-container>'
})
export class RoleDashboardPageComponent {
  private readonly sessionService = inject(SessionService);

  get component(): Type<unknown> {
    return RhDashboardComponent;
  }
}

import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { SessionService, UserRole } from '../../core/services/session.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  constructor(
    public sessionService: SessionService,
    private router: Router
  ) {}

  get role(): UserRole {
    return this.sessionService.getRole();
  }

  get configMode(): boolean {
    return this.sessionService.isConfigMode();
  }

  get userName(): string {
    return this.sessionService.getUserName();
  }

  get departmentName(): string {
    return this.sessionService.getDepartmentName();
  }

  onConfigModeChange(value: boolean): void {
    this.sessionService.setConfigMode(value);
    if (value) {
      this.router.navigateByUrl('/config');
      return;
    }
    this.router.navigateByUrl('/dashboard');
  }

  logout(): void {
    this.sessionService.logout();
    this.router.navigateByUrl('/login');
  }
}

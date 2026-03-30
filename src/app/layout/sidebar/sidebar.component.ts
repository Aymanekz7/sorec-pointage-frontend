import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserRole } from '../../core/services/session.service';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  roles: UserRole[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private router: Router) {}

  @Input() role: UserRole = 'RESPONSABLE';
  @Input() configMode = false;
  compact = false;

  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard', roles: ['RESPONSABLE', 'RH'] },
    { label: 'Statistiques', route: '/attendance', icon: 'attendance', roles: ['RESPONSABLE', 'RH'] },
    { label: 'Alerts', route: '/alerts', icon: 'alerts', roles: ['RESPONSABLE', 'RH'] },
    { label: 'Status Management', route: '/status-management', icon: 'status', roles: ['RH'] },
    { label: 'KPI Configuration', route: '/kpi-configuration', icon: 'config', roles: ['RH'] },
    { label: 'Account Management', route: '/account-management', icon: 'account', roles: ['RH'] },
    { label: 'Export', route: '/export', icon: 'export', roles: ['RH'] }
  ];

  get visibleItems(): MenuItem[] {
    return this.menuItems.filter(item => item.roles.includes(this.role));
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (window.scrollY > 24) {
      this.compact = true;
    }
  }

  goToPublicPage(): void {
    this.router.navigateByUrl('/bureau-public');
  }
}

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
  configurationOpen = false;

  private readonly menuItems: MenuItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard', roles: ['RESPONSABLE', 'RH'] },
    { label: 'Statistiques', route: '/attendance', icon: 'attendance', roles: ['RESPONSABLE', 'RH'] },
    { label: 'Gestion des alertes', route: '/alerts', icon: 'alerts', roles: ['RH'] },
    { label: 'Gestion des statuts', route: '/status-management', icon: 'status', roles: ['RH'] },
    { label: 'Gestions des KPIs', route: '/kpi-configuration', icon: 'config', roles: ['RH'] },
    { label: 'Gestions des comptes', route: '/account-management', icon: 'account', roles: ['RH'] },
    { label: 'Export', route: '/export', icon: 'export', roles: ['RH'] }
  ];

  get visibleItems(): MenuItem[] {
    return this.menuItems.filter(
      (item) =>
        item.roles.includes(this.role) &&
        ![
          '/alerts',
          '/status-management',
          '/kpi-configuration',
          '/account-management',
        ].includes(item.route),
    );
  }

  get configurationItems(): MenuItem[] {
    if (this.role !== 'RH') {
      return [];
    }

    return this.menuItems.filter((item) =>
      [
        '/alerts',
        '/status-management',
        '/kpi-configuration',
        '/account-management',
      ].includes(item.route),
    );
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (window.scrollY > 24) {
      this.compact = true;
    }
  }

  toggleConfiguration(): void {
    this.configurationOpen = !this.configurationOpen;
  }

  goToPublicPage(): void {
    this.router.navigateByUrl('/bureau-public');
  }
}

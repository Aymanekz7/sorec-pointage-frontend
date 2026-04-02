import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { rhGuard } from './core/guards/rh.guard';
import { RoleAttendancePageComponent } from './core/role-pages/role-attendance-page.component';
import { RoleDashboardPageComponent } from './core/role-pages/role-dashboard-page.component';
import { RolePresenceRatePageComponent } from './core/role-pages/role-presence-rate-page.component';
import { EmployeeDetailPageComponent } from './core/role-pages/employee-detail-page.component';
import { LoginComponent } from './features/public/pages/auth/login.component';
import { PublicPresencePageComponent } from './features/public/pages/presence/public-presence-page.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AlertsPageComponent } from './features/rh/pages/alerts/alerts-page.component';
import { AccountManagementPageComponent } from './features/rh/pages/account-management/account-management-page.component';
import { ConfigPageComponent } from './features/rh/pages/config/config-page.component';
import { ExportPageComponent } from './features/rh/pages/export/export-page.component';
import { KpiConfigurationPageComponent } from './features/rh/pages/kpi-configuration/kpi-configuration-page.component';
import { StatusManagementPageComponent } from './features/rh/pages/status-management/status-management-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'bureau-public', component: PublicPresencePageComponent },
  { path: 'public', redirectTo: 'bureau-public', pathMatch: 'full' },
  { path: 'public-presence', redirectTo: 'bureau-public', pathMatch: 'full' },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: RoleDashboardPageComponent },
      { path: 'presence-rate', component: RolePresenceRatePageComponent },
      { path: 'attendance', component: RoleAttendancePageComponent },
      { path: 'attendance/:matricule', component: EmployeeDetailPageComponent },
      { path: 'employees/:matricule', component: EmployeeDetailPageComponent },
      { path: 'alerts', component: AlertsPageComponent },
      { path: 'export', component: ExportPageComponent, canActivate: [rhGuard] },
      { path: 'status-management', component: StatusManagementPageComponent, canActivate: [rhGuard] },
      { path: 'kpi-configuration', component: KpiConfigurationPageComponent, canActivate: [rhGuard] },
      { path: 'account-management', component: AccountManagementPageComponent, canActivate: [rhGuard] },
      {
        path: 'config',
        redirectTo: 'kpi-configuration',
        pathMatch: 'full',
      },
      {
        path: 'config-legacy',
        component: ConfigPageComponent,
        canActivate: [rhGuard]
      }
    ]
  }
];

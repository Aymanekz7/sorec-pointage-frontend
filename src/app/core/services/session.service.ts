import { Injectable } from '@angular/core';

export type UserRole = 'RESPONSABLE' | 'RH' | 'PUBLIC';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private authenticated = false;
  private role: UserRole = 'RH';
  private configMode = false;
  private userName = '';
  private departmentName = 'Tous les departements';

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  login(username: string, password: string): boolean {
    const normalized = username.trim().toLowerCase();

    if (normalized === 'manager' && password === 'manager123') {
      this.authenticated = true;
      this.role = 'RESPONSABLE';
      this.userName = 'Manager Finance';
      this.departmentName = 'Finance';
      this.configMode = false;
      return true;
    }

    if (normalized === 'rh' && password === 'responsable123') {
      this.authenticated = true;
      this.role = 'RH';
      this.userName = 'Admin RH';
      this.departmentName = 'Tous les departements';
      this.configMode = false;
      return true;
    }

    if (normalized === 'public' && password === 'public123') {
      this.authenticated = true;
      this.role = 'PUBLIC';
      this.userName = 'Vue publique';
      this.departmentName = 'Vue publique';
      this.configMode = false;
      return true;
    }

    return false;
  }

  logout(): void {
    this.authenticated = false;
    this.role = 'RH';
    this.userName = '';
    this.departmentName = 'Tous les departements';
    this.configMode = false;
  }

  getRole(): UserRole {
    return this.role;
  }

  setRole(role: UserRole): void {
    this.role = role;
    this.departmentName = role === 'RH' ? 'Tous les departements' : 'Direction IT';
    if (role === 'RESPONSABLE') {
      this.configMode = false;
    }
  }

  isRh(): boolean {
    return this.role === 'RH';
  }

  isResponsable(): boolean {
    return this.role === 'RESPONSABLE';
  }

  isPublic(): boolean {
    return this.role === 'PUBLIC';
  }

  isConfigMode(): boolean {
    return this.configMode;
  }

  setConfigMode(value: boolean): void {
    if (this.role === 'RH') {
      this.configMode = value;
    }
  }

  getUserName(): string {
    if (this.userName) {
      return this.userName;
    }

    if (this.role === 'RH') {
      return 'Admin RH';
    }

    if (this.role === 'PUBLIC') {
      return 'Vue publique';
    }

    return 'Manager Finance';
  }

  getDepartmentName(): string {
    return this.departmentName;
  }
}

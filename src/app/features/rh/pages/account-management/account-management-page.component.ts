import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface AccountItem {
  fullName: string;
  matricule: string;
  role: string;
  department: string;
  state: 'Actif' | 'Suspendu';
}

@Component({
  selector: 'app-account-management-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-management-page.component.html',
  styleUrl: './account-management-page.component.scss'
})
export class AccountManagementPageComponent {
  readonly accounts: AccountItem[] = [
    { fullName: 'Admin RH', matricule: 'rh', role: 'Admin RH', department: 'Tous les departements', state: 'Actif' },
    { fullName: 'Manager IT', matricule: 'manager', role: 'Responsable', department: 'Direction IT', state: 'Actif' },
    { fullName: 'Vue publique', matricule: 'public', role: 'Collaborateur', department: 'Vue publique', state: 'Actif' }
  ];
}

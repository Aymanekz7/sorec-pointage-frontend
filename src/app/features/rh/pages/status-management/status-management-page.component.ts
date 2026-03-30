import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface StatusItem {
  id: number;
  name: string;
  color: string;
  visibility: 'Public' | 'Prive';
  allowNotes: boolean;
  active: boolean;
}

interface StatusFormModel {
  name: string;
  color: string;
  visibility: 'Public' | 'Prive';
  allowNotes: boolean;
}

@Component({
  selector: 'app-status-management-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './status-management-page.component.html',
  styleUrl: './status-management-page.component.scss'
})
export class StatusManagementPageComponent {
  statuses: StatusItem[] = [
    { id: 1, name: 'Present', color: '#2f8b3c', visibility: 'Public', allowNotes: false, active: true },
    { id: 2, name: 'Absent', color: '#d92d27', visibility: 'Public', allowNotes: false, active: true },
    { id: 3, name: 'Deplacement', color: '#2a72c9', visibility: 'Public', allowNotes: false, active: true },
    { id: 4, name: 'Conge', color: '#7d7d7d', visibility: 'Prive', allowNotes: false, active: true },
    { id: 5, name: 'Autres', color: '#ff9800', visibility: 'Prive', allowNotes: true, active: true }
  ];

  modalOpen = false;
  infoMessage = '';

  form: StatusFormModel = this.createEmptyForm();

  openModal(): void {
    this.form = this.createEmptyForm();
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  saveStatus(): void {
    const trimmedName = this.form.name.trim();
    if (!trimmedName) {
      this.infoMessage = 'Nom obligatoire.';
      return;
    }

    this.statuses = [
      {
        id: Date.now(),
        name: trimmedName,
        color: this.form.color,
        visibility: this.form.visibility,
        allowNotes: this.form.allowNotes,
        active: true
      },
      ...this.statuses
    ];

    this.infoMessage = `"${trimmedName}" ajoute.`;
    this.closeModal();
  }

  toggleActive(status: StatusItem): void {
    status.active = !status.active;
    this.infoMessage = `${status.name} ${status.active ? 'on' : 'off'}.`;
  }

  toggleVisibility(status: StatusItem): void {
    status.visibility = status.visibility === 'Public' ? 'Prive' : 'Public';
    this.infoMessage =
      status.visibility === 'Public'
        ? `"${status.name}" visible par tous.`
        : `"${status.name}" reserve aux responsables.`;
  }

  editStatus(status: StatusItem): void {
    this.form = {
      name: status.name,
      color: status.color,
      visibility: status.visibility,
      allowNotes: status.allowNotes
    };
    this.modalOpen = true;
    this.infoMessage = `"${status.name}" edition.`;
  }

  trackByStatus(_: number, item: StatusItem): number {
    return item.id;
  }

  private createEmptyForm(): StatusFormModel {
    return {
      name: '',
      color: '#A89968',
      visibility: 'Public',
      allowNotes: true
    };
  }
}

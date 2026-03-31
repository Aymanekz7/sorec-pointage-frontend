import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { UserRole } from '../../core/services/session.service';

interface NotificationItem {
  title: string;
  meta: string;
  read: boolean;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  @ViewChild('notifWrap') notifWrap?: ElementRef<HTMLDivElement>;
  @Input() role: UserRole = 'RESPONSABLE';
  @Input() configMode = false;
  @Input() userName = '';
  @Input() departmentName = '';
  notificationsOpen = false;
  readonly notifications: NotificationItem[] = [
    { title: '4 alertes critiques detectees ce matin', meta: 'Il y a 5 min', read: false },
    { title: 'Synchronisation RFID terminee a 08:30', meta: 'Aujourd hui', read: true },
    { title: 'Deux absences consecutives a valider', meta: 'Aujourd hui', read: false },
    { title: 'Export RH pret pour le mois en cours', meta: 'Hier', read: true }
  ];

  @Output() configModeChange = new EventEmitter<boolean>();
  @Output() logoutClicked = new EventEmitter<void>();

  logout(): void {
    this.logoutClicked.emit();
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
  }

  openNotification(item: NotificationItem): void {
    item.read = true;
  }

  markAllAsRead(): void {
    this.notifications.forEach(item => {
      item.read = true;
    });
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    if (!this.notificationsOpen) {
      return;
    }

    const target = event.target as Node | null;
    if (target && this.notifWrap?.nativeElement.contains(target)) {
      return;
    }

    this.notificationsOpen = false;
  }

  get title(): string {
    return this.configMode ? 'Configuration RH' : this.role === 'RH' ? 'Dashboard RH' : 'Dashboard Manager';
  }

  get eyebrow(): string {
    if (this.role === 'RESPONSABLE' && this.departmentName) {
      return `Manager du departement ${this.departmentName}`;
    }

    return 'Presence bureau';
  }

  get initials(): string {
    return this.userName
      .split(' ')
      .map(token => token.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  get unreadCount(): number {
    return this.notifications.filter(item => !item.read).length;
  }

  get roleLabel(): string {
    if (this.role === 'RH') {
      return 'Admin RH';
    }

    if (this.role === 'PUBLIC') {
      return 'Collaborateur';
    }

    return 'Responsable';
  }

  get scopeLabel(): string {
    if (this.role === 'RESPONSABLE' && this.departmentName) {
      return `Visibilite limitee au departement ${this.departmentName}`;
    }

    return this.roleLabel;
  }
}

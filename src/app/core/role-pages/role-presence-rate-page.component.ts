import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, inject, Type } from '@angular/core';
import { SessionService } from '../services/session.service';
import { PresenceRatePageComponent as ManagerPresenceRatePageComponent } from '../../features/manager/pages/presence-rate/presence-rate-page.component';
import { PresenceRatePageComponent as RhPresenceRatePageComponent } from '../../features/rh/pages/presence-rate/presence-rate-page.component';

@Component({
  selector: 'app-role-presence-rate-page',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  template: '<ng-container *ngComponentOutlet="component"></ng-container>'
})
export class RolePresenceRatePageComponent {
  private readonly sessionService = inject(SessionService);

  get component(): Type<unknown> {
    return this.sessionService.isRh() ? RhPresenceRatePageComponent : ManagerPresenceRatePageComponent;
  }
}

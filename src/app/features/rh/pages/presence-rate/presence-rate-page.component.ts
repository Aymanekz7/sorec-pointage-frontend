import { Component } from '@angular/core';
import { PresenceRateViewComponent } from '../../../../shared/components/presence-rate-view/presence-rate-view.component';

@Component({
  selector: 'app-rh-presence-rate-page',
  standalone: true,
  imports: [PresenceRateViewComponent],
  template: '<app-presence-rate-view role="RH" defaultDepartment="Tous les departements" />'
})
export class PresenceRatePageComponent {}

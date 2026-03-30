import { Component } from '@angular/core';
import { PresenceRateViewComponent } from '../../../../shared/components/presence-rate-view/presence-rate-view.component';

@Component({
  selector: 'app-manager-presence-rate-page',
  standalone: true,
  imports: [PresenceRateViewComponent],
  template: '<app-presence-rate-view role="RESPONSABLE" defaultDepartment="Direction IT" />'
})
export class PresenceRatePageComponent {}

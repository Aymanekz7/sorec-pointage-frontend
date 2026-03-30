import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss'
})
export class KpiCardComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) value: string | number = '';
  @Input() note = '';
  @Input() subtitle = '';
  @Input() icon: 'present' | 'absent' | 'travel' | 'leave' | 'rate' | 'alert' | 'late' | 'hours' | 'team' = 'team';
  @Input() variant: 'solid' | 'soft' = 'soft';
  @Input() tone: 'gold' | 'dark' | 'blue' | 'slate' | 'success' | 'danger' | 'warning' | 'neutral' = 'neutral';
  @Input() clickable = false;
  @Output() cardClick = new EventEmitter<void>();

  onClick(): void {
    if (this.clickable) {
      this.cardClick.emit();
    }
  }
}

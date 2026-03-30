import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kpi-threshold-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kpi-threshold-card.component.html',
  styleUrl: './kpi-threshold-card.component.scss'
})
export class KpiThresholdCardComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) subtitle = '';
  @Input({ required: true }) unit = '';
  @Input({ required: true }) tone: 'green' | 'red' | 'orange' | 'gold' = 'gold';
  @Input({ required: true }) value = 0;
  @Input({ required: true }) min = 0;
  @Input({ required: true }) max = 100;

  @Output() valueChange = new EventEmitter<number>();

  get progress(): number {
    const span = this.max - this.min;
    if (span <= 0) {
      return 0;
    }

    return ((this.value - this.min) / span) * 100;
  }

  onSliderInput(event: Event): void {
    const nextValue = Number((event.target as HTMLInputElement).value);
    this.valueChange.emit(nextValue);
  }

  onNumberInput(event: Event): void {
    const nextValue = Number((event.target as HTMLInputElement).value);
    const clamped = Math.min(this.max, Math.max(this.min, Number.isNaN(nextValue) ? this.min : nextValue));
    this.valueChange.emit(clamped);
  }
}

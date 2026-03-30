import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface DepartmentCardStats {
  name: string;
  presents: number;
  absents: number;
  travel: number;
  leave: number;
  others: number;
  hours: string;
}

@Component({
  selector: 'app-department-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-card.component.html',
  styleUrl: './department-card.component.scss'
})
export class DepartmentCardComponent {
  @Input({ required: true }) department!: DepartmentCardStats;
  @Output() details = new EventEmitter<string>();

  showDetails(): void {
    this.details.emit(this.department.name);
  }
}

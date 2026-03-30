import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { KpiThresholdCardComponent } from '../../components/kpi-threshold-card/kpi-threshold-card.component';

interface KpiThreshold {
  id: string;
  title: string;
  subtitle: string;
  unit: string;
  tone: 'green' | 'red' | 'orange' | 'gold';
  value: number;
  min: number;
  max: number;
}

@Component({
  selector: 'app-config-page',
  standalone: true,
  imports: [CommonModule, KpiThresholdCardComponent],
  templateUrl: './config-page.component.html',
  styleUrl: './config-page.component.scss'
})
export class ConfigPageComponent {
  readonly defaults: KpiThreshold[] = [
    {
      id: 'presence-target',
      title: 'Objectif de Présence',
      subtitle: 'Taux de présence minimum attendu',
      unit: '%',
      tone: 'green',
      value: 95,
      min: 50,
      max: 100
    },
    {
      id: 'absence-alert',
      title: "Seuil d'Alerte Absence",
      subtitle: "Taux d'absence déclenchant une alerte",
      unit: '%',
      tone: 'red',
      value: 10,
      min: 0,
      max: 30
    },
    {
      id: 'late-threshold',
      title: 'Seuil de Retard',
      subtitle: 'Nombre de minutes considéré comme retard',
      unit: 'min',
      tone: 'orange',
      value: 15,
      min: 0,
      max: 60
    },
    {
      id: 'weekly-hours',
      title: 'Heures Hebdomadaires',
      subtitle: "Nombre d'heures de travail par semaine",
      unit: 'h',
      tone: 'gold',
      value: 40,
      min: 20,
      max: 60
    }
  ];

  cards: KpiThreshold[] = this.defaults.map(card => ({ ...card }));

  updateValue(id: string, value: number): void {
    this.cards = this.cards.map(card => (card.id === id ? { ...card, value } : card));
  }

  reset(): void {
    this.cards = this.defaults.map(card => ({ ...card }));
  }

  formatPreviewValue(card: KpiThreshold): string {
    return `${card.value}${card.unit}`;
  }
}

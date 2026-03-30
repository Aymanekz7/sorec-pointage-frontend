import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface AlertRuleRow {
  id: number;
  name: string;
  condition: string;
  threshold: string;
  visibility: 'Public' | 'Prive';
  active: boolean;
}

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts-page.component.html',
  styleUrl: './alerts-page.component.scss'
})
export class AlertsPageComponent {
  rules: AlertRuleRow[] = [
    {
      id: 1,
      name: 'Absence injustifiee',
      condition: 'Absence consecutive',
      threshold: '2 jours',
      visibility: 'Public',
      active: true
    },
    {
      id: 2,
      name: 'Faible presence',
      condition: 'Presence departement faible',
      threshold: '50 %',
      visibility: 'Prive',
      active: true
    },
    {
      id: 3,
      name: 'Retards excessifs',
      condition: 'Retards sur la semaine',
      threshold: '3 occurrences',
      visibility: 'Prive',
      active: false
    }
  ];

  infoMessage = '';

  toggleRule(rule: AlertRuleRow): void {
    rule.active = !rule.active;
    this.infoMessage = `${rule.name} ${rule.active ? 'activee' : 'desactivee'}.`;
  }

  editRule(rule: AlertRuleRow): void {
    this.infoMessage = `Edition "${rule.name}".`;
  }

  toggleVisibility(rule: AlertRuleRow): void {
    rule.visibility = rule.visibility === 'Public' ? 'Prive' : 'Public';
    this.infoMessage =
      rule.visibility === 'Public'
        ? `"${rule.name}" visible par tous.`
        : `"${rule.name}" reservee aux responsables.`;
  }

  addRule(): void {
    this.infoMessage = 'Nouvelle regle prete.';
  }
}

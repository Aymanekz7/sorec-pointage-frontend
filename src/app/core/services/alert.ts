import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AlertItem } from '../../shared/models/alert.model';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  getAlerts(): Observable<AlertItem[]> {
    return of([
      {
        type: 'HOURS_INSUFFICIENT',
        employee: 'Youssef Alaoui',
        date: '2026-03-16',
        message: "Nombre d'heures inferieur au minimum attendu.",
        status: 'ACTIVE'
      },
      {
        type: 'INCOMPLETE_POINTAGE',
        employee: 'Omar Bennis',
        date: '2026-03-16',
        message: 'Une seule trace de pointage detectee.',
        status: 'ACTIVE'
      },
      {
        type: 'CONSECUTIVE_ABSENCES',
        employee: 'Nadia Karim',
        date: '2026-03-15',
        message: 'Absences detectees sur plusieurs jours consecutifs.',
        status: 'RESOLVED'
      },
      {
        type: 'LOW_ATTENDANCE_RATE',
        employee: 'Departement Finance',
        date: '2026-03-16',
        message: 'Taux de presence inferieur au seuil configure sur la periode.',
        status: 'RESOLVED'
      }
    ]);
  }
}

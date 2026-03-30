import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SessionService } from './session.service';

export interface DashboardBandItem {
  label: string;
  value: number | string;
  tone: 'present' | 'absent' | 'travel' | 'leave' | 'other';
}

export interface PieStat {
  labels: string[];
  values: number[];
}

export interface DepartmentHours {
  department: string;
  hours: number;
}

export interface DashboardViewModel {
  pageTitle: string;
  subtitle: string;
  band: DashboardBandItem[];
  weekPie: PieStat;
  weekendPie: PieStat;
  monthlyHours?: DepartmentHours[];
  yearlyHours?: DepartmentHours[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private sessionService: SessionService) {}

  getDashboard(): Observable<DashboardViewModel> {
    if (this.sessionService.isRh()) {
      return of({
        pageTitle: 'Dashboard RH',
        subtitle: 'Vision globale sur tous les departements et le suivi des heures travaillees.',
        band: [
          { label: 'Presents', value: 20, tone: 'present' },
          { label: 'Absents', value: 3, tone: 'absent' },
          { label: 'En deplacement', value: 2, tone: 'travel' },
          { label: 'En conge', value: 2, tone: 'leave' },
          { label: 'Autres', value: 1, tone: 'other' }
        ],
        weekPie: { labels: ['Presents', 'Absents', 'Deplacement', 'Conge', 'Autres'], values: [20, 3, 2, 2, 1] },
        weekendPie: { labels: ['Presents', 'Absents', 'Deplacement', 'Conge', 'Autres'], values: [6, 1, 0, 1, 0] },
        monthlyHours: [
          { department: 'Direction IT', hours: 1168 },
          { department: 'Ressources humaines', hours: 964 },
          { department: 'Finance', hours: 1012 },
          { department: 'Operations', hours: 1233 }
        ],
        yearlyHours: [
          { department: 'Direction IT', hours: 13440 },
          { department: 'Ressources humaines', hours: 11280 },
          { department: 'Finance', hours: 11865 },
          { department: 'Operations', hours: 14210 }
        ]
      });
    }

    return of({
      pageTitle: 'Espace manager',
      subtitle: 'Suivi du departement assigne et des indicateurs hebdomadaires consolides.',
      band: [
        { label: 'Presents', value: 4, tone: 'present' },
        { label: 'Absents', value: 1, tone: 'absent' },
        { label: 'En deplacement', value: 1, tone: 'travel' },
        { label: 'En conge', value: 0, tone: 'leave' },
        { label: 'Autres', value: 1, tone: 'other' }
      ],
      weekPie: { labels: ['Presents', 'Absents', 'Deplacement', 'Conge', 'Autres'], values: [4, 1, 1, 0, 1] },
      weekendPie: { labels: ['Presents', 'Absents', 'Deplacement', 'Conge', 'Autres'], values: [2, 0, 0, 0, 0] }
    });
  }
}

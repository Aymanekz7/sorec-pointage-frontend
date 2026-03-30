import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SessionService } from './session.service';
import {
  HoursRow,
  LateRow,
  PresenceLikeRow,
  StatisticsMetric,
  StatisticsViewModel
} from '../../shared/models/statistics.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  constructor(private sessionService: SessionService) {}

  getView(metric: StatisticsMetric): Observable<StatisticsViewModel> {
    const scopeDepartment = this.sessionService.isRh() ? '' : this.sessionService.getDepartmentName();

    if (metric === 'absence') {
      const rows = this.filterPresenceRows(this.absenceRows(), scopeDepartment);
      return of({
        metric,
        title: 'Taux d absence',
        description: 'Collaborateurs absents sur la periode avec lecture rapide semaine et mois.',
        summaries: [
          { title: 'Absents aujourd hui', value: '17', subtitle: 'Collaborateurs concernes' },
          { title: 'Absents semaine', value: '17', subtitle: '6,6% du total' },
          { title: 'Mois dernier', value: '68', subtitle: '7,3% du total' }
        ],
        weekChartTitle: 'Absences - semaine',
        monthChartTitle: 'Absences - mois dernier',
        weekChart: [
          { name: 'Absents', y: 17, sliced: true, selected: true },
          { name: 'Autres statuts', y: 240 }
        ],
        monthChart: [
          { name: 'Absents', y: 68, sliced: true, selected: true },
          { name: 'Autres statuts', y: 844 }
        ],
        presenceRows: rows
      });
    }

    if (metric === 'late') {
      const rows = this.filterLateRows(this.lateRows(), scopeDepartment);
      return of({
        metric,
        title: 'Retards / heures insuffisantes',
        description: 'Collaborateurs n ayant pas atteint le volume hebdomadaire configure par la RH.',
        summaries: [
          { title: 'Collaborateurs concernes', value: `${rows.length}`, subtitle: 'A suivre cette semaine' },
          { title: 'Objectif RH', value: '40h', subtitle: 'Seuil configure' },
          { title: 'Deficit moyen', value: '3h20', subtitle: 'Sur les cas remontes' }
        ],
        lateRows: rows
      });
    }

    if (metric === 'hours') {
      const rows = this.filterHoursRows(this.hoursRows(), scopeDepartment);
      return of({
        metric,
        title: 'Heures travaillees',
        description: 'Total mensuel et annuel par departement.',
        summaries: [
          { title: 'Semaine derniere', value: '1 168h', subtitle: 'Total consolide' },
          { title: 'Moyenne / jour', value: '233h', subtitle: 'Sur la semaine precedente' },
          { title: 'Mois dernier', value: '4 972h', subtitle: 'Tous departements confondus' }
        ],
        hoursRows: rows
      });
    }

    const rows = this.filterPresenceRows(this.presenceRows(), scopeDepartment);
    return of({
      metric: 'presence',
      title: 'Taux de presence',
      description: 'Liste ciblee des collaborateurs presents, en deplacement ou en autres statuts autorises.',
      summaries: [
        { title: 'Presents semaine', value: '214', subtitle: 'Collaborateurs presents' },
        { title: 'Taux semaine', value: '93,4%', subtitle: 'Taux consolide de la semaine' },
        { title: 'En deplacement', value: '12', subtitle: 'Collaborateurs concernes' },
        { title: 'Autres autorises', value: '5', subtitle: 'Avec motif saisi' }
      ],
      weekChartTitle: 'Presence - semaine',
      monthChartTitle: 'Presence - mois dernier',
      weekChart: [
        { name: 'Present', y: 214, sliced: true, selected: true },
        { name: 'Deplacement', y: 12 },
        { name: 'Autres', y: 5 }
      ],
      monthChart: [
        { name: 'Present', y: 862, sliced: true, selected: true },
        { name: 'Deplacement', y: 41 },
        { name: 'Autres', y: 18 }
      ],
      presenceRows: rows
    });
  }

  private presenceRows(): PresenceLikeRow[] {
    return [
      { matricule: 'EMP001', fullName: 'Ahmed Alami', department: 'Direction IT', site: 'Zenith', status: 'Present' },
      { matricule: 'EMP007', fullName: 'Nadia Fassi', department: 'Direction IT', site: 'Zenith', status: 'Deplacement', reason: 'Mission externe' },
      { matricule: 'EMP018', fullName: 'Samira El Idrissi', department: 'Ressources humaines', site: 'Hors Zenith', status: 'Autres', reason: 'Maternite' },
      { matricule: 'EMP024', fullName: 'Karim Bennis', department: 'Operations', site: 'Zenith', status: 'Present' },
      { matricule: 'EMP031', fullName: 'Loubna Haddad', department: 'Finance', site: 'Zenith', status: 'Autres', reason: 'Sortie avant l heure' },
      { matricule: 'EMP036', fullName: 'Yassine Tahiri', department: 'Marketing', site: 'Hors Zenith', status: 'Deplacement', reason: 'Visite client' }
    ];
  }

  private absenceRows(): PresenceLikeRow[] {
    return [
      { matricule: 'EMP004', fullName: 'Maha Boudhime', department: 'Operations', site: '-', status: 'Absent' },
      { matricule: 'EMP009', fullName: 'Laila Haddad', department: 'Marketing', site: '-', status: 'Absent' },
      { matricule: 'EMP014', fullName: 'Omar Naciri', department: 'Direction IT', site: '-', status: 'Absent' },
      { matricule: 'EMP019', fullName: 'Nour Eddine Farah', department: 'Finance', site: '-', status: 'Absent' },
      { matricule: 'EMP021', fullName: 'Sara Amrani', department: 'Ressources humaines', site: '-', status: 'Absent' }
    ];
  }

  private lateRows(): LateRow[] {
    return [
      { matricule: 'EMP005', fullName: 'Driss Cherki', department: 'Juridique', weeklyHours: '36h40', targetHours: '40h00', deficit: '03h20' },
      { matricule: 'EMP011', fullName: 'Salma Idrissi', department: 'Finance', weeklyHours: '37h25', targetHours: '40h00', deficit: '02h35' },
      { matricule: 'EMP017', fullName: 'Youssef Alaoui', department: 'Operations', weeklyHours: '35h50', targetHours: '40h00', deficit: '04h10' },
      { matricule: 'EMP027', fullName: 'Meryem Chraibi', department: 'Direction IT', weeklyHours: '38h05', targetHours: '40h00', deficit: '01h55' }
    ];
  }

  private hoursRows(): HoursRow[] {
    return [
      { department: 'Direction IT', monthly: '742h', yearly: '8 904h' },
      { department: 'Ressources humaines', monthly: '516h', yearly: '6 192h' },
      { department: 'Operations', monthly: '1 424h', yearly: '17 088h' },
      { department: 'Marketing', monthly: '471h', yearly: '5 652h' },
      { department: 'Finance', monthly: '598h', yearly: '7 176h' },
      { department: 'Juridique', monthly: '389h', yearly: '4 668h' }
    ];
  }

  private filterPresenceRows(rows: PresenceLikeRow[], department: string): PresenceLikeRow[] {
    if (!department || department === 'Tous les departements') {
      return rows;
    }

    const normalized = department === 'Direction IT' ? 'Direction IT' : department;
    return rows.filter(row => row.department === normalized);
  }

  private filterLateRows(rows: LateRow[], department: string): LateRow[] {
    if (!department || department === 'Tous les departements') {
      return rows;
    }

    const normalized = department === 'Direction IT' ? 'Direction IT' : department;
    return rows.filter(row => row.department === normalized);
  }

  private filterHoursRows(rows: HoursRow[], department: string): HoursRow[] {
    if (!department || department === 'Tous les departements') {
      return rows;
    }

    const normalized = department === 'Direction IT' ? 'Direction IT' : department;
    return rows.filter(row => row.department === normalized);
  }
}

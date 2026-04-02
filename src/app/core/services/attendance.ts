import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Attendance } from '../../shared/models/attendance.model';
import { SessionService } from './session.service';

type BackendPresence = {
  matricule: string;
  dtPresence: string;
  heuresTravaillees?: number | string | null;
  codeLecteur?: string | null;
  agent?: {
    nom?: string | null;
    prenom?: string | null;
    etbLib?: string | null;
    sceLib?: string | null;
    lieuLib?: string | null;
  } | null;
  statut?: {
    codeStatut?: string | null;
    libelle?: string | null;
  } | null;
};

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private readonly apiBaseUrl = 'http://localhost:8080/api';

  constructor(
    private sessionService: SessionService,
    private http: HttpClient,
  ) {}

  private readonly attendances: Attendance[] = [
    { matricule: 'AG001', firstName: 'Ahmed', lastName: 'Alami', department: 'Direction IT', site: 'Zenith', date: '2026-03-16', checkIn: '08:12', checkOut: '17:03', workedHours: '08h51', status: 'Present' },
    { matricule: 'AG002', firstName: 'Hamza', lastName: 'Alaoui', department: 'Ressources humaines', site: 'Zenith', date: '2026-03-16', checkIn: '08:35', checkOut: '16:40', workedHours: '08h05', status: 'Present' },
    { matricule: 'AG003', firstName: 'Fatima', lastName: 'Benali', department: 'Direction IT', site: 'Hors Zenith', date: '2026-03-16', checkIn: '08:18', checkOut: '16:58', workedHours: '08h40', status: 'Present' },
    { matricule: 'AG004', firstName: 'Maha', lastName: 'Boudhime', department: 'Operations', site: 'Zenith', date: '2026-03-16', checkIn: '-', checkOut: '-', workedHours: '00h00', status: 'Absent' },
    { matricule: 'AG005', firstName: 'Driss', lastName: 'Cherki', department: 'Legal', site: 'Zenith', date: '2026-03-16', checkIn: '08:41', checkOut: '15:55', workedHours: '07h14', status: 'Autres' },
    { matricule: 'AG006', firstName: 'Hanane', lastName: 'Doukkali', department: 'Legal', site: 'Hors Zenith', date: '2026-03-16', checkIn: '-', checkOut: '-', workedHours: '08h00', status: 'Conge' },
    { matricule: 'AG007', firstName: 'Nadia', lastName: 'Fassi', department: 'Direction IT', site: 'Zenith', date: '2026-03-16', checkIn: '08:05', checkOut: '15:30', workedHours: '07h25', status: 'Deplacement' },
    { matricule: 'AG008', firstName: 'Karim', lastName: 'Gharib', department: 'Marketing', site: 'Zenith', date: '2026-03-16', checkIn: '08:09', checkOut: '16:50', workedHours: '08h41', status: 'Present' },
    { matricule: 'AG009', firstName: 'Laila', lastName: 'Haddad', department: 'Marketing', site: 'Hors Zenith', date: '2026-03-16', checkIn: '-', checkOut: '-', workedHours: '00h00', status: 'Absent' },
    { matricule: 'AG010', firstName: 'Salma', lastName: 'Idrissi', department: 'Finance', site: 'Zenith', date: '2026-03-16', checkIn: '08:14', checkOut: '17:08', workedHours: '08h54', status: 'Present' },
    { matricule: 'AG011', firstName: 'Youssef', lastName: 'Mansouri', department: 'Finance', site: 'Zenith', date: '2026-03-16', checkIn: '-', checkOut: '-', workedHours: '00h00', status: 'Absent' },
    { matricule: 'AG012', firstName: 'Nawal', lastName: 'Rami', department: 'Finance', site: 'Hors Zenith', date: '2026-03-16', checkIn: '08:27', checkOut: '16:42', workedHours: '08h15', status: 'Deplacement' },
    { matricule: 'AG013', firstName: 'Omar', lastName: 'Tazi', department: 'Finance', site: 'Zenith', date: '2026-03-16', checkIn: '-', checkOut: '-', workedHours: '08h00', status: 'Conge' },
    { matricule: 'AG014', firstName: 'Sara', lastName: 'Berrada', department: 'Finance', site: 'Zenith', date: '2026-03-16', checkIn: '08:46', checkOut: '15:58', workedHours: '07h12', status: 'Autres' },
    { matricule: 'AG015', firstName: 'Mehdi', lastName: 'Jabri', department: 'Finance', site: 'Zenith', date: '2026-03-16', checkIn: '08:11', checkOut: '17:01', workedHours: '08h50', status: 'Present' }
  ];

  getAttendances(): Observable<Attendance[]> {
    const data = this.sessionService.isRh()
      ? this.attendances
      : this.attendances.filter(item => item.department === this.sessionService.getDepartmentName());

    return of(data);
  }

  getPublicAttendances(): Observable<Attendance[]> {
    return this.http.get<BackendPresence[]>(`${this.apiBaseUrl}/presences`).pipe(
      map((rows) => rows.map((row) => this.mapBackendPresenceToPublicAttendance(row))),
      catchError((error) => {
        console.error('Erreur chargement presences backend /api/presences', error);
        return of([]);
      }),
    );
  }

  private mapBackendPresenceToPublicAttendance(row: BackendPresence): Attendance {
    const rawStatus = row.statut?.codeStatut || row.statut?.libelle || '';
    const normalizedStatus = this.normalizePublicStatus(rawStatus);
    const workedHours = this.formatWorkedHours(row.heuresTravaillees);

    return {
      matricule: row.matricule,
      firstName: row.agent?.prenom?.trim() || '-',
      lastName: row.agent?.nom?.trim() || '-',
      department: row.agent?.sceLib?.trim() || row.agent?.etbLib?.trim() || '-',
      site: normalizedStatus === 'Present' ? this.normalizeSite(row.agent?.lieuLib) : '',
      date: row.dtPresence || '',
      checkIn: '-',
      checkOut: '-',
      workedHours,
      status: normalizedStatus,
    };
  }

  private normalizePublicStatus(status: string): 'Present' | 'Absent' {
    const normalized = status.trim().toLowerCase();
    return normalized === 'present' || normalized === 'p' ? 'Present' : 'Absent';
  }

  private normalizeSite(site?: string | null): 'Zenith' | 'Hors Zenith' | '' {
    if (!site) {
      return '';
    }

    const normalized = site.trim().toLowerCase();
    if (normalized.includes('hors')) {
      return 'Hors Zenith';
    }

    if (normalized.includes('zenith')) {
      return 'Zenith';
    }

    return 'Hors Zenith';
  }

  private formatWorkedHours(value?: number | string | null): string {
    if (value === null || value === undefined || value === '') {
      return '00h00';
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return '00h00';
    }

    const hours = Math.floor(numericValue);
    const minutes = Math.round((numericValue - hours) * 60);
    return `${hours.toString().padStart(2, '0')}h${minutes.toString().padStart(2, '0')}`;
  }
}

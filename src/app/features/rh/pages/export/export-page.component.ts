import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../../../core/services/attendance';
import { Attendance } from '../../../../shared/models/attendance.model';

@Component({
  selector: 'app-export-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './export-page.component.html',
  styleUrl: './export-page.component.scss'
})
export class ExportPageComponent {
  private readonly attendanceService = inject(AttendanceService);
  private attendanceRegistry: Attendance[] = [];

  exportMode: 'department' | 'employee' = 'department';
  matricule = '';
  department = '';
  dateFrom = '';
  dateTo = '';
  selectedFormat: 'excel' | 'pdf' = 'excel';
  employeeInfo: {
    matricule: string;
    firstName: string;
    lastName: string;
    department: string;
    hireDate: string;
  } | null = null;

  readonly departmentOptions = [
    'Direction IT',
    'Ressources humaines',
    'Operations',
    'Marketing',
    'Finance',
    'Juridique',
  ];

  private readonly hireDateRegistry: Record<string, string> = {
    EMP001: '2021-02-14',
    EMP002: '2020-09-01',
    EMP003: '2022-01-10',
    EMP004: '2019-06-18',
    EMP005: '2020-04-07',
    EMP006: '2021-11-22',
    EMP007: '2018-03-05',
    EMP008: '2022-07-13',
    EMP009: '2020-12-01',
    EMP010: '2019-01-28',
    EMP011: '2021-10-04',
    EMP012: '2023-02-16',
    EMP013: '2018-05-21',
    EMP014: '2024-01-08',
    EMP015: '2022-04-30',
  };

  constructor() {
    this.attendanceService.getAttendances().subscribe((rows) => {
      this.attendanceRegistry = rows;
    });
  }

  setExportMode(mode: 'department' | 'employee'): void {
    this.exportMode = mode;
    if (mode === 'department') {
      this.matricule = '';
      this.employeeInfo = null;
      return;
    }

    this.department = '';
  }

  onMatriculeChange(value: string): void {
    this.matricule = value.toUpperCase();
    this.employeeInfo = this.findEmployee(this.matricule);
  }

  exportLabel(format: 'excel' | 'pdf'): string {
    return format === 'excel' ? 'Exporter en Excel' : 'Apercu PDF';
  }

  private findEmployee(matricule: string): ExportPageComponent['employeeInfo'] {
    const employees = this.getAttendanceRegistry();
    const match = employees.find((item) => item.matricule === matricule);

    if (!match) {
      return null;
    }

    return {
      matricule: match.matricule,
      firstName: match.firstName,
      lastName: match.lastName,
      department: match.department === 'Legal' ? 'Juridique' : match.department,
      hireDate: this.hireDateRegistry[match.matricule] ?? '2022-01-01',
    };
  }

  private getAttendanceRegistry(): Attendance[] {
    return this.attendanceRegistry;
  }
}

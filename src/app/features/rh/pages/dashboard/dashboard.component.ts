import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Highcharts from 'highcharts';
import { Params, Router } from '@angular/router';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';
import {
  DepartmentCardComponent,
  DepartmentCardStats,
} from '../../components/department-card/department-card.component';
import { AttendanceService } from '../../../../core/services/attendance';
import { Attendance } from '../../../../shared/models/attendance.model';
import { SessionService } from '../../../../core/services/session.service';

type FollowUpType = 'department' | 'employee';

type InsightCard = {
  title: string;
  value: string | number;
  note: string;
  subtitle: string;
  icon: 'rate' | 'alert' | 'late' | 'hours';
  tone: 'success' | 'danger' | 'warning' | 'neutral';
  variant: 'soft';
  route: string;
  queryParams?: Params;
};

type AlertItem = {
  employee: string;
  department: string;
  type: string;
  level: string;
  date: string;
};

type PresenceBoardRow = Attendance & {
  currentWeek: string;
  previousWeek: string;
};

const RH_INSIGHT_CARDS: InsightCard[] = [
  {
    title: 'Taux de presence',
    value: '93,4%',
    note: '214 collaborateurs presents',
    subtitle: '+1,8% vs semaine precedente',
    icon: 'rate',
    tone: 'success',
    variant: 'soft',
    route: '/attendance',
    queryParams: { metric: 'presence' },
  },
  {
    title: 'Taux d absence',
    value: '6,6%',
    note: '',
    subtitle: '17 collaborateurs concernes',
    icon: 'alert',
    tone: 'danger',
    variant: 'soft',
    route: '/attendance',
    queryParams: { metric: 'absence' },
  },
  {
    title: 'Retards (semaine)',
    value: 23,
    note: '',
    subtitle: '5 de moins que la semaine derniere',
    icon: 'late',
    tone: 'warning',
    variant: 'soft',
    route: '/attendance',
    queryParams: { metric: 'late' },
  },
  {
    title: 'Heures travaillees',
    value: '1 168h',
    note: '',
    subtitle: 'moyenne 233h par jour',
    icon: 'hours',
    tone: 'neutral',
    variant: 'soft',
    route: '/attendance',
    queryParams: { metric: 'hours' },
  },
];

const MANAGER_TREND_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, KpiCardComponent, DepartmentCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly attendanceService = inject(AttendanceService);
  private readonly sessionService = inject(SessionService);
  @ViewChild('trendChart') trendChartContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('weekPieChart') weekPieContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('weekendPieChart') weekendPieContainer?: ElementRef<HTMLDivElement>;
  followUpDepartment = 'all';
  followUpSearch = '';
  addFollowUpOpen = false;
  newFollowUpType: FollowUpType = 'department';
  newFollowUpValue = '';
  savedFollowUps: Array<{ type: FollowUpType; label: string; value: string }> = [];
  departments: DepartmentCardStats[] = [];
  private allAttendances: Attendance[] = [];
  private viewReady = false;

  get insightCards(): InsightCard[] {
    if (!this.isRhView) {
      const metrics = this.managerMetrics;

      return [
        {
          title: 'Taux de presence',
          value: this.formatPercent(metrics.presenceRate),
          note: `${metrics.presents} collaborateurs presents`,
          subtitle: `Departement ${this.managerDepartmentLabel}`,
          icon: 'rate',
          tone: 'success',
          variant: 'soft',
          route: '/attendance',
          queryParams: { metric: 'presence' },
        },
        {
          title: 'Taux d absence',
          value: this.formatPercent(metrics.absenceRate),
          note: '',
          subtitle: `${metrics.absents} collaborateurs concernes`,
          icon: 'alert',
          tone: 'danger',
          variant: 'soft',
          route: '/attendance',
          queryParams: { metric: 'absence' },
        },
        {
          title: 'Retards (semaine)',
          value: metrics.late,
          note: '',
          subtitle: `Suivi ${this.managerDepartmentLabel}`,
          icon: 'late',
          tone: 'warning',
          variant: 'soft',
          route: '/attendance',
          queryParams: { metric: 'late' },
        },
        {
          title: 'Heures travaillees',
          value: `${metrics.totalHours}h`,
          note: '',
          subtitle: `Total ${this.managerDepartmentLabel}`,
          icon: 'hours',
          tone: 'neutral',
          variant: 'soft',
          route: '/attendance',
          queryParams: { metric: 'hours' },
        },
      ];
    }

    return RH_INSIGHT_CARDS;
  }

  readonly recentAlerts: AlertItem[] = [
    {
      employee: 'A. Bensalem',
      department: 'Operations',
      type: 'Heures insuffisantes',
      level: 'Critique',
      date: '18/03/2026',
    },
    {
      employee: 'L. Haddad',
      department: 'Marketing',
      type: 'Retards repetes',
      level: 'Moderee',
      date: '18/03/2026',
    },
    {
      employee: 'K. Cherkaoui',
      department: 'Direction IT',
      type: 'Sortie avant 16:30',
      level: 'Moderee',
      date: '17/03/2026',
    },
    {
      employee: 'F. Alaoui',
      department: 'Finance',
      type: 'Absence consecutive',
      level: 'Critique',
      date: '17/03/2026',
    },
    {
      employee: 'S. Berrada',
      department: 'Finance',
      type: 'Presence partielle',
      level: 'Moderee',
      date: '18/03/2026',
    },
    {
      employee: 'N. Rami',
      department: 'Finance',
      type: 'Presence hors site',
      level: 'Moderee',
      date: '18/03/2026',
    },
  ];

  get managerAlerts(): AlertItem[] {
    return this.isRhView
      ? this.recentAlerts
      : this.recentAlerts.filter(
          (alert) => alert.department === this.sessionService.getDepartmentName(),
        );
  }

  get managerDepartmentLabel(): string {
    return this.sessionService.getDepartmentName();
  }

  get presenceBoardRows(): PresenceBoardRow[] {
    const rows = this.isRhView ? this.followUpRows : this.allAttendances;

    return rows.map((row, index) => ({
      ...row,
      currentWeek: this.buildWeekSummary(row, index, false),
      previousWeek: this.buildWeekSummary(row, index, true),
    }));
  }

  get managerTrendCategories(): string[] {
    return MANAGER_TREND_DAYS;
  }

  get managerTrendData(): number[] {
    const total = this.allAttendances.length;
    return [Math.max(total - 1, 0), total, Math.max(total - 2, 0), Math.max(total - 1, 0), total];
  }

  private trendChart?: Highcharts.Chart;
  private weekPieChart?: Highcharts.Chart;
  private weekendPieChart?: Highcharts.Chart;

  get isRhView(): boolean {
    return this.sessionService.isRh();
  }

  get managerDepartmentCard(): DepartmentCardStats | undefined {
    return this.departments[0];
  }

  private get managerMetrics() {
    const total = this.allAttendances.length;
    const presents = this.getStatusCount('Present');
    const absents = this.getStatusCount('Absent');

    return {
      presents,
      absents,
      late: this.getLateRowsCount(),
      totalHours: this.getTotalWorkedHours(),
      presenceRate: total ? (presents / total) * 100 : 0,
      absenceRate: total ? (absents / total) * 100 : 0,
    };
  }

  ngOnInit(): void {
    this.attendanceService.getAttendances().subscribe((rows) => {
      const scopedRows = this.getScopedAttendances(rows);
      this.allAttendances = scopedRows;
      this.departments = this.buildDepartmentStats(scopedRows);

      if (this.departments.length && this.followUpDepartment === 'all') {
        this.loadDepartmentDetails(this.departments[0].name);
      }

      if (this.viewReady) {
        this.renderCharts();
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;

    if (this.departments.length) {
      this.renderCharts();
    }
  }

  ngOnDestroy(): void {
    this.trendChart?.destroy();
    this.weekPieChart?.destroy();
    this.weekendPieChart?.destroy();
  }

  openCard(route: string, queryParams?: Params): void {
    this.router.navigate([route], { queryParams });
  }

  loadDepartmentDetails(department: string): void {
    this.followUpDepartment = department;
  }

  onFollowUpDepartmentChange(value: string): void {
    this.followUpDepartment = value;
  }

  onFollowUpSearchChange(value: string): void {
    this.followUpSearch = value;
  }

  toggleAddFollowUp(): void {
    this.addFollowUpOpen = !this.addFollowUpOpen;
    if (!this.addFollowUpOpen) {
      this.resetFollowUpForm();
    }
  }

  setNewFollowUpType(type: FollowUpType): void {
    this.newFollowUpType = type;
    this.newFollowUpValue = '';
  }

  addFollowUp(): void {
    const rawValue = this.newFollowUpValue.trim();
    if (!rawValue) {
      return;
    }

    const value = this.newFollowUpType === 'department' ? rawValue : rawValue.toLowerCase();

    const label =
      this.newFollowUpType === 'department' ? rawValue : this.resolveEmployeeLabel(rawValue);

    const exists = this.savedFollowUps.some(
      (item) => item.type === this.newFollowUpType && item.value === value,
    );
    if (!exists) {
      this.savedFollowUps = [...this.savedFollowUps, { type: this.newFollowUpType, label, value }];
    }

    if (this.newFollowUpType === 'department') {
      this.onFollowUpDepartmentChange(rawValue);
    } else {
      this.onFollowUpDepartmentChange('all');
      this.onFollowUpSearchChange(rawValue);
    }

    this.addFollowUpOpen = false;
    this.resetFollowUpForm();
  }

  activateFollowUp(target: { type: FollowUpType; value: string }): void {
    if (target.type === 'department') {
      this.onFollowUpDepartmentChange(target.value);
      this.onFollowUpSearchChange('');
      return;
    }

    this.onFollowUpDepartmentChange('all');
    this.onFollowUpSearchChange(target.value);
  }

  removeFollowUp(target: { type: FollowUpType; value: string }): void {
    this.savedFollowUps = this.savedFollowUps.filter(
      (item) => !(item.type === target.type && item.value === target.value),
    );
  }

  get availableEmployeeOptions(): Attendance[] {
    const query = this.newFollowUpValue.trim().toLowerCase();
    const matches = this.allAttendances.filter((row) => {
      if (!query) {
        return true;
      }

      const fullName = `${row.firstName} ${row.lastName}`.toLowerCase();
      return (
        row.matricule.toLowerCase().includes(query) ||
        row.firstName.toLowerCase().includes(query) ||
        row.lastName.toLowerCase().includes(query) ||
        fullName.includes(query)
      );
    });

    return matches.slice(0, 6);
  }

  get followUpRows(): Attendance[] {
    return this.filteredDepartmentRows;
  }

  get followUpTitle(): string {
    return this.followUpDepartment === 'all' ? 'Suivi cible RH' : this.followUpDepartment;
  }

  private renderCharts(): void {
    if (!this.trendChartContainer?.nativeElement) {
      return;
    }

    this.trendChart?.destroy();
    this.weekPieChart?.destroy();
    this.weekendPieChart?.destroy();

    const trendCategories = this.isRhView
      ? this.departments.map((item) => (item.name === 'Ressources humaines' ? 'RH' : item.name))
      : this.managerTrendCategories;

    this.trendChart = Highcharts.chart(this.trendChartContainer.nativeElement, {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        spacing: [8, 8, 12, 8],
        style: {
          fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
        },
      },
      title: {
        text: undefined,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: trendCategories,
        crosshair: true,
        lineColor: 'rgba(63, 76, 92, 0.12)',
        tickColor: 'rgba(63, 76, 92, 0.12)',
        labels: {
          style: {
            color: '#778598',
            fontWeight: '600',
          },
        },
      },
      yAxis: {
        min: 0,
        gridLineColor: 'rgba(63, 76, 92, 0.08)',
        labels: {
          style: {
            color: '#778598',
          },
        },
        title: {
          text: 'Collaborateurs',
          style: {
            color: '#6c7888',
            fontWeight: '600',
          },
        },
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#536274',
          fontWeight: '600',
        },
      },
      tooltip: {
        shared: true,
        backgroundColor: '#ffffff',
        borderColor: 'rgba(63, 76, 92, 0.12)',
        borderRadius: 14,
        shadow: false,
        valueSuffix: ' collaborateurs',
      },
      plotOptions: {
        column: {
          pointPadding: 0.18,
          borderWidth: 0,
          borderRadius: 8,
          dataLabels: {
            enabled: true,
            style: {
              fontWeight: '600',
              textOutline: 'none',
            },
          },
        },
        series: {
          states: {
            inactive: {
              opacity: 1,
            },
          },
        },
      },
      series: [
        {
          type: 'column',
          name: 'Presents',
          data: this.isRhView
            ? this.departments.map((item) => item.presents)
            : this.managerTrendData,
          color: '#b39b57',
        },
        {
          type: 'column',
          name: this.isRhView ? 'Absents' : 'Collaborateurs cibles',
          data: this.isRhView
            ? this.departments.map((item) => item.absents)
            : this.managerTrendData.map((value) => Math.max(value - 1, 0)),
          color: '#d26058',
        },
      ],
    });

    if (
      !this.isRhView ||
      !this.weekPieContainer?.nativeElement ||
      !this.weekendPieContainer?.nativeElement
    ) {
      return;
    }

    this.weekPieChart = this.createPieChart(this.weekPieContainer.nativeElement, [
      { name: 'Presents', y: 1210 },
      { name: 'Absents', y: 86, sliced: true, selected: true },
      { name: 'En deplacement', y: 42 },
      { name: 'En conge', y: 31 },
      { name: 'Autres', y: 18 },
    ]);

    this.weekendPieChart = this.createPieChart(this.weekendPieContainer.nativeElement, [
      { name: 'Presents', y: 104 },
      { name: 'Absents', y: 9, sliced: true, selected: true },
      { name: 'En deplacement', y: 6 },
      { name: 'En conge', y: 4 },
      { name: 'Autres', y: 3 },
    ]);
  }

  private createPieChart(
    container: HTMLDivElement,
    data: Array<{ name: string; y: number; sliced?: boolean; selected?: boolean }>,
  ): Highcharts.Chart {
    const options: Highcharts.Options = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        zooming: {
          type: 'xy',
        },
        panning: {
          enabled: true,
          type: 'xy',
        },
        panKey: 'shift',
        spacing: [8, 8, 12, 8],
        style: {
          fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
        },
      },
      title: {
        text: undefined,
      },
      subtitle: {
        text: undefined,
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        valueSuffix: '%',
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#536274',
          fontWeight: '600',
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          borderWidth: 0,
          showInLegend: true,
          colors: ['#b39b57', '#d26058', '#5e718c', '#8b949e', '#d8c48b'],
          dataLabels: [
            {
              enabled: true,
              distance: 20,
              style: {
                color: '#536274',
                fontSize: '0.82rem',
                fontWeight: '600',
                textOutline: 'none',
              },
            },
            {
              enabled: true,
              distance: -40,
              format: '{point.percentage:.1f}%',
              style: {
                fontSize: '1.05rem',
                fontWeight: '700',
                textOutline: 'none',
                opacity: 0.7,
              },
              filter: {
                operator: '>',
                property: 'percentage',
                value: 10,
              },
            },
          ],
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Pourcentage',
          colorByPoint: true,
          data,
        } as Highcharts.SeriesPieOptions,
      ],
    };

    return Highcharts.chart(container, options);
  }

  private buildDepartmentStats(rows: Attendance[]): DepartmentCardStats[] {
    const grouped = new Map<string, DepartmentCardStats>();

    for (const row of rows) {
      const displayName = row.department === 'Legal' ? 'Juridique' : row.department;
      const current = grouped.get(displayName) ?? {
        name: displayName,
        presents: 0,
        absents: 0,
        travel: 0,
        leave: 0,
        others: 0,
        hours: '0',
      };

      switch (row.status) {
        case 'Present':
          current.presents += 1;
          break;
        case 'Absent':
          current.absents += 1;
          break;
        case 'Deplacement':
          current.travel += 1;
          break;
        case 'Conge':
          current.leave += 1;
          break;
        case 'Autres':
          current.others += 1;
          break;
        default:
          break;
      }

      current.hours = this.sumWorkedHours(current.hours, row.workedHours);
      grouped.set(displayName, current);
    }

    return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  private sumWorkedHours(currentHours: string, nextHours: string): string {
    const toMinutes = (value: string): number => {
      const match = /^(\d{2})h(\d{2})$/i.exec(value);
      if (!match) {
        return 0;
      }

      return Number(match[1]) * 60 + Number(match[2]);
    };

    const totalMinutes = toMinutes(currentHours) + toMinutes(nextHours);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}`;
  }

  private get filteredDepartmentRows(): Attendance[] {
    const department =
      this.followUpDepartment === 'all'
        ? null
        : this.followUpDepartment === 'Juridique'
          ? 'Legal'
          : this.followUpDepartment;

    const query = this.followUpSearch.trim().toLowerCase();

    return this.allAttendances.filter((row) => {
      const departmentMatch = !department || row.department === department;
      if (!departmentMatch) {
        return false;
      }

      if (!query) {
        return true;
      }

      const fullName = `${row.firstName} ${row.lastName}`.toLowerCase();
      const reverseName = `${row.lastName} ${row.firstName}`.toLowerCase();
      return (
        row.matricule.toLowerCase().includes(query) ||
        row.firstName.toLowerCase().includes(query) ||
        row.lastName.toLowerCase().includes(query) ||
        fullName.includes(query) ||
        reverseName.includes(query)
      );
    });
  }

  private resolveEmployeeLabel(value: string): string {
    const query = value.trim().toLowerCase();
    const match = this.allAttendances.find(
      (row) =>
        row.matricule.toLowerCase() === query ||
        `${row.firstName} ${row.lastName}`.toLowerCase() === query ||
        `${row.lastName} ${row.firstName}`.toLowerCase() === query,
    );

    return match ? `${match.firstName} ${match.lastName}` : value;
  }

  private resetFollowUpForm(): void {
    this.newFollowUpType = 'department';
    this.newFollowUpValue = '';
  }

  private formatPercent(value: number): string {
    return `${value.toFixed(1).replace('.', ',')}%`;
  }

  private getStatusCount(status: Attendance['status']): number {
    return this.allAttendances.filter((row) => row.status === status).length;
  }

  private getLateRowsCount(): number {
    return this.allAttendances.filter(
      (row) =>
        row.status !== 'Absent' &&
        row.status !== 'Conge' &&
        this.toMinutes(row.workedHours) > 0 &&
        this.toMinutes(row.workedHours) < 8 * 60,
    ).length;
  }

  private getTotalWorkedHours(): number {
    return Math.round(
      this.allAttendances.reduce((total, row) => total + this.toMinutes(row.workedHours), 0) / 60,
    );
  }

  private buildWeekSummary(row: Attendance, index: number, previous = false): string {
    const base =
      row.status === 'Present'
        ? previous
          ? '4/5 jours presents'
          : '5/5 jours presents'
        : row.status === 'Absent'
          ? previous
            ? '1 absence'
            : '2 absences'
          : row.status === 'Deplacement'
            ? previous
              ? '2 jours terrain'
              : '3 jours terrain'
            : row.status === 'Conge'
              ? previous
                ? 'Conge planifie'
                : 'Conge en cours'
              : previous
                ? '1 motif saisi'
                : '2 motifs saisis';

    if (index % 2 === 0) {
      return base;
    }

    return previous ? 'Semaine stable' : base;
  }

  private toMinutes(value: string): number {
    const match = /^(\d{2})h(\d{2})$/i.exec(value);
    if (!match) {
      return 0;
    }

    return Number(match[1]) * 60 + Number(match[2]);
  }

  private getScopedAttendances(rows: Attendance[]): Attendance[] {
    if (this.isRhView) {
      return rows;
    }

    const department = this.sessionService.getDepartmentName();
    return rows.filter((row) => row.department === department);
  }
}

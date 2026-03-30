import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import {
  DashboardService,
  DashboardViewModel,
  DepartmentHours
} from '../../../../core/services/dashboard';
import { SessionService } from '../../../../core/services/session.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  viewModel?: DashboardViewModel;
  private weekChart?: Chart;
  private weekendChart?: Chart;
  private monthlyChart?: Chart;
  private yearlyChart?: Chart;

  constructor(
    private dashboardService: DashboardService,
    public sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe(data => {
      this.viewModel = data;
      setTimeout(() => this.renderCharts(), 50);
    });
  }

  ngAfterViewInit(): void {
    this.renderCharts();
  }

  ngOnDestroy(): void {
    this.weekChart?.destroy();
    this.weekendChart?.destroy();
    this.monthlyChart?.destroy();
    this.yearlyChart?.destroy();
  }

  get isRh(): boolean {
    return this.sessionService.isRh();
  }

  getCardClass(tone: string): string {
    return `tone-${tone}`;
  }

  private renderCharts(): void {
    if (!this.viewModel) {
      return;
    }

    this.renderPie('weekPieChart', this.viewModel.weekPie.labels, this.viewModel.weekPie.values, chart => {
      this.weekChart?.destroy();
      this.weekChart = chart;
    });

    this.renderPie('weekendPieChart', this.viewModel.weekendPie.labels, this.viewModel.weekendPie.values, chart => {
      this.weekendChart?.destroy();
      this.weekendChart = chart;
    });

    if (this.isRh && this.viewModel.monthlyHours && this.viewModel.yearlyHours) {
      this.renderBar('monthlyHoursChart', this.viewModel.monthlyHours, 'Heures mensuelles', chart => {
        this.monthlyChart?.destroy();
        this.monthlyChart = chart;
      });
      this.renderBar('yearlyHoursChart', this.viewModel.yearlyHours, 'Heures annuelles', chart => {
        this.yearlyChart?.destroy();
        this.yearlyChart = chart;
      });
    }
  }

  private renderPie(canvasId: string, labels: string[], values: number[], register: (chart: Chart) => void): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }

    const config: ChartConfiguration<'pie', number[], string> = {
      type: 'pie',
      data: {
        labels,
        datasets: [{ data: values, backgroundColor: ['#2f8b3c', '#c62828', '#1f5fbf', '#7a7a7a', '#f29d16'], borderWidth: 0 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 150,
        plugins: { legend: { position: 'bottom' } }
      }
    };

    register(new Chart(canvas, config));
  }

  private renderBar(canvasId: string, dataset: DepartmentHours[], label: string, register: (chart: Chart) => void): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }

    const config: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: {
        labels: dataset.map(item => item.department),
        datasets: [{ label, data: dataset.map(item => item.hours), backgroundColor: '#b39b57', borderRadius: 8 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 150,
        plugins: { legend: { display: false } }
      }
    };

    register(new Chart(canvas, config));
  }
}

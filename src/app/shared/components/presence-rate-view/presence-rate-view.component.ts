import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Highcharts from 'highcharts';
import { PresenceRateService } from '../../../core/services/presence-rate.service';
import { PresenceRateViewModel } from '../../models/presence-rate.model';

@Component({
  selector: 'app-presence-rate-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './presence-rate-view.component.html',
  styleUrl: './presence-rate-view.component.scss'
})
export class PresenceRateViewComponent implements AfterViewInit, OnDestroy {
  private readonly presenceRateService = inject(PresenceRateService);
  @Input() role: 'RH' | 'RESPONSABLE' = 'RH';
  @Input() defaultDepartment = 'Tous les departements';

  @ViewChild('dailyChart') dailyChartContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('weeklyChart') weeklyChartContainer?: ElementRef<HTMLDivElement>;

  viewModel?: PresenceRateViewModel;
  selectedDepartment = 'Tous les departements';

  private dailyChart?: Highcharts.Chart;
  private weeklyChart?: Highcharts.Chart;

  ngAfterViewInit(): void {
    this.selectedDepartment = this.defaultDepartment;
    this.loadView();
  }

  ngOnDestroy(): void {
    this.dailyChart?.destroy();
    this.weeklyChart?.destroy();
  }

  onDepartmentChange(): void {
    this.loadView();
  }

  private loadView(): void {
    this.presenceRateService
      .getViewModel(this.role, this.selectedDepartment)
      .subscribe(viewModel => {
        this.viewModel = viewModel;
        this.selectedDepartment = viewModel.selectedDepartment;
        queueMicrotask(() => this.renderCharts());
      });
  }

  private renderCharts(): void {
    if (!this.viewModel || !this.dailyChartContainer?.nativeElement || !this.weeklyChartContainer?.nativeElement) {
      return;
    }

    this.dailyChart?.destroy();
    this.weeklyChart?.destroy();

    this.dailyChart = Highcharts.chart(this.dailyChartContainer.nativeElement, {
      chart: {
        type: 'areaspline',
        backgroundColor: 'transparent',
        spacing: [8, 8, 12, 8],
        style: {
          fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif'
        }
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        categories: this.viewModel.dailyStats.map(item => item.dayLabel),
        labels: {
          style: { color: '#7f8b98', fontWeight: '600' }
        },
        lineColor: 'rgba(63, 76, 92, 0.1)',
        tickColor: 'rgba(63, 76, 92, 0.1)'
      },
      yAxis: {
        title: { text: 'Taux (%)', style: { color: '#7f8b98', fontWeight: '600' } },
        gridLineColor: 'rgba(63, 76, 92, 0.08)',
        max: 100
      },
      legend: { enabled: false },
      tooltip: {
        shared: true,
        backgroundColor: '#ffffff',
        borderColor: 'rgba(63, 76, 92, 0.12)',
        borderRadius: 14,
        shadow: false,
        valueSuffix: '%'
      },
      plotOptions: {
        areaspline: {
          lineWidth: 3,
          marker: {
            radius: 4,
            lineWidth: 2,
            lineColor: '#ffffff'
          },
          fillOpacity: 0.18
        }
      },
      series: [
        {
          type: 'areaspline',
          name: 'Taux journalier',
          data: this.viewModel.dailyStats.map(item => item.rate),
          color: '#b39b57'
        }
      ]
    });

    this.weeklyChart = Highcharts.chart(this.weeklyChartContainer.nativeElement, {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        spacing: [8, 8, 12, 8],
        style: {
          fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif'
        }
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        categories: this.viewModel.weeklyStats.map(item => item.weekLabel),
        labels: {
          style: { color: '#7f8b98', fontWeight: '600' }
        },
        lineColor: 'rgba(63, 76, 92, 0.1)',
        tickColor: 'rgba(63, 76, 92, 0.1)'
      },
      yAxis: {
        title: { text: 'Taux (%)', style: { color: '#7f8b98', fontWeight: '600' } },
        gridLineColor: 'rgba(63, 76, 92, 0.08)',
        max: 100
      },
      legend: { enabled: false },
      tooltip: {
        shared: true,
        backgroundColor: '#ffffff',
        borderColor: 'rgba(63, 76, 92, 0.12)',
        borderRadius: 14,
        shadow: false,
        valueSuffix: '%'
      },
      plotOptions: {
        column: {
          borderRadius: 10,
          borderWidth: 0,
          pointPadding: 0.18
        }
      },
      series: [
        {
          type: 'column',
          name: 'Taux hebdomadaire',
          data: this.viewModel.weeklyStats.map(item => item.rate),
          color: '#c7b47a'
        }
      ]
    });
  }
}

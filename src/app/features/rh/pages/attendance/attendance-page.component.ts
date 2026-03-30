import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import Highcharts from 'highcharts';
import { StatisticsService } from '../../../../core/services/statistics.service';
import { SessionService } from '../../../../core/services/session.service';
import { StatisticsMetric, StatisticsViewModel } from '../../../../shared/models/statistics.model';

@Component({
  selector: 'app-attendance-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance-page.component.html',
  styleUrl: './attendance-page.component.scss'
})
export class AttendancePageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('weekChart') weekChartContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('monthChart') monthChartContainer?: ElementRef<HTMLDivElement>;

  metric: StatisticsMetric = 'presence';
  viewModel?: StatisticsViewModel;
  private weekChart?: Highcharts.Chart;
  private monthChart?: Highcharts.Chart;

  constructor(
    private statisticsService: StatisticsService,
    public sessionService: SessionService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const metric = (params.get('metric') as StatisticsMetric | null) ?? 'presence';
      this.metric = ['presence', 'absence', 'late', 'hours'].includes(metric) ? metric : 'presence';
      this.loadView();
    });
  }

  ngOnDestroy(): void {
    this.weekChart?.destroy();
    this.monthChart?.destroy();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Present':
        return 'text-bg-success';
      case 'Absent':
        return 'text-bg-danger';
      case 'Deplacement':
        return 'text-bg-info';
      case 'Autres':
        return 'text-bg-warning';
      default:
        return 'text-bg-secondary';
    }
  }

  private loadView(): void {
    this.statisticsService.getView(this.metric).subscribe(viewModel => {
      this.viewModel = viewModel;
      this.cdr.detectChanges();
      setTimeout(() => this.renderCharts(), 0);
    });
  }

  private renderCharts(): void {
    this.weekChart?.destroy();
    this.monthChart?.destroy();

    if (!this.viewModel?.weekChart || !this.viewModel?.monthChart || !this.weekChartContainer?.nativeElement || !this.monthChartContainer?.nativeElement) {
      return;
    }

    this.weekChart = this.createPieChart(this.weekChartContainer.nativeElement, this.viewModel.weekChart);
    this.monthChart = this.createPieChart(this.monthChartContainer.nativeElement, this.viewModel.monthChart);
  }

  private createPieChart(container: HTMLDivElement, data: StatisticsViewModel['weekChart']): Highcharts.Chart {
    const pieData = (data ?? []).map(item => ({
      ...item,
      color: this.getPieColor(item.name)
    }));

    const options: Highcharts.Options = {
      chart: {
        type: 'pie',
        zooming: {
          type: 'xy'
        },
        panning: {
          enabled: true,
          type: 'xy'
        },
        panKey: 'shift',
        backgroundColor: 'transparent',
        spacing: [8, 8, 12, 8],
        style: {
          fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif'
        }
      },
      title: { text: undefined },
      subtitle: { text: undefined },
      credits: { enabled: false },
      tooltip: {
        valueSuffix: '%'
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#536274',
          fontWeight: '600'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          borderWidth: 0,
          dataLabels: [
            {
              enabled: true,
              distance: 20,
              style: {
                color: '#536274',
                fontSize: '0.82rem',
                fontWeight: '600',
                textOutline: 'none'
              }
            },
            {
              enabled: true,
              distance: -40,
              format: '{point.percentage:.1f}%',
              style: {
                fontSize: '1.05rem',
                fontWeight: '700',
                textOutline: 'none',
                opacity: 0.7
              },
              filter: {
                operator: '>',
                property: 'percentage',
                value: 10
              }
            }
          ]
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Pourcentage',
          colorByPoint: true,
          data: pieData
        } as Highcharts.SeriesPieOptions
      ]
    };

    return Highcharts.chart(container, options);
  }

  private getPieColor(name: string): string {
    switch (name) {
      case 'Present':
      case 'Absents':
      case 'Autres statuts':
        return '#b39b57';
      case 'Deplacement':
      case 'En deplacement':
        return '#6f95c2';
      case 'Autres':
        return '#d6a04c';
      case 'Absent':
        return '#d26058';
      default:
        return '#9aa5b1';
    }
  }
}

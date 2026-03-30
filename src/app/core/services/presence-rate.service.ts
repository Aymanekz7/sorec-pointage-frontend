import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  PresenceRateDailyStat,
  PresenceRateViewModel,
  PresenceRateWeeklyStat
} from '../../shared/models/presence-rate.model';

type PresenceRateRole = 'RH' | 'RESPONSABLE';

interface DepartmentDataset {
  name: string;
  totalEmployees: number;
  daily: Array<{
    date: string;
    dayLabel: string;
    presents: number;
    absents: number;
    travel: number;
    leave: number;
  }>;
  weekly: Array<{
    weekLabel: string;
    presents: number;
    total: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class PresenceRateService {
  private readonly datasets: DepartmentDataset[] = [
    {
      name: 'Direction IT',
      totalEmployees: 47,
      daily: [
        { date: '2026-03-18', dayLabel: 'Mar', presents: 42, absents: 2, travel: 2, leave: 1 },
        { date: '2026-03-19', dayLabel: 'Mer', presents: 43, absents: 1, travel: 2, leave: 1 },
        { date: '2026-03-20', dayLabel: 'Jeu', presents: 41, absents: 3, travel: 2, leave: 1 },
        { date: '2026-03-21', dayLabel: 'Ven', presents: 44, absents: 1, travel: 1, leave: 1 },
        { date: '2026-03-22', dayLabel: 'Sam', presents: 18, absents: 25, travel: 2, leave: 2 },
        { date: '2026-03-23', dayLabel: 'Dim', presents: 12, absents: 29, travel: 3, leave: 3 },
        { date: '2026-03-24', dayLabel: 'Lun', presents: 44, absents: 1, travel: 1, leave: 1 }
      ],
      weekly: [
        { weekLabel: 'Semaine 09', presents: 202, total: 235 },
        { weekLabel: 'Semaine 10', presents: 208, total: 235 },
        { weekLabel: 'Semaine 11', presents: 210, total: 235 },
        { weekLabel: 'Semaine 12', presents: 214, total: 235 }
      ]
    },
    {
      name: 'Ressources humaines',
      totalEmployees: 29,
      daily: [
        { date: '2026-03-18', dayLabel: 'Mar', presents: 26, absents: 1, travel: 1, leave: 1 },
        { date: '2026-03-19', dayLabel: 'Mer', presents: 25, absents: 2, travel: 1, leave: 1 },
        { date: '2026-03-20', dayLabel: 'Jeu', presents: 27, absents: 1, travel: 0, leave: 1 },
        { date: '2026-03-21', dayLabel: 'Ven', presents: 26, absents: 1, travel: 1, leave: 1 },
        { date: '2026-03-22', dayLabel: 'Sam', presents: 9, absents: 17, travel: 1, leave: 2 },
        { date: '2026-03-23', dayLabel: 'Dim', presents: 7, absents: 18, travel: 2, leave: 2 },
        { date: '2026-03-24', dayLabel: 'Lun', presents: 27, absents: 1, travel: 0, leave: 1 }
      ],
      weekly: [
        { weekLabel: 'Semaine 09', presents: 121, total: 145 },
        { weekLabel: 'Semaine 10', presents: 124, total: 145 },
        { weekLabel: 'Semaine 11', presents: 126, total: 145 },
        { weekLabel: 'Semaine 12', presents: 127, total: 145 }
      ]
    },
    {
      name: 'Operations',
      totalEmployees: 86,
      daily: [
        { date: '2026-03-18', dayLabel: 'Mar', presents: 72, absents: 8, travel: 3, leave: 3 },
        { date: '2026-03-19', dayLabel: 'Mer', presents: 70, absents: 10, travel: 3, leave: 3 },
        { date: '2026-03-20', dayLabel: 'Jeu', presents: 74, absents: 7, travel: 2, leave: 3 },
        { date: '2026-03-21', dayLabel: 'Ven', presents: 75, absents: 6, travel: 2, leave: 3 },
        { date: '2026-03-22', dayLabel: 'Sam', presents: 31, absents: 48, travel: 4, leave: 3 },
        { date: '2026-03-23', dayLabel: 'Dim', presents: 24, absents: 53, travel: 5, leave: 4 },
        { date: '2026-03-24', dayLabel: 'Lun', presents: 76, absents: 5, travel: 2, leave: 3 }
      ],
      weekly: [
        { weekLabel: 'Semaine 09', presents: 334, total: 430 },
        { weekLabel: 'Semaine 10', presents: 341, total: 430 },
        { weekLabel: 'Semaine 11', presents: 347, total: 430 },
        { weekLabel: 'Semaine 12', presents: 352, total: 430 }
      ]
    },
    {
      name: 'Marketing',
      totalEmployees: 25,
      daily: [
        { date: '2026-03-18', dayLabel: 'Mar', presents: 22, absents: 2, travel: 1, leave: 0 },
        { date: '2026-03-19', dayLabel: 'Mer', presents: 21, absents: 2, travel: 1, leave: 1 },
        { date: '2026-03-20', dayLabel: 'Jeu', presents: 22, absents: 1, travel: 1, leave: 1 },
        { date: '2026-03-21', dayLabel: 'Ven', presents: 23, absents: 1, travel: 1, leave: 0 },
        { date: '2026-03-22', dayLabel: 'Sam', presents: 8, absents: 15, travel: 1, leave: 1 },
        { date: '2026-03-23', dayLabel: 'Dim', presents: 6, absents: 16, travel: 1, leave: 2 },
        { date: '2026-03-24', dayLabel: 'Lun', presents: 23, absents: 1, travel: 1, leave: 0 }
      ],
      weekly: [
        { weekLabel: 'Semaine 09', presents: 98, total: 125 },
        { weekLabel: 'Semaine 10', presents: 101, total: 125 },
        { weekLabel: 'Semaine 11', presents: 104, total: 125 },
        { weekLabel: 'Semaine 12', presents: 106, total: 125 }
      ]
    },
    {
      name: 'Finance',
      totalEmployees: 37,
      daily: [
        { date: '2026-03-18', dayLabel: 'Mar', presents: 31, absents: 3, travel: 2, leave: 1 },
        { date: '2026-03-19', dayLabel: 'Mer', presents: 32, absents: 2, travel: 2, leave: 1 },
        { date: '2026-03-20', dayLabel: 'Jeu', presents: 30, absents: 4, travel: 2, leave: 1 },
        { date: '2026-03-21', dayLabel: 'Ven', presents: 33, absents: 2, travel: 1, leave: 1 },
        { date: '2026-03-22', dayLabel: 'Sam', presents: 12, absents: 21, travel: 2, leave: 2 },
        { date: '2026-03-23', dayLabel: 'Dim', presents: 9, absents: 24, travel: 2, leave: 2 },
        { date: '2026-03-24', dayLabel: 'Lun', presents: 34, absents: 1, travel: 1, leave: 1 }
      ],
      weekly: [
        { weekLabel: 'Semaine 09', presents: 144, total: 185 },
        { weekLabel: 'Semaine 10', presents: 148, total: 185 },
        { weekLabel: 'Semaine 11', presents: 151, total: 185 },
        { weekLabel: 'Semaine 12', presents: 154, total: 185 }
      ]
    },
    {
      name: 'Juridique',
      totalEmployees: 22,
      daily: [
        { date: '2026-03-18', dayLabel: 'Mar', presents: 18, absents: 2, travel: 0, leave: 2 },
        { date: '2026-03-19', dayLabel: 'Mer', presents: 19, absents: 1, travel: 0, leave: 2 },
        { date: '2026-03-20', dayLabel: 'Jeu', presents: 18, absents: 2, travel: 1, leave: 1 },
        { date: '2026-03-21', dayLabel: 'Ven', presents: 19, absents: 1, travel: 1, leave: 1 },
        { date: '2026-03-22', dayLabel: 'Sam', presents: 7, absents: 12, travel: 1, leave: 2 },
        { date: '2026-03-23', dayLabel: 'Dim', presents: 5, absents: 13, travel: 2, leave: 2 },
        { date: '2026-03-24', dayLabel: 'Lun', presents: 19, absents: 1, travel: 1, leave: 1 }
      ],
      weekly: [
        { weekLabel: 'Semaine 09', presents: 82, total: 110 },
        { weekLabel: 'Semaine 10', presents: 85, total: 110 },
        { weekLabel: 'Semaine 11', presents: 87, total: 110 },
        { weekLabel: 'Semaine 12', presents: 90, total: 110 }
      ]
    }
  ];

  getViewModel(role: PresenceRateRole, department = 'Tous les departements'): Observable<PresenceRateViewModel> {
    const availableDepartments = ['Tous les departements', ...this.datasets.map(item => item.name)];
    const scope = role === 'RH'
      ? department
      : 'Direction IT';

    const dataset = role === 'RH' && department !== 'Tous les departements'
      ? this.datasets.find(item => item.name === department) ?? this.buildAggregateDataset()
      : role === 'RESPONSABLE'
        ? this.datasets.find(item => item.name === 'Direction IT') ?? this.buildAggregateDataset()
        : this.buildAggregateDataset();

    const dailyStats = dataset.daily.map(item => ({
      ...item,
      total: item.presents + item.absents + item.travel + item.leave,
      rate: this.toRate(item.presents, item.presents + item.absents + item.travel + item.leave)
    }));

    const weeklyStats = dataset.weekly.map((item, index, list) => ({
      ...item,
      rate: this.toRate(item.presents, item.total),
      variation: index === 0 ? 0 : this.toDelta(item.presents, list[index - 1].presents)
    }));

    const todayStat = dailyStats[dailyStats.length - 1];
    const currentWeek = weeklyStats[weeklyStats.length - 1];
    const previousWeek = weeklyStats[weeklyStats.length - 2] ?? currentWeek;
    const averageWeekRate = weeklyStats.reduce((sum, item) => sum + item.rate, 0) / weeklyStats.length;

    return of({
      pageTitle: 'Taux de presence',
      scopeLabel: role === 'RH' ? scope : 'Direction IT',
      departments: role === 'RH' ? availableDepartments : ['Direction IT'],
      selectedDepartment: role === 'RH' ? scope : 'Direction IT',
      targetRate: 95,
      summaryCards: [
        {
          title: 'Aujourd hui',
          value: `${todayStat.rate.toFixed(1).replace('.', ',')}%`,
          subtitle: `${todayStat.presents} presents sur ${todayStat.total}`,
          tone: 'gold'
        },
        {
          title: 'Cette semaine',
          value: `${currentWeek.rate.toFixed(1).replace('.', ',')}%`,
          subtitle: `${currentWeek.presents} presences sur ${currentWeek.total}`,
          tone: 'success'
        },
        {
          title: 'Variation hebdomadaire',
          value: `${currentWeek.variation >= 0 ? '+' : ''}${currentWeek.variation.toFixed(1).replace('.', ',')}%`,
          subtitle: 'Comparaison avec la semaine precedente',
          tone: 'warning'
        },
        {
          title: 'Moyenne 4 semaines',
          value: `${averageWeekRate.toFixed(1).replace('.', ',')}%`,
          subtitle: 'Objectif SOREC : 95%',
          tone: 'neutral'
        }
      ],
      dailyStats,
      weeklyStats
    });
  }

  private buildAggregateDataset(): DepartmentDataset {
    const daily = this.datasets[0].daily.map((entry, index) => {
      const aggregate = this.datasets.reduce(
        (acc, dataset) => {
          const current = dataset.daily[index];
          acc.presents += current.presents;
          acc.absents += current.absents;
          acc.travel += current.travel;
          acc.leave += current.leave;
          return acc;
        },
        {
          date: entry.date,
          dayLabel: entry.dayLabel,
          presents: 0,
          absents: 0,
          travel: 0,
          leave: 0
        }
      );

      return aggregate;
    });

    const weekly = this.datasets[0].weekly.map((entry, index) => {
      const aggregate = this.datasets.reduce(
        (acc, dataset) => {
          const current = dataset.weekly[index];
          acc.presents += current.presents;
          acc.total += current.total;
          return acc;
        },
        {
          weekLabel: entry.weekLabel,
          presents: 0,
          total: 0
        }
      );

      return aggregate;
    });

    return {
      name: 'Tous les departements',
      totalEmployees: this.datasets.reduce((sum, item) => sum + item.totalEmployees, 0),
      daily,
      weekly
    };
  }

  private toRate(presents: number, total: number): number {
    return Number(((presents / total) * 100).toFixed(1));
  }

  private toDelta(current: number, previous: number): number {
    return Number((((current - previous) / previous) * 100).toFixed(1));
  }
}

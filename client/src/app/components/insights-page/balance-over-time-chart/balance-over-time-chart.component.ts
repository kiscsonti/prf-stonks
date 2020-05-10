import {Component, Input, OnInit} from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {computed, observable} from 'mobx-angular';
import {Record} from '../../../models/Record';


@Component({
  selector: 'app-balance-over-time-chart',
  templateUrl: './balance-over-time-chart.component.html',
  styleUrls: ['./balance-over-time-chart.component.css']
})
export class BalanceOverTimeChartComponent implements OnInit {
  @observable @Input() records: Record[];
  @Input() filtered;
  @observable scaleBy = 'day';
  public lineChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      enabled: true,
      backgroundColor: 'rgb(255, 64, 129, 0.7)',
      displayColors: false
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    aspectRatio: 2.5
  };
  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgb(63, 81, 181, 0.3)',
      borderColor: 'rgb(63, 81, 181, 0.8)'
    }
  ];
  public lineChartType: ChartType = 'line';

  constructor() { }

  ngOnInit(): void {
  }

  @computed get sumsByTime() {
    if (this.records) {
      const data = new Map();
      const dateSet = new Set<string>();
      let chartLabels: Array<string>;

      if (this.scaleBy === 'day') {
        this.records.forEach(record => {
          dateSet.add(record.date);
        });
        const dates = [...dateSet].sort();
        dates.forEach(date => {
          data.set(date, 0);
          let sumExp = 0;
          let sumInc = 0;
          this.records.forEach(record => {
            if (record.date <= date) {
              const value = record.value * -1;
              if (value > 0) {
                sumInc += value;
              } else {
                sumExp += (-1 * value);
              }
            }
          });
          data.set(date, sumInc - sumExp);
        });
        chartLabels = [...data.keys()].map(date => {
          date = new Date(date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          });
          return date;
        });
      } else if (this.scaleBy === 'month') {
        this.records.forEach(record => {
          const date = new Date(record.date);
          const month = new Date(date.getFullYear(), date.getMonth(), 1);
          dateSet.add(month.toISOString());
        });
        const dates = [...dateSet].sort();
        dates.forEach(date => {
          data.set(date, 0);
          let sumExp = 0;
          let sumInc = 0;
          this.records.forEach(record => {
            const recordDate = new Date(record.date);
            const recordMonth = new Date(recordDate.getFullYear(), recordDate.getMonth(), 1);
            const recordMonthStr = recordMonth.toISOString();
            if (recordMonthStr <= date) {
              const value = record.value * -1;
              if (value > 0) {
                sumInc += value;
              } else {
                sumExp += (-1 * value);
              }
            }
          });
          data.set(date, sumInc - sumExp);
        });
        chartLabels = [...data.keys()].map(date => {
          date = new Date(date).toLocaleDateString(undefined, {
            month: 'long'
          });
          return date;
        });
      }
      chartLabels.unshift(' ');
      const arrayData = [...data.values()];
      arrayData.unshift(0);
      return {
        chartLabels,
        chartData: [ { data: arrayData, lineTension: 0.1 } ] // line-tension
      };
    }
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {computed, observable} from 'mobx-angular';
import {Record} from '../../../models/Record';



@Component({
  selector: 'app-spendings-over-time-chart',
  templateUrl: './spendings-over-time-chart.component.html',
  styleUrls: ['./spendings-over-time-chart.component.css']
})
export class SpendingsOverTimeChartComponent implements OnInit {
  @observable @Input() records: Record[];
  @Input() filtered;
  @observable scaleBy = 'day';
  tagsByPoint: Array<Set<string>> = new Array<Set<string>>();
  public lineChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      displayColors: false,
      backgroundColor: 'rgb(63, 81, 181, 0.7)',
      callbacks: {
        title: () => 'Tags involved:',
        label: (data) => {
          const tagSet = this.tagsByPoint[data.index];
          if (tagSet.has('')) {
            tagSet.delete('');
            tagSet.add('untagged');
          }
          return [...tagSet].sort().join(',');
        }
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgb(161,136,127, 0.2)',
      borderWidth: 1,
      borderColor: '#8d6e63'
    }
  ];
  public barChartType: ChartType = 'bar';


  constructor() { }

  ngOnInit(): void {
    // setTimeout(() => this.sumsByTime, 1000);
  }

  @computed get sumsByTime() {
    if (this.records) {
      const data = new Map();
      const dateSet = new Set<string>();
      let chartLabels: Array<string>;
      this.tagsByPoint = new Array<Set<string>>();

      if (this.scaleBy === 'day') {
        this.records.forEach(record => {
          dateSet.add(record.date);
        });
        const dates = [...dateSet].sort();
        dates.forEach(date => {
          data.set(date, 0);
          const tags = new Set<string>();
          this.records.forEach(record => {
            if (record.date === date) {
              const value = record.value * -1;
              data.set(date, data.get(date) + value);
              record.tags.forEach(tag => {
                tags.add(tag);
              });
            }
          });
          this.tagsByPoint.push(tags);
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
          const tags = new Set<string>();
          this.records.forEach(record => {
            const recordDate = new Date(record.date);
            const recordMonth = new Date(recordDate.getFullYear(), recordDate.getMonth(), 1);
            const recordMonthStr = recordMonth.toISOString();
            if (recordMonthStr === date) {
              const value = record.value * -1;
              data.set(date, data.get(date) + value);
              record.tags.forEach(tag => {
                tags.add(tag);
              });
            }
          });
          this.tagsByPoint.push(tags);
        });
        chartLabels = [...data.keys()].map(date => {
          date = new Date(date).toLocaleDateString(undefined, {
            month: 'long'
          });
          return date;
        });
      }
      return {
        chartLabels,
        chartData: [ { data: [...data.values()], lineTension: 0.1 } ] // line-tension
      };
    }
  }

}

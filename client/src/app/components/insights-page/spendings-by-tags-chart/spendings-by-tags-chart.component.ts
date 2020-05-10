import {Component, Input, OnInit} from '@angular/core';
import { Record } from '../../../models/Record';
import {ChartOptions, ChartType} from 'chart.js';
import { observable, computed } from 'mobx-angular';

@Component({
  selector: 'app-spendings-by-tags-chart',
  templateUrl: './spendings-by-tags-chart.component.html',
  styleUrls: ['./spendings-by-tags-chart.component.css']
})
export class SpendingsByTagsChartComponent implements OnInit {
  // @observable @Input() chartData: { records: Record[], tags: string[] };
  @observable @Input() records: Record[];
  @Input() filtered;
  @observable type = 'income';

  public barChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      enabled: false
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
      borderWidth: 1,
      backgroundColor: [].concat(...new Array(100).fill([
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)'
      ])),
      borderColor: [].concat(...new Array(100).fill([
        'rgba(255, 99, 132, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(153, 102, 255, 1)'
      ]))
    }
  ];


  public barChartType: ChartType = 'bar';
  public barChartLegend = false;

  constructor() {
  }

  ngOnInit() {

  }

  getDistinctTags() {
    const tags = new Set<string>();
    this.records.forEach(record => {
      if (record.tags && record.tags.length > 0) {
        record.tags.forEach(tag => {
          tags.add(tag);
        });
      }
    });
    return tags;
  }

  @computed get tagSums() { // Untagged not tested well
    if (this.records) {
      const data = new Map();
      const tags = [...this.getDistinctTags()];
      // const tags = ['no tag', ...this.chartData.tags];
      tags.forEach(tag => {
        data.set(tag, 0);
        this.records.forEach(record => {
          if (record.tags.includes(tag)) {
            if (this.type === 'income') {
              if (record.value < 0) {
                const value = record.value * -1;
                data.set(tag, data.get(tag) + value);
              }
            } else {
              if (record.value >= 0) {
                data.set(tag, data.get(tag) + record.value);
              }
            }
          }
          if (tag === 'Untagged' && record.tags.length === 0) {
            data.set(tag, data.get(tag) + record.value);
          }
        });
      });
      if (data.get('') && data.get('') !== 0) {
        data.set('Untagged', data.get(''));
      }
      data.delete('');

      const sortedData = new Map([...data.entries()].sort());
      sortedData.forEach((value, key) => {
        if (value === 0) {
          sortedData.delete(key);
        }
      });
      return {
        chartLabels: [...sortedData.keys()],
        chartData: [ { data: [...sortedData.values()] } ],
      };
    }
  }

}

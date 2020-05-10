import {Component, OnInit} from '@angular/core';
import { Record } from '../../models/Record';
import { RecordService } from '../../services/record.service';
import { zoomInAnimation } from '../../services/animations';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-insights-page',
  templateUrl: './insights-page.component.html',
  styleUrls: ['./insights-page.component.css'],
  animations: [zoomInAnimation]
})
export class InsightsPageComponent implements OnInit {
  tags: string[] = [];
  records: Record[];
  filtered = false;
  filter: {
    fromDate: any,
    toDate: any,
    includingTags: string[],
    excludingTags: string[]
  };
  filteredDownload = true;
  replaceUpload = false;
  loading = false;
  error = false;

  constructor(
    private recordService: RecordService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getTags();
  }

  getRecords(filterData, csvImport) {
    if (JSON.stringify(filterData) === JSON.stringify(this.filter) && !csvImport) {
      return;
    }
    this.loading = true;
    this.recordService.get({
      fromDate: filterData.fromDate,
      toDate: filterData.toDate,
      includingTags: filterData.includingTags,
      excludingTags: filterData.excludingTags
    }).subscribe(result => {
      this.filter = {
        fromDate: new Date(filterData.fromDate),
        toDate: new Date(filterData.toDate),
        includingTags: filterData.includingTags,
        excludingTags: filterData.excludingTags
      };
      const filterTags = new Set<string>(filterData.includingTags);
      const allTags = new Set(this.tags);
      if (filterTags && filterTags.size !== allTags.size && filterTags.size !== 0) {
        this.filtered = true;
      } else if (filterTags && filterTags.size !== 0) {
        this.filtered = false;
        for (const tag of filterTags) {
          if (!allTags.has(tag)) {
            this.filtered = true;
            break;
          }
        }
      } else {
        this.filtered = false;
      }
      this.records = result.records;
      this.loading = false;
    }, error => {
      this.snackBar.open('An unexpected error happened while fetching your records.', null, {
        duration: 3000,
        panelClass: ['snack-bar']
      });
      this.loading = false;
      this.error = true;
    });
  }

  getTags() {
    this.recordService.tags().subscribe(result => {
      result.tags.forEach(index => this.tags = [...new Set([...this.tags, ...index.split(',').filter(tag => tag !== '')])]);
      this.tags.sort();
    }, error => {
      this.snackBar.open('An unexpected error happened while fetching your tags.', null, {
        duration: 3000,
        panelClass: ['snack-bar']
      });
    });
  }

  get sum() {
    if (this.records) {
      let sumExp = 0;
      let sumInc = 0;
      this.records.forEach(record => {
        if (record.value >= 0) {
          sumExp += record.value;
        } else {
          sumInc += record.value;
        }
      });
      return {
        exp: sumExp,
        inc: -1 * sumInc
      };
    }
  }

  get average(): string {
    if (this.records) {
      let sum = 0;
      this.records.forEach(record => {
        sum += +record.value;
      });
      const diffTime = Math.abs(this.filter.toDate - this.filter.fromDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return (sum / diffDays).toFixed(2);
    }
  }

  get biggest() {
    if (this.records) {
      let biggest: Record;
      this.records.forEach(record => {
        if (!biggest || biggest.value < record.value) {
          biggest = record;
        }
      });
      return {
        value: biggest.value,
        tags: biggest.tags.join(', ')
      };
    }
  }

  downloadCSV() {
    let filter: object;
    let filename: string;
    if (this.filteredDownload) {
      filter = this.filter;
      filename = 'filtered-data-of-' + JSON.parse(localStorage.getItem('user')).username + '.csv';
    } else {
      filter = {};
      filename = 'data-of-' + JSON.parse(localStorage.getItem('user')).username + '.csv';
    }
    this.recordService.downloadCSV(filter).subscribe(result => {
      console.log(result.csv);
      const blob = new Blob([result.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = filename;
      anchor.href = url;
      anchor.click();
    }, error => {
      this.snackBar.open('An unexpected error happened while fetching your records.', null, {
        duration: 3000,
        panelClass: ['snack-bar']
      });
    });
  }

  uploadCSV(files: FileList) {
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const csv = reader.result;
        if (this.replaceUpload) {
          this.recordService.replaceUploadCSV(csv).subscribe(() => {
            this.getRecords(this.filter, true);
          }, error => {
            this.snackBar.open('An unexpected error happened during the upload.', null, {
              duration: 3000,
              panelClass: ['snack-bar']
            });
          });
        } else {
          this.recordService.uploadCSV(csv).subscribe(() => {
            this.getRecords(this.filter, true);
            this.snackBar.open('CSV data uploaded successfully.', null, {
              duration: 2000,
              panelClass: ['snack-bar']
            });
          }, error => {
            this.snackBar.open('An unexpected error happened during the upload.', null, {
              duration: 3000,
              panelClass: ['snack-bar']
            });
          });
        }
      };
    }
  }

}

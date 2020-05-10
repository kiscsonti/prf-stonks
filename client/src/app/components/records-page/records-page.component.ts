import {Component, OnInit, ViewChild} from '@angular/core';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import { RecordService } from '../../services/record.service';
import {Record} from '../../models/Record';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {faEdit} from '@fortawesome/free-solid-svg-icons';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-records-page',
  templateUrl: './records-page.component.html',
  styleUrls: ['./records-page.component.css'],
})
export class RecordsPageComponent implements OnInit {
  displayedColumns: string[] = ['value', 'type', 'tags', 'date', 'operations'];
  dataSource: MatTableDataSource<Record>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;

  constructor(
    public dialog: MatDialog,
    private recordService: RecordService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.sort.sort({ id: 'date', start: 'desc', disableClear: false });

    this.getRecords();
  }

  openDialog(recordToUpdate) {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      width: '300px',
      panelClass: 'add-dialog',
      data: recordToUpdate
    });

    dialogRef.afterClosed().subscribe(record => {
      if (record) {
        if (record.type === 'income') {
          record.value *= -1;
        }
        record.date.setHours(23, 59, 59, 999);
        record.date = record.date.toISOString();
        record.tags = record.tags.replace(/ /g, '').split(',');
        if (recordToUpdate) {
          record._id = recordToUpdate._id;
          this.recordService.update(record).subscribe(result => {
            record._id = result.record._id;
            if (record.value < 0) {
              record.value = +record.value * -1;
              record.type = 'Income';
            } else {
              record.value = +record.value;
              record.type = 'Expense';
            }
            record.tags = record.tags.sort();
            record.date = new Date(record.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
            // this.records.push(record);
            this.dataSource.data = this.dataSource.data.map(oldRecord => {
              if (oldRecord._id === result.record._id) {
                return record;
              } else {
                return oldRecord;
              }
            });
            this.snackBar.open('Record modified successfully.', null, {
              duration: 2000,
              panelClass: ['snack-bar']
            });
          }, error => {
            this.snackBar.open('An unexpected error happened.', null, {
              duration: 2000,
              panelClass: ['snack-bar']
            });
          });
        } else {
          this.recordService.add(record).subscribe(result => {
            record._id = result.record._id;
            if (record.value < 0) {
              record.value = +record.value * -1;
              record.type = 'Income';
            } else {
              record.value = +record.value;
              record.type = 'Expense';
            }
            record.tags.sort();
            record.date = new Date(record.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
            // this.records.push(record);
            this.dataSource.data = [...this.dataSource.data, record];
            this.snackBar.open('Record added successfully.', null, {
              duration: 2000,
              panelClass: ['snack-bar']
            });
          }, error => {
            this.snackBar.open('An unexpected error happened.', null, {
              duration: 2000,
              panelClass: ['snack-bar']
            });
          });
        }
      }
    });
  }

  getRecords() {
    this.recordService.get({}).subscribe(result => {
      result.records.map(record => {
        record.date = new Date(record.date).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        record.tags.sort();
        if (record.value < 0) {
          record.value = +record.value * -1;
          record.type = 'Income';
        } else {
          record.value = +record.value;
          record.type = 'Expense';
        }
        return record;
      });
      result.records.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
      });
      this.dataSource = new MatTableDataSource(result.records);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'date': return new Date(item.date);
          default: return item[property];
        }
      };
      this.dataSource.sort = this.sort;
    }, error => {
      this.snackBar.open('An unexpected error happened while fetching your records.', null, {
        duration: 3000,
        panelClass: ['snack-bar']
      });
    });
  }

  delete(id) {
    this.recordService.delete(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(record => record._id !== id);
      this.snackBar.open('Record deleted successfully.', null, {
        duration: 2000,
        panelClass: ['snack-bar']
      });
    }, error => {
      this.snackBar.open('An unexpected error happened.', null, {
        duration: 2000,
        panelClass: ['snack-bar']
      });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

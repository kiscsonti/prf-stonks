import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MediaObserver} from '@angular/flex-layout';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  filterForm: FormGroup;
  dateNow: Date;
  @Input() tags: string[];
  @Output() filterBy = new EventEmitter();
  onMobile: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private mediaObserver: MediaObserver
  ) {
    this.dateNow = new Date();
    this.dateNow.setHours(23, 59, 59, 999);
    const oneMonthAgo = new Date();
    oneMonthAgo.setHours(0, 0, 0, 0);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    this.filterForm = this.formBuilder.group({
      fromDate: oneMonthAgo,
      toDate: this.dateNow,
      includingTags: [],
      excludingTags: []
    });
    this.onMobile = this.mediaObserver.isActive('xs');
  }

  ngOnInit(): void {
    this.onSubmit(this.filterForm.value);
  }

  get f() { return this.filterForm.controls; }

  onSubmit(filterData) {
    if (filterData.fromDate) {
      filterData.fromDate.setHours(0, 0, 0, 0);
    }
    if (filterData.toDate) {
      filterData.toDate.setHours(23, 59, 59, 999);
    }
    this.filterBy.emit(filterData);
  }


}

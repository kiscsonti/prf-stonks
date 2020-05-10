import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Record } from '../../../models/Record';
import {MediaObserver} from '@angular/flex-layout';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit {
  recordForm: FormGroup;
  error: string;
  dateNow: Date;
  onMobile: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Record,
    private formBuilder: FormBuilder,
    private mediaObserver: MediaObserver
  ) {
    this.onMobile = mediaObserver.isActive('xs');
    this.dateNow = new Date();
    this.recordForm = this.formBuilder.group({
      amount: [data ? '' + data.value : '' , [
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[0-9]*$')
      ]],
      date: [data ? new Date(data.date) : this.dateNow, [
        Validators.required
      ]],
      tags: [data ? data.tags.join(', ') : ''],
      type: data ? data.type.toLowerCase() : 'income'
    });
  }

  ngOnInit(): void {
  }

  get f() { return this.recordForm.controls; }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(record) {
    record.value = record.amount;
    this.dialogRef.close(record);
  }

}

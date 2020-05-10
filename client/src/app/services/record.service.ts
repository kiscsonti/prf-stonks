import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Record } from '../models/Record';
import { Tags } from '../models/Tags';
import { environment } from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';


export interface RecordResult {
  error: string;
  record: Record;
}

export interface RecordsResult {
  error: string;
  records: Record[];
}

export interface UploadResult {
  name: string;
  type: string;
  size: number;
  url: string;
}

interface ApiUploadResult {
  url: string;
}

interface ApiDownloadResult {
  error: string;
  csv: any;
}

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  baseUrl = environment.api;
  // baseUrl = '/api';

  constructor(
    private http: HttpClient
  ) { }

  add(record: Record) {
    return this.http.post<RecordResult>(`${this.baseUrl}/records`, record)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error);
        })
      );
  }

  get(query) {
    const params: any = {};
    if (query) {
      if (query.fromDate && query.toDate) {
        params.fromDate = query.fromDate.toISOString();
        params.toDate = query.toDate.toISOString();
      }
      if (query.includingTags) {
        params.includingTags = query.includingTags.join(',');
      }
      if (query.excludingTags) {
        params.excludingTags = query.excludingTags.join(',');
      }
    }
    return this.http.get<RecordsResult>(`${this.baseUrl}/records`, { params })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error);
        })
      );
  }

  delete(id) {
    return this.http.request('delete', `${this.baseUrl}/records`, { body: { _id: id } })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error);
        })
      );
  }

  update(record: Record) {
    return this.http.put<RecordResult>(`${this.baseUrl}/records`, record)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error);
        })
      );
  }

  tags() {
    return this.http.get<Tags>(`${this.baseUrl}/tags`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error);
        })
      );
  }

  downloadCSV(query) {
    const params: any = {};
    if (query) {
      if (query.fromDate && query.toDate) {
        params.fromDate = query.fromDate.toISOString();
        params.toDate = query.toDate.toISOString();
      }
      if (query.includingTags) {
        params.includingTags = query.includingTags.join(',');
      }
      if (query.excludingTags) {
        params.excludingTags = query.excludingTags.join(',');
      }
    }
    return this.http.get<ApiDownloadResult>(`${this.baseUrl}/csv`, { params })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error);
      })
    );
  }

  uploadCSV(csv) {
    return this.http.post<ApiUploadResult>(`${this.baseUrl}/csv`, { csv })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error);
        })
      );
  }

  replaceUploadCSV(csv) {
    return this.http.put<ApiUploadResult>(`${this.baseUrl}/csv`, { csv })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error);
        })
      );
  }
}

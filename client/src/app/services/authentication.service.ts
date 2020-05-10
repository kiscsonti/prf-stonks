import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { User } from '../models/User';
import { environment } from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl = environment.api;
  // baseUrl = '/api';

  constructor(
    private http: HttpClient
  ) { }

  register(user: User) {
    return this.http.post<User>(`${this.baseUrl}/register`, user)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error);
        })
      );
  }

  login(user: User) {
    return this.http.post<User>(`${this.baseUrl}/login`, user)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error);
        })
      );
  }

  logout() {
    return this.http.post(`${this.baseUrl}/logout`, null)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error);
        })
      );
  }

  isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    if (user && JSON.parse(user)) {
      return true;
    }
    return false;
  }

  get user(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  unsetUser() {
    localStorage.removeItem('user');
  }
}

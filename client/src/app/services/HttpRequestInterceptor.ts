import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    req = req.clone({
      withCredentials: true
    });

    return next.handle(req)
      .pipe(
        catchError(error => {
          if (error.status === 403) {
            this.authService.unsetUser();
            this.router.navigate(['']);
          }
          return throwError(error);
        })
      );
  }
}

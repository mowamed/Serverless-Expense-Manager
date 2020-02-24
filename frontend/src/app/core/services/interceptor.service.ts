import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.auth.getTokenSilently$().pipe(
      mergeMap(token => {
        let tokenReq;
        if(req.method == "PUT") {
          tokenReq = req.clone({
            setHeaders: { 'Content-Type': 'multipart/form-data' }
          });
        }
        else {
          tokenReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', }
          });
        }
        return next.handle(tokenReq);
      }),
      catchError(err => throwError(err))
    );
  }
}

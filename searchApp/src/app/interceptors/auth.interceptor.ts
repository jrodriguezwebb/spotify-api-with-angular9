import { AuthenticateService } from '../services/authenticate.service';
import { catchError, mergeMap, retryWhen } from 'rxjs/internal/operators';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { timer } from 'rxjs/internal/observable/timer';

export enum ErrorCodes {
    TokenExpired = 401,
}
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authenticateService: AuthenticateService){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('access_token');
        if (!token) {
            return next.handle(req).pipe(catchError(this.handleTokenExpired));
        }
        const headers = req.headers.set('Authorization', `Bearer ${token}`);
        return next.handle(req.clone({ headers })).pipe(
            catchError(this.handleTokenExpired),
            retryWhen(genericRetryStrategy({
              scalingDuration: 1000,
              excludedStatusCodes: [500]
            })),
          );
    }

    private handleTokenExpired = (error: HttpErrorResponse) => {
        if (error.status === ErrorCodes.TokenExpired){
            console.log('Expirated');
            const refreshToken = localStorage.getItem('refresh_token');
            localStorage.removeItem('access_token');
            this.authenticateService.refreshToken(refreshToken).subscribe((newToken: any) => {
                localStorage.setItem('access_token', newToken.access_token);
                console.log('Refreshed');
            });
        }
        return throwError(error);
    }
}

export const genericRetryStrategy = ({
    maxRetryAttempts = 1,
    scalingDuration = 1000,
    excludedStatusCodes = []
  }: {
    maxRetryAttempts?: number,
    scalingDuration?: number,
    excludedStatusCodes?: number[]
  } = {}) => (attempts: Observable<any>) => {
    return attempts.pipe(
      mergeMap((error, i) => {
        const retryAttempt = i + 1;
        if (
          retryAttempt > maxRetryAttempts ||
          excludedStatusCodes.find(e => e === error.status)
        ) {
          return throwError(error);
        }
        return timer(retryAttempt * scalingDuration);
      }),
    );
  };

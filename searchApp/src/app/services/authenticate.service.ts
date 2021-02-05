import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private http: HttpClient) { }

  authorize() {
    const scopes = 'user-read-private user-read-email';
    window.location.href = environment.authUrl + '/authorize' +
    '?response_type=' + environment.responseType  +
    '&client_id=' + environment.clientId +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(environment.redirectUri);
  }

  getToken(code: string): Observable<any> {
    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', environment.redirectUri);
    return this.tokenCall(body).pipe(tap((token: any) => {
      if (token) {
        const refreshToken = token.refresh_token;
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('access_token', token.access_token);
        localStorage.setItem('refresh_token', refreshToken);
      }
    }));
  }

  refreshToken(refreshToken: string): Observable<any> {
    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken);
    return this.tokenCall(body).pipe(tap((newToken: any) => {
      localStorage.setItem('access_token', newToken.access_token);
    }));
  }

  private tokenCall(body: HttpParams): Observable<any> {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + environment.basicToken,
      })
    };
    return this.http.post(`${environment.authUrl}/api/token`, body.toString(), headers);
  }
}

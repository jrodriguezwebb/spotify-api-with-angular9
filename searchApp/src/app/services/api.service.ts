import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = environment.url;

  constructor(
    private http: HttpClient,
  ) { }

  private setHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    return new HttpHeaders(headersConfig);
  }

  get(endpoint: string, params?: any, reqOpts: any = { params: new HttpParams()}) {

    // Support easy query params for GET requests
    if (params) {
      for (const key in params) {
        if (key && params.hasOwnProperty(key)) {
          reqOpts.params = reqOpts.params.append(key, params[key]);
        }
      }
    }
    return this.http.get<any>(this.url + endpoint, reqOpts);
  }

  post(endpoint: string, body?: any) {
    return this.http.post<any>(this.url + '/api' + endpoint, body,
      { headers: this.setHeaders() }
    );
  }
}

import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';

export class FakeAuthenticateService {

    constructor() { }

    public authorize() {
    }

    public getToken(code?: string): Observable<any> {
        return of();
    }

    public refreshToken(refreshToken: string): Observable<any> {
        return of();
    }

    public tokenCall(body: HttpParams): Observable<any> {
        return of();
    }
}

import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { mockParams, mockResponse } from '../../test-utils/test-utils';
import { of } from 'rxjs/internal/observable/of';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

describe('ApiService', () => {
  let service: ApiService;
  let httpService: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      RouterTestingModule,
      HttpClientModule,
    ]});
    service = TestBed.inject(ApiService);
    httpService = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    beforeEach(() => {
      spyOn(httpService, 'get').and.returnValue(of(mockResponse));
    });

    it('should call the http.get method without params', () => {
      service.get('/endpoint').subscribe((response: any) => {
        expect(response).toBe(mockResponse);
      });
    });

    it('should call the http.get method with params', () => {
      const reqOpts: any = { params: new HttpParams()};
      for (const key in mockParams) {
        if (key && mockParams.hasOwnProperty(key)) {
          reqOpts.params = reqOpts.params.append(key, mockParams[key]);
        }
      }
      service.get('/endpoint', mockParams).subscribe((response: any) => {
        expect(response).toBe(mockResponse);
      });
      expect(httpService.get).toHaveBeenCalledWith(environment.url + '/endpoint', reqOpts);
    });
  });

  describe('post', () => {
    beforeEach(() => {
      spyOn(httpService, 'post').and.returnValue(of(mockResponse));
    });

    it('should call the http.post method', () => {
      service.post('/endpoint', mockParams).subscribe((response: any) => {
        expect(response).toBe(mockResponse);
      });
      expect(httpService.post).toHaveBeenCalled();
    });
  });
});

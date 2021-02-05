import { AuthenticateService } from './authenticate.service';
import { environment } from '../../environments/environment';
import { FakeAuthenticateService } from '../../test-utils/fake-auth.service';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { mockResponse } from '../../test-utils/test-utils';
import { of } from 'rxjs/internal/observable/of';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';


describe('AuthenticateService', () => {
  let service: FakeAuthenticateService;
  let httpService: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
      ],
    });
    service = TestBed.inject(AuthenticateService) as unknown as FakeAuthenticateService;
    httpService = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getToken', () => {
    it('should be called with params', () => {
      spyOn(service, 'tokenCall').and.returnValue(of(mockResponse));
      const code = '123';
      const body = new HttpParams()
        .set('grant_type', 'authorization_code')
        .set('code', code)
        .set('redirect_uri', environment.redirectUri);
      service.getToken(code).subscribe();
      expect(service.tokenCall).toHaveBeenCalledWith(body);
    });
  });

  describe('refreshToken', () => {
    it('should be called with params', () => {
      spyOn(service, 'tokenCall').and.returnValue(of(mockResponse));
      const refreshToken = '123';
      const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken);
      service.refreshToken(refreshToken).subscribe();
      expect(service.tokenCall).toHaveBeenCalledWith(body);
    });
  });

  describe('tokenCall', () => {
    it('should be called', () => {
      spyOn(httpService, 'post').and.returnValue(of(mockResponse));
      const refreshToken = '123';
      service.refreshToken(refreshToken).subscribe();
      expect(httpService.post).toHaveBeenCalled();
    });
  });
});

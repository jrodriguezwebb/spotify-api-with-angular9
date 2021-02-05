import { HttpClientModule } from '@angular/common/http';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/internal/observable/of';
import { searchMock } from '../test-utils/search.mock';
import { mockAlbumByArtists, mockArtistInfo, mockToken, mockTracks } from '../test-utils/test-utils';
import { AppComponent } from './app.component';
import { AuthenticateService } from './services/authenticate.service';
import { SpotifyService } from './services/spotify.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authenticateService: AuthenticateService;
  let spotifyService: SpotifyService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        AuthenticateService,
        SpotifyService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authenticateService = TestBed.inject(AuthenticateService);
    spotifyService = TestBed.inject(SpotifyService);
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should handle redirection if code is present', () => {
      spyOn(component, 'getParamValueQueryString').and.returnValue('dacode');
      spyOn(authenticateService, 'getToken').and.returnValue(of(mockToken));
      component.ngOnInit();
      expect(authenticateService.getToken).toHaveBeenCalled();
    });
  });

  describe('doLogin', () => {
    it('should call authorize method', () => {
      spyOn(authenticateService, 'authorize');
      component.doLogin();
      expect(authenticateService.authorize).toHaveBeenCalled();
    });
  });

  describe('getParamValueQueryString', () => {
    it('should get first parameter', () => {
      const q = 'q';
      const value = 'hello';
      window.history.replaceState({}, document.title, window.location.href + `?${q}=${value}`);
      const paramValue = component.getParamValueQueryString(q);
      window.history.replaceState({}, document.title, window.location.href);
      expect(paramValue).toBe(value);
    });
  });

  describe('handleItemSelection', () => {
    it('should handle selection if it is an artist', () => {
      spyOn(spotifyService, 'getAlbumsByArtist').and.returnValue(of(mockAlbumByArtists) as any);
      const item = { itemSelected: { ...mockArtistInfo, type: 'artist' }, results: searchMock};
      component.handleItemSelection(item);
      expect(component.albumsInfo).toBeDefined();
      expect(component.tracksInfo.length).toBeGreaterThan(0);
    });

    it('should handle selection if it is a track', () => {
      spyOn(spotifyService, 'getArtistInfo').and.returnValue(of(mockArtistInfo) as any);
      spyOn(spotifyService, 'getAlbumsByArtist').and.returnValue(of(mockAlbumByArtists) as any);
      const item = { itemSelected: { tracks: mockTracks.items, artists: [mockArtistInfo],  type: 'track' }, results: searchMock};
      component.handleItemSelection(item);
      expect(spotifyService.getArtistInfo).toHaveBeenCalled();
      expect(spotifyService.getAlbumsByArtist).toHaveBeenCalled();
    });

    it('should handle selection if it is an album', () => {
      spyOn(spotifyService, 'getArtistInfo').and.returnValue(of(mockArtistInfo) as any);
      spyOn(spotifyService, 'getAlbumTracks').and.returnValue(of(mockTracks.items) as any);
      const item = {
        itemSelected: {
          ...mockAlbumByArtists.items[0],
          tracks: mockTracks.items,
          artists: [mockArtistInfo],
          type: 'album',
        },
        results: searchMock,
      };
      component.handleItemSelection(item);
      expect(spotifyService.getArtistInfo).toHaveBeenCalled();
      expect(spotifyService.getAlbumTracks).toHaveBeenCalled();
    });
  });
});

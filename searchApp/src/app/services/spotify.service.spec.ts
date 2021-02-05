import { Album } from '../../models/album.model';
import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';
import { mockAlbumByArtists, mockArtistInfo, mockTracks } from '../../test-utils/test-utils';
import { of } from 'rxjs/internal/observable/of';
import { RouterTestingModule } from '@angular/router/testing';
import { searchMock } from '../../test-utils/search.mock';
import { SearchResults } from '../../models/search.model';
import { SpotifyService } from './spotify.service';
import { TestBed } from '@angular/core/testing';
import { Track } from '../../models/track.model';

describe('SpotifyService', () => {
  let service: SpotifyService;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
      ],
      providers: [
        ApiService,
      ]
    });
    service = TestBed.inject(SpotifyService);
    apiService = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAlbumsByArtist', () => {
    it('should get albums filtered by artists', () => {
      const mapedAlbumResponse: Album[] = mockAlbumByArtists.items.map((item: any) => {
        return {
          name: item.name,
          images: item.images,
          release_date: item.release_date,
        };
      });
      spyOn(apiService, 'get').and.returnValue(of(mockAlbumByArtists) as any);
      service.getAlbumsByArtist('123').subscribe(response => {
        expect(response).toEqual(mapedAlbumResponse);
      });
    });
  });

  describe('getAlbumTracks', () => {
    it('should get Track from Album', () => {
      const mapedTrackResponse: Track[] = mockTracks.items.map((trackItem: any) => {
        return {
          ...trackItem,
          artists: trackItem.artists.map(artist => artist.name)
        };
      });
      spyOn(apiService, 'get').and.returnValue(of(mockTracks) as any);
      service.getAlbumTracks('123').subscribe(response => {
        expect(response).toEqual(mapedTrackResponse);
      });
    });
  });

  describe('getArtistInfo', () => {
    it('should get artist info', () => {
      const mapedArtistResponse = {
        followers: mockArtistInfo.followers.total,
        name: mockArtistInfo.name,
        image: mockArtistInfo.images[0].url
      };
      spyOn(apiService, 'get').and.returnValue(of(mockArtistInfo) as any);
      service.getArtistInfo('123').subscribe(response => {
        expect(JSON.stringify(response)).toBe(JSON.stringify(mapedArtistResponse));
      });
    });
  });

  describe('search', () => {
    it('should results', () => {
      const result: SearchResults = {
        results: searchMock,
        tracks: searchMock.tracks.items.slice(0, 4),
        albums: searchMock.albums.items.slice(0, 4),
        artists: searchMock.artists.items.map(item => {
          return {
            followers: item.followers.total,
            name: item.name,
            image: item.images.length ? item.images[0].url : null
          };
        }).slice(0, 4),
      };
      const params = {
        q: 'Linkin Park',
        type: 'artist,track,album',
      };
      spyOn(apiService, 'get').and.returnValue(of(searchMock) as any);
      service.search(params, 'all').subscribe();
      expect(apiService.get).toHaveBeenCalled();
    });
  });
});

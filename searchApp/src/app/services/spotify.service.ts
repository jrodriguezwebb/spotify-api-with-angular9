import { Album } from '../../models/album.model';
import { ApiService } from './api.service';
import { Artist } from '../../models/artist.model';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';
import { SearchParams, SearchResults } from '../../models/search.model';
import { Track } from '../../models/track.model';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private apiService: ApiService) { }

  public getAlbumsByArtist(artistId: string): Observable<Album[]>  {
    return this.apiService.get(`/artists/${artistId}/albums`).pipe(map((albums: any) => {
        return albums.items.map((item: any) => { return {
          name: item.name,
          images: item.images,
          release_date: item.release_date,
        };
      });
    }));
  }

  public getAlbumTracks(albumId: string): Observable<Track[]> {
    return this.apiService.get(`/albums/${albumId}/tracks`).pipe(map((tracks: any) => {
      return tracks.items.map((trackItem: any) => {
        return {
          ...trackItem,
          artists: trackItem.artists.map(artist => artist.name)
        };
      });
    }));
  }

  public getArtistInfo(artistId: string): Observable<Artist>  {
    return this.apiService.get(`/artists/${artistId}`).pipe(map((artist: any) => {
      return {
        followers: artist.followers.total,
        name: artist.name,
        image: artist.images[0].url
      };
    }));
  }

  public search(params: SearchParams, type: string): Observable<SearchResults> {
    return this.apiService.get('/search', params).pipe(map((response: any) => {
      const result: SearchResults = {
        results: response,
        tracks: [],
        albums: [],
        artists: [],
      };
      if (response.tracks && (type === 'track' || type === 'all' )) {
        result.tracks = response.tracks.items.slice(0, type === 'all' ? 4 : undefined);
      }
      if (response.albums && (type === 'album' || type === 'all' )) {
        result.albums =  response.albums.items.filter((item: any) => item.album_type === 'album').slice(0, type === 'all' ? 4 : undefined);
      }
      if (response.artists && (type === 'artist' || type === 'all' )) {
        result.artists = response.artists.items.slice(0, type === 'all' ? 4 : undefined);
      }
      return result;
    }));
  }
}

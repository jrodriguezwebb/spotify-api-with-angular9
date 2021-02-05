import { Album } from '../models/album.model';
import { Artist } from '../models/artist.model';
import { AuthenticateService } from './services/authenticate.service';
import { Component, OnInit } from '@angular/core';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { HttpParams } from '@angular/common/http';
import { interval } from 'rxjs';
import { SpotifyService } from './services/spotify.service';
import { Track } from '../models/track.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isAuthenticated = false;
  public faMusic = faMusic;
  public artistInfo: Artist;
  public albumsInfo: Album[];
  public tracksInfo: Track[];

  constructor(private authenticateService: AuthenticateService,
              private spotifyService: SpotifyService) {
  }

  ngOnInit() {
    this.isAuthenticated = localStorage.getItem('access_token') ? true : false;
    this.handleLoginRedirection();
  }

  public doLogin() {
    this.authenticateService.authorize();
  }

  handleItemSelection(item: any) {
    const selectedItem = item.itemSelected;
    switch (selectedItem.type) {
      case 'artist':
        this.handleArtistSelection(selectedItem, item.results);
        break;
      case 'track':
        this.handleTrackSelection(selectedItem);
        break;
      case 'album':
        this.handleAlbumSelection(selectedItem);
        break;
    }
  }

  private handleArtistSelection(selectedItem: any, results: any) {
    const artistId = selectedItem.id;
    this.artistInfo = {
      followers: selectedItem.followers.total,
      name: selectedItem.name,
      image: selectedItem.images[0].url
    };

    this.getAlbumsByArtist(artistId);

    if (results.tracks) {
      this.tracksInfo = [...results.tracks.items.map((trackItem: Track) => {
        return {
          ...trackItem,
          artists: trackItem.artists.map((artist: any) => artist.name)
        };
      })];
    }
  }

  private handleTrackSelection(selectedItem: any) {
    const artistId = selectedItem.artists[0].id;
    this.tracksInfo = [{
      name: selectedItem.name,
      artists: selectedItem.artists.map(artist => artist.name)
    }];
    this.getArtistInfo(artistId);
    this.getAlbumsByArtist(artistId);
  }

  private handleAlbumSelection(selectedItem: any) {
    const artistId = selectedItem.artists[0].id;
    const albumId = selectedItem.id;
    this.albumsInfo = [selectedItem];
    this.getArtistInfo(artistId);
    this.getAlbumTracks(albumId);
  }

  private getArtistInfo(artistId: string) {
    this.spotifyService.getArtistInfo(artistId).subscribe(artist => {
      this.artistInfo = artist;
    });
  }

  private getAlbumsByArtist(artistId: string) {
    this.spotifyService.getAlbumsByArtist(artistId).subscribe(albums => {
      this.albumsInfo = albums;
    });
  }

  private getAlbumTracks(albumId: string) {
    this.spotifyService.getAlbumTracks(albumId).subscribe(tracks => {
      this.tracksInfo = tracks;
    });
  }

  private handleLoginRedirection() {
    const code = this.getParamValueQueryString('code');
    if (code) {
      window.history.replaceState({}, document.title, window.location.href.split('?')[0]);
      this.authenticateService.getToken(code).subscribe(token => {
        if (token) {
          this.isAuthenticated = true;
          interval((token.expires_in - 120) * 1000).subscribe(() => {
            localStorage.removeItem('access_token');
            this.authenticateService.refreshToken(token.refresh_token).subscribe();
          });
        }
      });
    }
  }

  public getParamValueQueryString(paramName: string): string {
    const url = window.location.href;
    let paramValue: string;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get(paramName);
    }
    return paramValue;
  }
}

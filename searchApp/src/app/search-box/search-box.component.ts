import { Album } from '../../models/album.model';
import { Artist } from '../../models/artist.model';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
  } from '@angular/core';
import { debounce } from 'rxjs/internal/operators/debounce';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { faGrinStars } from '@fortawesome/free-solid-svg-icons';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SearchResults } from '../../models/search.model';
import { SpotifyService } from '../services/spotify.service';
import { Subscription } from 'rxjs';
import { timer } from 'rxjs/internal/observable/timer';
import { Track } from '../../models/track.model';
@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  public faMusic = faMusic;
  public faCompactDisc = faCompactDisc;
  public faGrinStars = faGrinStars;
  public results: SearchResults;
  public artists: Artist[] = [];
  public albums: Album[] = [];
  public tracks: Track[] = [];
  public types: string[] = ['all', 'artist', 'track', 'album'];
  public itemSelected: any;
  @Output()
  public itemSelectedEvent = new EventEmitter<any>();
  public form: FormGroup;
  public showListFlag = false;
  private subscriptions: Subscription[] = [];

  constructor(private spotifyService: SpotifyService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      q: new FormControl(''),
      type: new FormControl('all'),
    });
    this.subscriptions[0] = this.form.get('q').valueChanges.pipe(debounce(() => timer(400))).subscribe((value) => {
      this.getResults(value);
    });
  }

  closeList(q?) {
    if (this.showListFlag) {
      this.showListFlag = false;
    } else if (q) {
      this.getResults(q);
    }
  }

  getResults(value: string) {
    if (value) {
      this.cleanResults();
      const type = this.form.get('type').value;
      const params = {
        q: value,
        type: 'artist,track,album',
      };
      this.subscriptions[1] = this.spotifyService.search(params, type).subscribe(result => {
        this.results = result;
        this.showList();
      });
    } else {
      this.cleanResults();
      this.hideList();
    }
  }

  selectItem(item: any) {
    const type = this.form.get('type').value;
    this.form.get('q').setValue(null);
    this.itemSelected = item;
    this.itemSelectedEvent.emit({ itemSelected: this.itemSelected, results: this.results.results, type });
    this.cleanResults();
    this.hideList();
  }

  hideList() {
    this.showListFlag = false;
  }

  showList() {
    this.showListFlag = true;
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => {
        subscription.unsubscribe();
      });
    }
  }

  private cleanResults() {
    this.results = null;
    this.artists = [];
    this.albums = [];
    this.tracks = [];
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Artist } from '../../models/artist.model';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit {

  public faThumbsUp = faThumbsUp;
  @Input()
  artistInfo: Artist;

  constructor() { }

  ngOnInit(): void {}

}

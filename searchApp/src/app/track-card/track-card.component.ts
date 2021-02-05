import { Component, Input, OnInit } from '@angular/core';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { Track } from '../../models/track.model';

@Component({
  selector: 'app-track-card',
  templateUrl: './track-card.component.html',
  styleUrls: ['./track-card.component.scss']
})
export class TrackCardComponent implements OnInit {

  @Input()
  public track: Track;
  public faMusic = faMusic;
  constructor() { }

  ngOnInit(): void {
  }

}

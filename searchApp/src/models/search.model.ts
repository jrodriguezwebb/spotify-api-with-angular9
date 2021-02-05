import { Album } from './album.model';
import { Artist } from './artist.model';
import { Track } from './track.model';

export interface SearchResults {
    tracks: Track[];
    artists: Artist[];
    albums: Album[];
    results: any;
}

export interface SearchParams {
    q: string;
    type: string;
}

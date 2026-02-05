import { Artist } from './artist.model';

export interface AlbumCover {
  id: string;
  name: string;
  url: string;
  mimeType: string;
}

export interface Album {
  id: string;
  title: string;
  releasedAt: string;
  artists: Artist[];
  covers?: AlbumCover[];
}

export interface AlbumFilter {
  title?: string;
  artistId?: string;
}

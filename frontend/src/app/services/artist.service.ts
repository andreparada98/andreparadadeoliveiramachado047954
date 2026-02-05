import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Artist, ArtistFilter, PageResponse } from '../shared/models/artist.model';
import { Album } from '../shared/models/album.model';
import { environment } from '../../environments/environment';

export interface ArtistRequest {
  name: string;
  description?: string;
  albumIds?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/artist`;

  getArtists(filter: ArtistFilter = {}, page: number = 0, size: number = 12, sort: string = 'name,asc'): Observable<PageResponse<Artist>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    if (filter.name) {
      params = params.set('name', filter.name);
    }

    return this.http.get<PageResponse<Artist>>(this.apiUrl, { params });
  }

  getArtistAlbums(artistId: string, page: number = 0, size: number = 12): Observable<PageResponse<Album>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Album>>(`${this.apiUrl}/${artistId}/albums`, { params });
  }

  getArtistById(id: string): Observable<Artist> {
    return this.http.get<Artist>(`${this.apiUrl}/${id}`);
  }

  createArtist(artist: ArtistRequest): Observable<Artist> {
    return this.http.post<Artist>(this.apiUrl, artist);
  }

  updateArtist(id: string, artist: ArtistRequest): Observable<Artist> {
    return this.http.put<Artist>(`${this.apiUrl}/${id}`, artist);
  }
}


import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Album, AlbumFilter } from '../shared/models/album.model';
import { PageResponse } from '../shared/models/artist.model';

export interface AlbumRequest {
  title: string;
  releasedAt: string;
  artistIds: string[];
  fileId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/album`;

  getAlbums(filter: AlbumFilter = {}, page: number = 0, size: number = 12): Observable<PageResponse<Album>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filter.title) {
      params = params.set('title', filter.title);
    }

    if (filter.artistId) {
      params = params.set('artistId', filter.artistId);
    }

    return this.http.get<PageResponse<Album>>(this.apiUrl, { params });
  }

  getAlbumById(id: string): Observable<Album> {
    return this.http.get<Album>(`${this.apiUrl}/${id}`);
  }

  createAlbum(album: AlbumRequest): Observable<Album> {
    return this.http.post<Album>(this.apiUrl, album);
  }

  updateAlbum(id: string, album: AlbumRequest): Observable<Album> {
    return this.http.put<Album>(`${this.apiUrl}/${id}`, album);
  }
}

import { inject, Injectable, signal } from '@angular/core';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { ArtistService, ArtistRequest } from '../../services/artist.service';
import { Artist, PageResponse } from '../models/artist.model';
import { Album } from '../models/album.model';
import { BaseComponent } from '../helpers/base-component';

@Injectable({
  providedIn: 'root'
})
export class ArtistFacade extends BaseComponent {
  private artistService = inject(ArtistService);

  artists = signal<Artist[]>([]);
  totalElements = signal(0);
  totalPages = signal(0);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  selectedArtist = signal<Artist | null>(null);
  artistAlbums = signal<Album[]>([]);
  isLoadingAlbums = signal(false);

  getArtists(query: string = '', page: number = 0, size: number = 10, sort: string = 'name,asc'): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.artistService.getArtists({ name: query }, page, size, sort)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.artists.set(response.content);
          this.totalElements.set(response.page.totalElements);
          this.totalPages.set(response.page.totalPages);
        },
        error: (err) => {
          console.error('ArtistFacade: Error fetching artists:', err);
          this.errorMessage.set('Erro ao carregar artistas.');
        }
      });
  }

  loadArtistById(id: string, callback?: (artist: Artist) => void): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.artistService.getArtistById(id)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (artist) => {
          this.selectedArtist.set(artist);
          if (callback) callback(artist);
        },
        error: (err) => {
          console.error(`ArtistFacade: Error fetching artist ${id}:`, err);
          this.errorMessage.set('Erro ao carregar detalhes do artista.');
        }
      });
  }

  loadArtistAlbums(artistId: string, callback?: (albums: Album[]) => void): void {
    this.isLoadingAlbums.set(true);
    this.artistService.getArtistAlbums(artistId)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.isLoadingAlbums.set(false))
      )
      .subscribe({
        next: (response) => {
          this.artistAlbums.set(response.content);
          if (callback) callback(response.content);
        },
        error: (err) => {
          console.error(`ArtistFacade: Error fetching albums for artist ${artistId}:`, err);
          this.errorMessage.set('Erro ao carregar álbuns do artista.');
        }
      });
  }

  createArtist(artist: ArtistRequest, onSuccess?: () => void): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.artistService.createArtist(artist)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          if (onSuccess) onSuccess();
        },
        error: (err) => {
          console.error('ArtistFacade: Error creating artist:', err);
          this.errorMessage.set('Erro ao criar artista. Verifique os dados.');
        }
      });
  }

  updateArtist(id: string, artist: ArtistRequest, onSuccess?: () => void): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.artistService.updateArtist(id, artist)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          if (onSuccess) onSuccess();
        },
        error: (err) => {
          console.error(`ArtistFacade: Error updating artist ${id}:`, err);
          this.errorMessage.set('Erro ao atualizar artista.');
        }
      });
  }
}

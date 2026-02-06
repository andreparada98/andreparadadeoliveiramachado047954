import { inject, Injectable, signal } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { AlbumService, AlbumRequest } from '../../services/album.service';
import { Album } from '../models/album.model';
import { BaseComponent } from '../helpers/base-component';

@Injectable({
  providedIn: 'root'
})
export class AlbumFacade extends BaseComponent {
  private albumService = inject(AlbumService);

  // Estados gerenciados pela Facade
  albums = signal<Album[]>([]);
  totalElements = signal(0);
  totalPages = signal(0);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  selectedAlbum = signal<Album | null>(null);

  getAlbums(query: string = '', page: number = 0, size: number = 10): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.albumService.getAlbums({ title: query }, page, size)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.albums.set(response.content);
          this.totalElements.set(response.page.totalElements);
          this.totalPages.set(response.page.totalPages);
        },
        error: (err) => {
          console.error('AlbumFacade: Error fetching albums:', err);
          this.errorMessage.set('Erro ao carregar álbuns.');
        }
      });
  }

  loadAlbumById(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.albumService.getAlbumById(id)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (album) => this.selectedAlbum.set(album),
        error: (err) => {
          console.error(`AlbumFacade: Error fetching album ${id}:`, err);
          this.errorMessage.set('Erro ao carregar detalhes do álbum.');
        }
      });
  }

  createAlbum(album: AlbumRequest, onSuccess?: () => void): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.albumService.createAlbum(album)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          if (onSuccess) onSuccess();
        },
        error: (err) => {
          console.error('AlbumFacade: Error creating album:', err);
          this.errorMessage.set('Erro ao criar álbum. Verifique os dados.');
        }
      });
  }

  updateAlbum(id: string, album: AlbumRequest, onSuccess?: () => void): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.albumService.updateAlbum(id, album)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          if (onSuccess) onSuccess();
        },
        error: (err) => {
          console.error(`AlbumFacade: Error updating album ${id}:`, err);
          this.errorMessage.set('Erro ao atualizar álbum.');
        }
      });
  }
}

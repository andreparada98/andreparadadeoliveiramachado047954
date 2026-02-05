import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, map, catchError, takeUntil } from 'rxjs/operators';

import { AlbumService } from '../../services/album.service';
import { Album } from '../../shared/models/album.model';
import { BaseComponent } from '../../shared/helpers/base-component';
import { AlbumCardComponent } from '../../shared/components/album-card/album-card';
import { XInputComponent } from '../../shared/components/x-input/x-input';
import { XButtonComponent } from '../../shared/components/x-button/x-button';
import { XPaginationComponent } from '../../shared/components/x-pagination/x-pagination';
import { PageResponse } from '../../shared/models/artist.model';

@Component({
  selector: 'app-album-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    AlbumCardComponent, 
    XInputComponent, 
    XButtonComponent, 
    XPaginationComponent
  ],
  templateUrl: './album-list.html',
  styleUrl: './album-list.scss'
})
export class AlbumListComponent extends BaseComponent {
  private albumService = inject(AlbumService);
  private router = inject(Router);

  searchQuery = signal('');
  currentPage = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);
  totalPages = signal(0);
  isLoading = signal(false);

  albums = toSignal(
    combineLatest([
      toObservable(this.searchQuery).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.currentPage.set(0))
      ),
      toObservable(this.currentPage),
      toObservable(this.pageSize).pipe(tap(() => this.currentPage.set(0)))
    ]).pipe(
      takeUntil(this.unsubscribe),
      tap(() => this.isLoading.set(true)),
      switchMap(([query, page, size]) => 
        this.albumService.getAlbums({ title: query }, page, size).pipe(
          catchError(err => {
            console.error('Error fetching albums:', err);
            return of({ content: [], page: { totalElements: 0, totalPages: 0, size: 0, number: 0 } } as PageResponse<Album>);
          })
        )
      ),
      tap((response) => {
        this.totalElements.set(response.page.totalElements);
        this.totalPages.set(response.page.totalPages);
        this.isLoading.set(false);
      }),
      map(response => response.content)
    ),
    { initialValue: [] as Album[] }
  );

  onAddAlbum() {
    this.router.navigate(['/album/new']);
  }

  onViewAlbum(album: Album) {
    this.router.navigate(['/album', album.id]);
  }

  onEditAlbum(album: Album) {
    this.router.navigate(['/album', album.id, 'edit']);
  }

  onPageChange(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}


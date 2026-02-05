import { Component, inject, signal } from '@angular/core';
import { ArtistCardComponent } from '../../shared/components/artist-card/artist-card';
import { XButtonComponent } from '../../shared/components/x-button/x-button';
import { XPaginationComponent } from '../../shared/components/x-pagination/x-pagination';
import { XInputComponent } from '../../shared/components/x-input/x-input';
import { FormsModule } from '@angular/forms';
import { ArtistService } from '../../services/artist.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError, map, takeUntil } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { Artist } from '../../shared/models/artist.model';
import { Album } from '../../shared/models/album.model';
import { BaseComponent } from '../../shared/helpers/base-component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageResponse } from '../../shared/models/artist.model';

@Component({
  selector: 'XHome',
  standalone: true,
  imports: [ArtistCardComponent, XButtonComponent, XPaginationComponent, XInputComponent, FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent extends BaseComponent {
  private artistService = inject(ArtistService);
  private router = inject(Router);
  
  searchQuery = signal('');
  sortOrder = signal<'asc' | 'desc'>('asc');
  currentPage = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);
  totalPages = signal(0);
  isLoading = signal(false);
  selectedArtist = signal<Artist | null>(null);
  isLoadingAlbums = signal(false);

  artists = toSignal(
    combineLatest([
      toObservable(this.searchQuery).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.currentPage.set(0))
      ),
      toObservable(this.sortOrder).pipe(tap(() => this.currentPage.set(0))),
      toObservable(this.currentPage),
      toObservable(this.pageSize).pipe(tap(() => this.currentPage.set(0)))
    ]).pipe(
      takeUntil(this.unsubscribe),
      tap(() => {
        this.isLoading.set(true);
        this.selectedArtist.set(null);
      }),
      switchMap(([query, order, page, size]) => 
        this.artistService.getArtists({ name: query }, page, size, `name,${order}`).pipe(
          catchError(err => {
            console.error('Error fetching artists:', err);
            return of({ content: [], page: { totalElements: 0, totalPages: 0, size: 0, number: 0 } } as PageResponse<Artist>);
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
    { initialValue: [] as Artist[] }
  );

  albums = toSignal(
    toObservable(this.selectedArtist).pipe(
      takeUntil(this.unsubscribe),
      tap((artist) => {
        if (artist) this.isLoadingAlbums.set(true);
      }),
      switchMap(artist => {
        if (!artist) return of({ content: [], page: { totalElements: 0, totalPages: 0, size: 0, number: 0 } } as PageResponse<Album>);
        return this.artistService.getArtistAlbums(artist.id).pipe(
          catchError(err => {
            console.error('Error fetching albums:', err);
            return of({ content: [], page: { totalElements: 0, totalPages: 0, size: 0, number: 0 } } as PageResponse<Album>);
          })
        );
      }),
      tap(() => this.isLoadingAlbums.set(false)),
      map(response => response.content as Album[])
    ),
    { initialValue: [] as Album[] }
  );

  onArtistClick(artist: Artist) {
    if (this.selectedArtist()?.id === artist.id) {
      this.selectedArtist.set(null);
    } else {
      this.selectedArtist.set(artist);
    }
  }

  onViewArtist(artist: Artist) {
    this.router.navigate(['/artist', artist.id]);
  }

  onEditArtist(artist: Artist) {
    this.router.navigate(['/artist', artist.id, 'edit']);
  }

  onAddArtist() {
    this.router.navigate(['/artist/new']);
  }

  onAddAlbum() {
    this.router.navigate(['/album/new']);
  }

  onSort() {
    this.sortOrder.update(current => current === 'asc' ? 'desc' : 'asc');
  }

  onPageChange(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

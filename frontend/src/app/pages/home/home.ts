import { Component, inject, signal } from '@angular/core';
import { ArtistCardComponent } from '../../shared/components/artist-card/artist-card';
import { XButtonComponent } from '../../shared/components/x-button/x-button';
import { XPaginationComponent } from '../../shared/components/x-pagination/x-pagination';
import { XInputComponent } from '../../shared/components/x-input/x-input';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, tap, map, takeUntil } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { Artist } from '../../shared/models/artist.model';
import { Album } from '../../shared/models/album.model';
import { BaseComponent } from '../../shared/helpers/base-component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ArtistFacade } from '../../shared/facades/artist.facade';

@Component({
  selector: 'XHome',
  standalone: true,
  imports: [ArtistCardComponent, XButtonComponent, XPaginationComponent, XInputComponent, FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent extends BaseComponent {
  readonly artistFacade = inject(ArtistFacade);
  private router = inject(Router);
  
  searchQuery = signal('');
  sortOrder = signal<'asc' | 'desc'>('asc');
  currentPage = signal(0);
  pageSize = signal(10);
  selectedArtist = signal<Artist | null>(null);

  constructor() {
    super();
    combineLatest([
      toObservable(this.searchQuery).pipe(debounceTime(300), distinctUntilChanged()),
      toObservable(this.sortOrder),
      toObservable(this.currentPage),
      toObservable(this.pageSize)
    ]).pipe(takeUntil(this.unsubscribe))
    .subscribe(([query, order, page, size]) => {
      this.artistFacade.getArtists(query, page, size, `name,${order}`);
      this.selectedArtist.set(null);
    });

    toObservable(this.selectedArtist)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(artist => {
        if (artist) {
          this.artistFacade.loadArtistAlbums(artist.id);
        }
      });
  }

  onArtistClick(artist: Artist) {
    this.selectedArtist.update(current => current?.id === artist.id ? null : artist);
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
    this.currentPage.set(0);
  }

  onPageChange(page: number) {
    if (page >= 0 && page < this.artistFacade.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

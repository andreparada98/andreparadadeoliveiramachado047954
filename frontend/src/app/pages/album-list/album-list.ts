import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { Album } from '../../shared/models/album.model';
import { BaseComponent } from '../../shared/helpers/base-component';
import { AlbumCardComponent } from '../../shared/components/album-card/album-card';
import { XInputComponent } from '../../shared/components/x-input/x-input';
import { XButtonComponent } from '../../shared/components/x-button/x-button';
import { XPaginationComponent } from '../../shared/components/x-pagination/x-pagination';
import { AlbumFacade } from '../../shared/facades/album.facade';

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
  readonly albumFacade = inject(AlbumFacade);
  private router = inject(Router);

  searchQuery = signal('');
  currentPage = signal(0);
  pageSize = signal(10);

  constructor() {
    super();
    combineLatest([
      toObservable(this.searchQuery).pipe(debounceTime(300), distinctUntilChanged()),
      toObservable(this.currentPage),
      toObservable(this.pageSize)
    ]).pipe(takeUntil(this.unsubscribe))
    .subscribe(([query, page, size]) => {
      this.albumFacade.getAlbums(query, page, size);
    });
  }

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
    if (page >= 0 && page < this.albumFacade.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

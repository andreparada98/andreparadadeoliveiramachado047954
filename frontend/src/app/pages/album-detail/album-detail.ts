import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Album } from '../../shared/models/album.model';
import { XButtonComponent } from '../../shared/components/x-button/x-button';
import { AlbumFacade } from '../../shared/facades/album.facade';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, XButtonComponent],
  templateUrl: './album-detail.html',
  styleUrl: './album-detail.scss'
})
export class AlbumDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  readonly albumFacade = inject(AlbumFacade);
  private router = inject(Router);

  albumId = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.albumId.set(id);
        this.albumFacade.loadAlbumById(id);
      }
    });
  }

  onBack() {
    this.router.navigate(['/albums']);
  }

  onEdit() {
    const album = this.albumFacade.selectedAlbum();
    if (album) {
      this.router.navigate(['/album', album.id, 'edit']);
    }
  }

  onViewArtist(artistId: string) {
    this.router.navigate(['/artist', artistId]);
  }
}



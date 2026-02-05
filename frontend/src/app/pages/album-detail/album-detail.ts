import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AlbumService } from '../../services/album.service';
import { Album } from '../../shared/models/album.model';
import { XButtonComponent } from '../../shared/components/x-button/x-button';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, XButtonComponent],
  templateUrl: './album-detail.html',
  styleUrl: './album-detail.scss'
})
export class AlbumDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private albumService = inject(AlbumService);
  private router = inject(Router);

  albumId = signal<string | null>(null);
  album = signal<Album | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.albumId.set(id);
        this.loadAlbum(id);
      }
    });
  }

  loadAlbum(id: string) {
    this.isLoading.set(true);
    this.albumService.getAlbumById(id).subscribe({
      next: (data) => {
        this.album.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading album:', err);
        this.isLoading.set(false);
      }
    });
  }

  onBack() {
    this.router.navigate(['/albums']);
  }

  onEdit() {
    if (this.album()) {
      this.router.navigate(['/album', this.album()!.id, 'edit']);
    }
  }

  onViewArtist(artistId: string) {
    this.router.navigate(['/artist', artistId]);
  }
}



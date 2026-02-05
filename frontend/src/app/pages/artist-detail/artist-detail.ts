import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { Artist } from '../../shared/models/artist.model';
import { Album } from '../../shared/models/album.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './artist-detail.html',
  styleUrl: './artist-detail.scss'
})
export class ArtistDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private artistService = inject(ArtistService);

  artistId = signal<string | null>(null);
  artist = signal<Artist | null>(null);
  isLoading = signal(true);
  isLoadingAlbums = signal(true);

  albums = signal<Album[]>([]);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.artistId.set(id);
        this.loadArtist(id);
        this.loadAlbums(id);
      }
    });
  }

  loadArtist(id: string) {
    this.isLoading.set(true);
    this.artistService.getArtistById(id).subscribe({
      next: (data) => {
        this.artist.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading artist:', err);
        this.isLoading.set(false);
      }
    });
  }

  loadAlbums(id: string) {
    this.isLoadingAlbums.set(true);
    this.artistService.getArtistAlbums(id).subscribe({
      next: (response) => {
        this.albums.set(response.content);
        this.isLoadingAlbums.set(false);
      },
      error: (err) => {
        console.error('Error loading albums:', err);
        this.isLoadingAlbums.set(false);
      }
    });
  }
}


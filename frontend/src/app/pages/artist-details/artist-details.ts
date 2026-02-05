import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArtistService } from '../../services/artist.service';
import { Artist } from '../../shared/models/artist.model';
import { Album } from '../../shared/models/album.model';
import { catchError, map, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-artist-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './artist-details.html',
  styleUrl: './artist-details.scss'
})
export class ArtistDetailsComponent {
  private route = inject(ActivatedRoute);
  private artistService = inject(ArtistService);

  artistId = toSignal(this.route.params.pipe(map(p => p['id'] as string)));

  artist = toSignal(
    this.route.params.pipe(
      switchMap(params => this.artistService.getArtistById(params['id'])),
      catchError(err => {
        console.error('Error fetching artist details:', err);
        return of(null);
      })
    )
  );

  albums = toSignal(
    this.route.params.pipe(
      switchMap(params => this.artistService.getArtistAlbums(params['id'])),
      map(response => response.content),
      catchError(err => {
        console.error('Error fetching artist albums:', err);
        return of([] as Album[]);
      })
    ),
    { initialValue: [] as Album[] }
  );

  isLoading = signal(false);
}


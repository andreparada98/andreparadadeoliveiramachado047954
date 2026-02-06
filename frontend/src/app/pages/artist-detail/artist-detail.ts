import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Artist } from '../../shared/models/artist.model';
import { Album } from '../../shared/models/album.model';
import { ArtistFacade } from '../../shared/facades/artist.facade';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './artist-detail.html',
  styleUrl: './artist-detail.scss'
})
export class ArtistDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  readonly artistFacade = inject(ArtistFacade);

  artistId = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.artistId.set(id);
        this.artistFacade.loadArtistById(id);
        this.artistFacade.loadArtistAlbums(id);
      }
    });
  }
}


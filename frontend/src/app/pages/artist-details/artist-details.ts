import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArtistFacade } from '../../shared/facades/artist.facade';
import { BaseComponent } from '../../shared/helpers/base-component';
import { map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-artist-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './artist-details.html',
  styleUrl: './artist-details.scss'
})
export class ArtistDetailsComponent extends BaseComponent implements OnInit {
  private route = inject(ActivatedRoute);
  readonly artistFacade = inject(ArtistFacade);

  artistId = signal<string | null>(null);

  ngOnInit() {
    this.route.params.pipe(
      map(p => p['id'] as string),
      takeUntil(this.unsubscribe)
    ).subscribe(id => {
      if (id) {
        this.artistId.set(id);
        this.artistFacade.loadArtistById(id);
        this.artistFacade.loadArtistAlbums(id);
      }
    });
  }
}

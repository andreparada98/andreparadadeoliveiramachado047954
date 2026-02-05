import { Component, computed, input, output } from '@angular/core';
import { Artist } from '../../models/artist.model';

@Component({
  selector: 'ArtistCard',
  standalone: true,
  templateUrl: './artist-card.html',
  styleUrl: './artist-card.scss'
})
export class ArtistCardComponent {
  artist = input.required<Artist>();
  clicked = output<Artist>();
  view = output<Artist>();
  edit = output<Artist>();

  initial = computed(() => this.artist().name.charAt(0).toUpperCase());
  
  albumLabel = computed(() => {
    const count = this.artist().albumCount;
    return count === 1 ? 'album' : 'albums';
  });

  onClick(): void {
    this.clicked.emit(this.artist());
  }

  onView(event: MouseEvent): void {
    event.stopPropagation();
    this.view.emit(this.artist());
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit(this.artist());
  }
}


import { Component, input, output } from '@angular/core';
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

  get initial(): string {
    return this.artist().name.charAt(0).toUpperCase();
  }

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


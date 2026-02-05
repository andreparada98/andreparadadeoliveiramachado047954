import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Album } from '../../models/album.model';
import { XButtonComponent } from '../x-button/x-button';

@Component({
  selector: 'AlbumCard',
  standalone: true,
  imports: [CommonModule, XButtonComponent],
  templateUrl: './album-card.html',
  styleUrl: './album-card.scss'
})
export class AlbumCardComponent {
  album = input.required<Album>();
  
  edit = output<Album>();
  view = output<Album>();
  delete = output<Album>();
  
  onView(event: Event) {
    event.stopPropagation();
    this.view.emit(this.album());
  }

  onEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit(this.album());
  }
}


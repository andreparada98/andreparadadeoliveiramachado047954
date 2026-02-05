import { Component, inject, signal, output, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlbumService, AlbumRequest } from '../../../services/album.service';
import { XInputComponent } from '../x-input/x-input';
import { XButtonComponent } from '../x-button/x-button';
import { XModalComponent } from '../x-modal/x-modal';
import { Album } from '../../models/album.model';

@Component({
  selector: 'QuickAlbumModal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    XInputComponent,
    XButtonComponent,
    XModalComponent
  ],
  template: `
    <XModal title="Criar Álbum Rapidamente" (close)="onClose()">
      <form [formGroup]="quickAlbumForm" (ngSubmit)="onSubmit()" class="quick-form">
        <XInput label="Título" placeholder="Ex: Master of Puppets" formControlName="title" />
        <XInput label="Lançamento" type="date" formControlName="releasedAt" />
        
        <div class="modal-actions">
          <XButton type="button" (clicked)="onClose()" [disabled]="isLoading()">
            Cancelar
          </XButton>
          <XButton type="submit" [disabled]="quickAlbumForm.invalid || isLoading()">
            {{ isLoading() ? 'Criando...' : 'Criar Álbum' }}
          </XButton>
        </div>
      </form>
    </XModal>
  `,
  styles: [`
    .quick-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 1rem;
      }
    }
  `]
})
export class QuickAlbumModalComponent {
  private fb = inject(FormBuilder);
  private albumService = inject(AlbumService);

  artistId = input<string | null>(null);
  
  close = output<void>();
  saved = output<Album>();

  quickAlbumForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    releasedAt: [new Date().toISOString().split('T')[0], [Validators.required]]
  });

  isLoading = signal(false);

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.quickAlbumForm.invalid) return;

    this.isLoading.set(true);
    const { title, releasedAt } = this.quickAlbumForm.value;
    
    const request: AlbumRequest = {
      title,
      releasedAt: `${releasedAt}T00:00:00`,
      artistIds: this.artistId() ? [this.artistId()!] : []
    };

    this.albumService.createAlbum(request).subscribe({
      next: (newAlbum) => {
        this.isLoading.set(false);
        this.saved.emit(newAlbum);
        this.onClose();
      },
      error: (err) => {
        console.error('Error creating quick album:', err);
        this.isLoading.set(false);
      }
    });
  }
}


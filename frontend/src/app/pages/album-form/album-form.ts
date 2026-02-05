import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlbumService, AlbumRequest } from '../../services/album.service';
import { XInputComponent } from '../../shared/components/x-input/x-input';
import { XButtonComponent } from '../../shared/components/x-button/x-button';
import { SelectManyArtistsComponent } from '../../shared/components/select-many-artists/select-many-artists';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-album-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    XInputComponent,
    XButtonComponent,
    SelectManyArtistsComponent,
    RouterModule,
    CommonModule
  ],
  templateUrl: './album-form.html',
  styleUrl: './album-form.scss'
})
export class AlbumFormComponent {
  private fb = inject(FormBuilder);
  private albumService = inject(AlbumService);
  private router = inject(Router);

  albumForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    releasedAt: ['', [Validators.required]],
    artistIds: [[], [Validators.required, Validators.minLength(1)]]
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit() {
    if (this.albumForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { title, releasedAt, artistIds } = this.albumForm.value;
    
    // O front recebe apenas YYYY-MM-DD, então concatenamos com o horário para o backend
    const formattedDate = `${releasedAt}T00:00:00`;
    
    const request: AlbumRequest = {
      title,
      releasedAt: formattedDate,
      artistIds
    };
    
    this.albumService.createAlbum(request).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error creating album:', err);
        this.errorMessage.set('Erro ao criar álbum. Verifique os dados e tente novamente.');
        this.isLoading.set(false);
      }
    });
  }
}


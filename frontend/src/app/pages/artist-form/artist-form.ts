import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { XInputComponent } from '../../shared/components/x-input/x-input';
import { XButtonComponent } from '../../shared/components/x-button/x-button';

@Component({
  selector: 'app-artist-form',
  standalone: true,
  imports: [ReactiveFormsModule, XInputComponent, XButtonComponent, RouterModule],
  templateUrl: './artist-form.html',
  styleUrl: './artist-form.scss'
})
export class ArtistFormComponent {
  private fb = inject(FormBuilder);
  private artistService = inject(ArtistService);
  private router = inject(Router);

  artistForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]]
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit() {
    if (this.artistForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.artistService.createArtist(this.artistForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error creating artist:', err);
        this.errorMessage.set('Erro ao criar artista. Tente novamente.');
        this.isLoading.set(false);
      }
    });
  }
}


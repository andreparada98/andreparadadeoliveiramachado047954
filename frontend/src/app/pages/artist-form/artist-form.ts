import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { XInputComponent } from '../../shared/components/x-input/x-input';
import { XButtonComponent } from '../../shared/components/x-button/x-button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artist-form',
  standalone: true,
  imports: [ReactiveFormsModule, XInputComponent, XButtonComponent, RouterModule, CommonModule],
  templateUrl: './artist-form.html',
  styleUrl: './artist-form.scss'
})
export class ArtistFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private artistService = inject(ArtistService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  artistId = signal<string | null>(null);
  isEditMode = signal(false);

  artistForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]]
  });

  isLoading = signal(false);
  isFetching = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.artistId.set(id);
        this.isEditMode.set(true);
        this.loadArtist(id);
      }
    });
  }

  loadArtist(id: string) {
    this.isFetching.set(true);
    this.artistService.getArtistById(id).subscribe({
      next: (artist) => {
        this.artistForm.patchValue({
          name: artist.name,
          description: artist.description
        });
        this.isFetching.set(false);
      },
      error: (err) => {
        console.error('Error fetching artist:', err);
        this.errorMessage.set('Erro ao carregar dados do artista.');
        this.isFetching.set(false);
      }
    });
  }

  onSubmit() {
    if (this.artistForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const request = this.isEditMode()
      ? this.artistService.updateArtist(this.artistId()!, this.artistForm.value)
      : this.artistService.createArtist(this.artistForm.value);

    request.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error saving artist:', err);
        this.errorMessage.set(`Erro ao ${this.isEditMode() ? 'atualizar' : 'criar'} artista. Tente novamente.`);
        this.isLoading.set(false);
      }
    });
  }
}


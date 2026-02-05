import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ArtistService, ArtistRequest } from '../../services/artist.service';
import { XInputComponent } from '../../shared/components/x-input/x-input';
import { XButtonComponent } from '../../shared/components/x-button/x-button';
import { SelectManyAlbumsComponent } from '../../shared/components/select-many-albums/select-many-albums';
import { QuickAlbumModalComponent } from '../../shared/components/quick-album-modal/quick-album-modal';
import { CommonModule } from '@angular/common';
import { Album } from '../../shared/models/album.model';

@Component({
  selector: 'app-artist-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    XInputComponent,
    XButtonComponent,
    SelectManyAlbumsComponent,
    QuickAlbumModalComponent,
    RouterModule,
    CommonModule
  ],
  templateUrl: './artist-form.html',
  styleUrl: './artist-form.scss'
})
export class ArtistFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private artistService = inject(ArtistService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild(SelectManyAlbumsComponent) selectManyAlbums!: SelectManyAlbumsComponent;

  artistId = signal<string | null>(null);
  isEditMode = signal(false);

  artistForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]],
    albumIds: [[]]
  });

  showQuickAlbumModal = signal(false);

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
        this.artistService.getArtistAlbums(id, 0, 100).subscribe({
          next: (albumsResponse) => {
            this.artistForm.patchValue({
              name: artist.name,
              description: artist.description,
              albumIds: albumsResponse.content.map(album => album.id)
            });
            this.isFetching.set(false);
          },
          error: (err) => {
            console.error('Error fetching artist albums:', err);
            this.artistForm.patchValue({
              name: artist.name,
              description: artist.description,
              albumIds: []
            });
            this.isFetching.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching artist:', err);
        this.errorMessage.set('Erro ao carregar dados do artista.');
        this.isFetching.set(false);
      }
    });
  }

  onQuickAlbumSaved(newAlbum: Album) {
    this.selectManyAlbums.refresh();
    const currentIds = this.artistForm.get('albumIds')?.value || [];
    this.artistForm.patchValue({
      albumIds: [...currentIds, newAlbum.id]
    });
  }

  onSubmit() {
    if (this.artistForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const request: ArtistRequest = this.artistForm.value;

    const operation = this.isEditMode()
      ? this.artistService.updateArtist(this.artistId()!, request)
      : this.artistService.createArtist(request);

    operation.subscribe({
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


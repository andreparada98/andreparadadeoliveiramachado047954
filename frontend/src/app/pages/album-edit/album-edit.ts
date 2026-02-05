import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlbumService, AlbumRequest } from '../../services/album.service';
import { FileService } from '../../services/file.service';
import { XInputComponent } from '../../shared/components/x-input/x-input';
import { XButtonComponent } from '../../shared/components/x-button/x-button';
import { SelectManyArtistsComponent } from '../../shared/components/select-many-artists/select-many-artists';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-album-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    XInputComponent,
    XButtonComponent,
    SelectManyArtistsComponent,
    RouterModule,
    CommonModule
  ],
  templateUrl: './album-edit.html',
  styleUrl: './album-edit.scss'
})
export class AlbumEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private albumService = inject(AlbumService);
  private fileService = inject(FileService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  albumForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    releasedAt: ['', [Validators.required]],
    artistIds: [[], [Validators.required, Validators.minLength(1)]],
    cover: [null]
  });

  isLoading = signal(false);
  isFetching = signal(false);
  albumId = signal<string | null>(null);
  previewUrl = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.albumId.set(id);
      this.loadAlbum(id);
    }
  }

  loadAlbum(id: string) {
    this.isFetching.set(true);
    this.albumService.getAlbumById(id).subscribe({
      next: (album) => {
        const date = album.releasedAt.split('T')[0];
        this.albumForm.patchValue({
          title: album.title,
          releasedAt: date,
          artistIds: album.artists.map(a => a.id)
        });
        
        if (album.coverUrl) {
          this.previewUrl.set(album.coverUrl);
        } else if (album.covers && album.covers.length > 0) {
          this.previewUrl.set(album.covers[0].url);
        }
        
        this.isFetching.set(false);
      },
      error: (err) => {
        console.error('Error loading album:', err);
        this.errorMessage.set('Erro ao carregar os dados do álbum.');
        this.isFetching.set(false);
      }
    });
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.albumForm.patchValue({ cover: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.albumForm.invalid || !this.albumId()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { title, releasedAt, artistIds, cover } = this.albumForm.value;
    const formattedDate = `${releasedAt}T00:00:00`;

    if (cover instanceof File) {
      this.fileService.upload(cover).subscribe({
        next: (fileResponse) => {
          this.saveAlbum(title, formattedDate, artistIds, fileResponse.id);
        },
        error: (err) => {
          console.error('Error uploading cover:', err);
          this.errorMessage.set('Erro ao fazer upload da capa. Tente novamente.');
          this.isLoading.set(false);
        }
      });
    } else {
      this.saveAlbum(title, formattedDate, artistIds);
    }
  }

  private saveAlbum(title: string, releasedAt: string, artistIds: string[], fileId?: string) {
    const request: AlbumRequest = {
      title,
      releasedAt,
      artistIds,
      fileId
    };

    this.albumService.updateAlbum(this.albumId()!, request)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/albums']);
        },
        error: (err) => {
          console.error('Error updating album:', err);
          this.errorMessage.set('Erro ao atualizar álbum. Verifique os dados e tente novamente.');
        }
      });
  }
}

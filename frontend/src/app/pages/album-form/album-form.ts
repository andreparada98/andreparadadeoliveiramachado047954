import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlbumService, AlbumRequest } from '../../services/album.service';
import { FileService } from '../../services/file.service';
import { XInputComponent } from '../../shared/components/x-input/x-input';
import { XButtonComponent } from '../../shared/components/x-button/x-button';
import { SelectManyArtistsComponent } from '../../shared/components/select-many-artists/select-many-artists';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

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
  private fileService = inject(FileService);
  private router = inject(Router);

  albumForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    releasedAt: ['', [Validators.required]],
    artistIds: [[], [Validators.required, Validators.minLength(1)]],
    cover: [null]
  });

  isLoading = signal(false);
  previewUrl = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

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
    if (this.albumForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { title, releasedAt, artistIds, cover } = this.albumForm.value;
    const formattedDate = `${releasedAt}T00:00:00`;

    if (cover) {
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

    this.albumService.createAlbum(request)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/albums']);
        },
        error: (err) => {
          console.error('Error creating album:', err);
          this.errorMessage.set('Erro ao criar álbum. Verifique os dados e tente novamente.');
        }
      });
  }
}

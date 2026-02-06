import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { XInputComponent } from '../../shared/components/x-input/x-input';
import { XButtonComponent } from '../../shared/components/x-button/x-button';
import { SelectManyArtistsComponent } from '../../shared/components/select-many-artists/select-many-artists';
import { CommonModule } from '@angular/common';
import { AlbumFacade } from '../../shared/facades/album.facade';
import { FileFacade } from '../../shared/facades/file.facade';
import { BaseComponent } from '../../shared/helpers/base-component';

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
export class AlbumFormComponent extends BaseComponent {
  private fb = inject(FormBuilder);
  readonly albumFacade = inject(AlbumFacade);
  readonly fileFacade = inject(FileFacade);
  private router = inject(Router);

  albumForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    releasedAt: ['', [Validators.required]],
    artistIds: [[], [Validators.required, Validators.minLength(1)]],
    cover: [null]
  });

  previewUrl = signal<string | null>(null);

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

    const { title, releasedAt, artistIds, cover } = this.albumForm.value;
    const formattedDate = `${releasedAt}T00:00:00`;

    if (cover) {
      this.fileFacade.uploadFile(cover, (fileResponse) => {
        this.saveAlbum(title, formattedDate, artistIds, fileResponse.id);
      });
    } else {
      this.saveAlbum(title, formattedDate, artistIds);
    }
  }

  private saveAlbum(title: string, releasedAt: string, artistIds: string[], fileId?: string) {
    const request = {
      title,
      releasedAt,
      artistIds,
      fileId
    };

    this.albumFacade.createAlbum(request, () => {
      this.router.navigate(['/albums']);
    });
  }
}

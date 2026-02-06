import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { takeUntil } from 'rxjs/operators';
import { XInputComponent } from '../../shared/components/x-input/x-input';
import { XButtonComponent } from '../../shared/components/x-button/x-button';
import { SelectManyArtistsComponent } from '../../shared/components/select-many-artists/select-many-artists';
import { CommonModule } from '@angular/common';
import { AlbumFacade } from '../../shared/facades/album.facade';
import { FileFacade } from '../../shared/facades/file.facade';
import { BaseComponent } from '../../shared/helpers/base-component';

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
export class AlbumEditComponent extends BaseComponent implements OnInit {
  private fb = inject(FormBuilder);
  readonly albumFacade = inject(AlbumFacade);
  readonly fileFacade = inject(FileFacade);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  albumForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    releasedAt: ['', [Validators.required]],
    artistIds: [[], [Validators.required, Validators.minLength(1)]],
    cover: [null]
  });

  albumId = signal<string | null>(null);
  previewUrl = signal<string | null>(null);

  constructor() {
    super();
    toObservable(this.albumFacade.selectedAlbum)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(album => {
        if (album) {
          const date = album.releasedAt.split('T')[0];
          this.albumForm.patchValue({
            title: album.title,
            releasedAt: date,
            artistIds: album.artists.map(a => a.id)
          }, { emitEvent: false });
          
          if (album.coverUrl) {
            this.previewUrl.set(album.coverUrl);
          } else if (album.covers && album.covers.length > 0) {
            this.previewUrl.set(album.covers[0].url);
          }
        }
      });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.albumId.set(id);
      this.albumFacade.loadAlbumById(id);
    }
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

    const { title, releasedAt, artistIds, cover } = this.albumForm.value;
    const formattedDate = `${releasedAt}T00:00:00`;

    if (cover instanceof File) {
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

    this.albumFacade.updateAlbum(this.albumId()!, request, () => {
      this.router.navigate(['/albums']);
    });
  }
}

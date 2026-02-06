import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { XInputComponent } from '../../shared/components/x-input/x-input';
import { XButtonComponent } from '../../shared/components/x-button/x-button';
import { SelectManyAlbumsComponent } from '../../shared/components/select-many-albums/select-many-albums';
import { QuickAlbumModalComponent } from '../../shared/components/quick-album-modal/quick-album-modal';
import { CommonModule } from '@angular/common';
import { Album } from '../../shared/models/album.model';
import { ArtistFacade } from '../../shared/facades/artist.facade';
import { BaseComponent } from '../../shared/helpers/base-component';

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
export class ArtistFormComponent extends BaseComponent implements OnInit {
  private fb = inject(FormBuilder);
  readonly artistFacade = inject(ArtistFacade);
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

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.artistId.set(id);
        this.isEditMode.set(true);
        this.loadArtistData(id);
      }
    });
  }

  loadArtistData(id: string) {
    this.artistFacade.loadArtistById(id, (artist) => {
      this.artistForm.patchValue({
        name: artist.name,
        description: artist.description
      });

      this.artistFacade.loadArtistAlbums(id, (albums) => {
        this.artistForm.patchValue({
          albumIds: albums.map(album => album.id)
        });
      });
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

    const request = this.artistForm.value;
    const onSuccess = () => this.router.navigate(['/home']);

    if (this.isEditMode()) {
      this.artistFacade.updateArtist(this.artistId()!, request, onSuccess);
    } else {
      this.artistFacade.createArtist(request, onSuccess);
    }
  }
}

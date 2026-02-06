import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ArtistFormComponent } from './artist-form';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, provideRouter } from '@angular/router';
import { ArtistFacade } from '../../shared/facades/artist.facade';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ArtistFormComponent', () => {
  let component: ArtistFormComponent;
  let fixture: ComponentFixture<ArtistFormComponent>;
  let artistFacadeSpy: any;
  let router: Router;

  beforeEach(async () => {
    artistFacadeSpy = {
      loadArtistById: vi.fn(),
      loadArtistAlbums: vi.fn(),
      createArtist: vi.fn(),
      updateArtist: vi.fn(),
      isLoading: signal(false),
      errorMessage: signal<string | null>(null),
      selectedArtist: signal(null),
      artistAlbums: signal([]),
      isLoadingAlbums: signal(false)
    };

    await TestBed.configureTestingModule({
      imports: [ArtistFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: ArtistFacade, useValue: artistFacadeSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            paramMap: of({ get: () => null })
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');

    fixture = TestBed.createComponent(ArtistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createArtist on submit in creation mode', () => {
    component.artistForm.patchValue({
      name: 'New Artist',
      description: 'Some description'
    });

    component.onSubmit();

    expect(artistFacadeSpy.createArtist).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Artist' }),
      expect.any(Function)
    );
  });

  it('should call updateArtist on submit in edit mode', () => {
    component.artistId.set('1');
    component.isEditMode.set(true);
    component.artistForm.patchValue({
      name: 'Updated Artist',
      description: 'New description'
    });

    component.onSubmit();

    expect(artistFacadeSpy.updateArtist).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({ name: 'Updated Artist' }),
      expect.any(Function)
    );
  });
});

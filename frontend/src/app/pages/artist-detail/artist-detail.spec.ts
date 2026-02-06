import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ArtistDetailComponent } from './artist-detail';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ArtistFacade } from '../../shared/facades/artist.facade';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { convertToParamMap } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ArtistDetailComponent', () => {
  let component: ArtistDetailComponent;
  let fixture: ComponentFixture<ArtistDetailComponent>;
  let artistFacadeSpy: any;

  beforeEach(async () => {
    artistFacadeSpy = {
      loadArtistById: vi.fn(),
      loadArtistAlbums: vi.fn(),
      selectedArtist: signal(null),
      artistAlbums: signal([]),
      isLoading: signal(false),
      isLoadingAlbums: signal(false),
      errorMessage: signal<string | null>(null)
    };

    await TestBed.configureTestingModule({
      imports: [ArtistDetailComponent],
      providers: [
        provideRouter([]),
        { provide: ArtistFacade, useValue: artistFacadeSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '123' }))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call facade to load artist and albums on init', () => {
    fixture.detectChanges(); // triggers ngOnInit

    expect(component.artistId()).toBe('123');
    expect(artistFacadeSpy.loadArtistById).toHaveBeenCalledWith('123');
    expect(artistFacadeSpy.loadArtistAlbums).toHaveBeenCalledWith('123');
  });

  it('should reflect artist data from facade', () => {
    const mockArtist = { id: '123', name: 'Pink Floyd' } as any;
    artistFacadeSpy.selectedArtist.set(mockArtist);
    fixture.detectChanges();
    
    expect(component.artistFacade.selectedArtist()).toEqual(mockArtist);
  });
});

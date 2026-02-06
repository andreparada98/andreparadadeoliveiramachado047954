import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ArtistDetailsComponent } from './artist-details';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ArtistFacade } from '../../shared/facades/artist.facade';
import { of, Subject } from 'rxjs';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ArtistDetailsComponent', () => {
  let component: ArtistDetailsComponent;
  let fixture: ComponentFixture<ArtistDetailsComponent>;
  let artistFacadeSpy: any;
  let paramsSubject: Subject<any>;

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
    paramsSubject = new Subject();

    await TestBed.configureTestingModule({
      imports: [ArtistDetailsComponent],
      providers: [
        provideRouter([]),
        { provide: ArtistFacade, useValue: artistFacadeSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: paramsSubject.asObservable()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call facade to load artist and albums on params change', async () => {
    fixture.detectChanges();
    paramsSubject.next({ id: '123' });
    
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

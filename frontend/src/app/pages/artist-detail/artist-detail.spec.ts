import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ArtistDetailComponent } from './artist-detail';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { of, throwError } from 'rxjs';
import { convertToParamMap } from '@angular/router';

describe('ArtistDetailComponent', () => {
  let component: ArtistDetailComponent;
  let fixture: ComponentFixture<ArtistDetailComponent>;
  let artistServiceSpy: any;

  beforeEach(async () => {
    artistServiceSpy = {
      getArtistById: vi.fn(),
      getArtistAlbums: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ArtistDetailComponent],
      providers: [
        provideRouter([]),
        { provide: ArtistService, useValue: artistServiceSpy },
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

  it('should load artist and albums on init', () => {
    const mockArtist = { id: '123', name: 'Pink Floyd', albumCount: 5 };
    const mockAlbumsResponse = { content: [{ id: '1', title: 'Album 1' }], page: {} };

    artistServiceSpy.getArtistById.mockReturnValue(of(mockArtist));
    artistServiceSpy.getArtistAlbums.mockReturnValue(of(mockAlbumsResponse));

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.artistId()).toBe('123');
    expect(component.artist()).toEqual(mockArtist);
    expect(component.albums()).toEqual(mockAlbumsResponse.content);
    expect(component.isLoading()).toBeFalsy();
    expect(component.isLoadingAlbums()).toBeFalsy();
  });

  it('should handle error when loading artist', () => {
    artistServiceSpy.getArtistById.mockReturnValue(throwError(() => new Error('Error')));
    artistServiceSpy.getArtistAlbums.mockReturnValue(of({ content: [] }));

    fixture.detectChanges();

    expect(component.isLoading()).toBeFalsy();
    expect(component.artist()).toBeNull();
  });
});


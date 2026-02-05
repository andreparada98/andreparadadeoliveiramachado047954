import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ArtistDetailsComponent } from './artist-details';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { of, throwError, EMPTY, Subject } from 'rxjs';

describe('ArtistDetailsComponent', () => {
  let component: ArtistDetailsComponent;
  let fixture: ComponentFixture<ArtistDetailsComponent>;
  let artistServiceSpy: any;
  let paramsSubject: Subject<any>;

  beforeEach(async () => {
    artistServiceSpy = {
      getArtistById: vi.fn().mockReturnValue(EMPTY),
      getArtistAlbums: vi.fn().mockReturnValue(EMPTY)
    };
    paramsSubject = new Subject();

    await TestBed.configureTestingModule({
      imports: [ArtistDetailsComponent],
      providers: [
        provideRouter([]),
        { provide: ArtistService, useValue: artistServiceSpy },
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

  it('should load artist and albums via toSignal', async () => {
    const mockArtist = { id: '123', name: 'Pink Floyd', albumCount: 5 };
    const mockAlbumsResponse = { content: [{ id: '1', title: 'Album 1' }], page: {} };

    artistServiceSpy.getArtistById.mockReturnValue(of(mockArtist));
    artistServiceSpy.getArtistAlbums.mockReturnValue(of(mockAlbumsResponse));

    // Emit params AFTER mocks are set up
    paramsSubject.next({ id: '123' });
    
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.artistId()).toBe('123');
    expect(component.artist()).toEqual(mockArtist);
    expect(component.albums()).toEqual(mockAlbumsResponse.content);
  });

  it('should handle error when loading artist details', async () => {
    artistServiceSpy.getArtistById.mockReturnValue(throwError(() => new Error('Error')));
    artistServiceSpy.getArtistAlbums.mockReturnValue(of({ content: [] }));

    paramsSubject.next({ id: '123' });

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.artist()).toBeNull();
  });
});

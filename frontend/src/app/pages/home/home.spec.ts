import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home';
import { Router, provideRouter } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let artistServiceSpy: any;
  let routerSpy: any;

  const mockArtistsResponse = {
    content: [{ id: '1', name: 'Pink Floyd', albumCount: 5 }],
    page: { size: 10, number: 0, totalElements: 1, totalPages: 1 }
  };

  beforeEach(async () => {
    artistServiceSpy = {
      getArtists: vi.fn().mockReturnValue(of(mockArtistsResponse)),
      getArtistAlbums: vi.fn().mockReturnValue(of({ content: [], page: {} }))
    };
    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent, FormsModule],
      providers: [
        provideRouter([]),
        { provide: ArtistService, useValue: artistServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load artists on init', async () => {
    fixture.detectChanges();
    // Wait for the combineLatest and debounceTime
    await new Promise(resolve => setTimeout(resolve, 400));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(artistServiceSpy.getArtists).toHaveBeenCalled();
    expect(component.artists().length).toBe(1);
    expect(component.totalElements()).toBe(1);
  });

  it('should filter artists by name', async () => {
    fixture.detectChanges();
    component.searchQuery.set('Pink');
    
    // We wait for the debounceTime (300ms) manually if needed, 
    // or we can mock the service to return immediately.
    // In Vitest without Zone.js, we might need a small delay.
    await new Promise(resolve => setTimeout(resolve, 400));
    fixture.detectChanges();

    expect(artistServiceSpy.getArtists).toHaveBeenCalledWith({ name: 'Pink' }, 0, 10, 'name,asc');
  });

  it('should toggle sort order', async () => {
    fixture.detectChanges();
    component.onSort();
    
    await new Promise(resolve => setTimeout(resolve, 400));
    fixture.detectChanges();

    expect(component.sortOrder()).toBe('desc');
    expect(artistServiceSpy.getArtists).toHaveBeenCalledWith({ name: '' }, 0, 10, 'name,desc');
  });

  it('should load albums when artist is clicked', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const mockArtist = mockArtistsResponse.content[0];
    const mockAlbums = { content: [{ id: 'a1', title: 'The Wall' }], page: {} };
    artistServiceSpy.getArtistAlbums.mockReturnValue(of(mockAlbums));

    component.onArtistClick(mockArtist);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.selectedArtist()).toEqual(mockArtist);
    expect(artistServiceSpy.getArtistAlbums).toHaveBeenCalledWith(mockArtist.id);
    expect(component.albums().length).toBe(1);
  });

  it('should navigate to artist detail', () => {
    const mockArtist = mockArtistsResponse.content[0];
    component.onViewArtist(mockArtist);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/artist', mockArtist.id]);
  });

  it('should navigate to artist edit', () => {
    const mockArtist = mockArtistsResponse.content[0];
    component.onEditArtist(mockArtist);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/artist', mockArtist.id, 'edit']);
  });
});


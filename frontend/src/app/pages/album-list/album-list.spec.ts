import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlbumListComponent } from './album-list';
import { Router, provideRouter } from '@angular/router';
import { AlbumService } from '../../services/album.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('AlbumListComponent', () => {
  let component: AlbumListComponent;
  let fixture: ComponentFixture<AlbumListComponent>;
  let albumServiceSpy: any;
  let routerSpy: any;

  const mockAlbumsResponse = {
    content: [{ id: '1', title: 'Album 1', artists: [] }],
    page: { size: 10, number: 0, totalElements: 1, totalPages: 1 }
  };

  beforeEach(async () => {
    albumServiceSpy = {
      getAlbums: vi.fn().mockReturnValue(of(mockAlbumsResponse))
    };
    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AlbumListComponent, FormsModule],
      providers: [
        provideRouter([]),
        { provide: AlbumService, useValue: albumServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load albums on init', async () => {
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 400)); // wait for debounce
    fixture.detectChanges();

    expect(albumServiceSpy.getAlbums).toHaveBeenCalled();
    expect(component.albums().length).toBe(1);
  });

  it('should filter albums by title', async () => {
    fixture.detectChanges();
    component.searchQuery.set('Dark');
    
    await new Promise(resolve => setTimeout(resolve, 400));
    fixture.detectChanges();

    expect(albumServiceSpy.getAlbums).toHaveBeenCalledWith({ title: 'Dark' }, 0, 10);
  });

  it('should navigate to add album', () => {
    component.onAddAlbum();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/album/new']);
  });

  it('should navigate to album detail', () => {
    const mockAlbum = mockAlbumsResponse.content[0];
    component.onViewAlbum(mockAlbum as any);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/album', mockAlbum.id]);
  });

  it('should navigate to album edit', () => {
    const mockAlbum = mockAlbumsResponse.content[0];
    component.onEditAlbum(mockAlbum as any);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/album', mockAlbum.id, 'edit']);
  });
});


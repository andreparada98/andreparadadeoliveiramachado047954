import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlbumEditComponent } from './album-edit';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, provideRouter } from '@angular/router';
import { AlbumService } from '../../services/album.service';
import { FileService } from '../../services/file.service';
import { of, throwError } from 'rxjs';

describe('AlbumEditComponent', () => {
  let component: AlbumEditComponent;
  let fixture: ComponentFixture<AlbumEditComponent>;
  let albumServiceSpy: any;
  let fileServiceSpy: any;
  let router: Router;

  const mockAlbum = {
    id: '1',
    title: 'Dark Side',
    releasedAt: '1973-03-01T00:00:00',
    artists: [{ id: 'a1', name: 'Pink Floyd' }],
    coverUrl: 'http://example.com/cover.jpg'
  };

  beforeEach(async () => {
    albumServiceSpy = {
      getAlbumById: vi.fn().mockReturnValue(of(mockAlbum)),
      updateAlbum: vi.fn().mockReturnValue(of(mockAlbum))
    };
    fileServiceSpy = {
      upload: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AlbumEditComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AlbumService, useValue: albumServiceSpy },
        { provide: FileService, useValue: fileServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
            params: of({ id: '1' }),
            paramMap: of({ get: () => '1' })
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
    
    fixture = TestBed.createComponent(AlbumEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load album data on init', () => {
    expect(albumServiceSpy.getAlbumById).toHaveBeenCalledWith('1');
    expect(component.albumForm.value.title).toBe('Dark Side');
    expect(component.previewUrl()).toBe('http://example.com/cover.jpg');
  });

  it('should call updateAlbum on submit without new cover', () => {
    component.onSubmit();
    expect(albumServiceSpy.updateAlbum).toHaveBeenCalledWith('1', expect.objectContaining({
      title: 'Dark Side'
    }));
    expect(router.navigate).toHaveBeenCalledWith(['/albums']);
  });

  it('should upload file and then updateAlbum on submit with new cover', () => {
    const file = new File([''], 'new-cover.jpg', { type: 'image/jpeg' });
    component.albumForm.patchValue({ cover: file });
    fileServiceSpy.upload.mockReturnValue(of({ id: 'file-123' }));

    component.onSubmit();

    expect(fileServiceSpy.upload).toHaveBeenCalledWith(file);
    expect(albumServiceSpy.updateAlbum).toHaveBeenCalledWith('1', expect.objectContaining({
      fileId: 'file-123'
    }));
  });

  it('should handle error when loading album', () => {
    albumServiceSpy.getAlbumById.mockReturnValue(throwError(() => new Error('Error')));
    component.loadAlbum('1');
    expect(component.errorMessage()).toBe('Erro ao carregar os dados do álbum.');
  });
});

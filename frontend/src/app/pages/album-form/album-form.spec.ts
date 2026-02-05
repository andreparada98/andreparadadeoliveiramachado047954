import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlbumFormComponent } from './album-form';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, provideRouter } from '@angular/router';
import { AlbumService } from '../../services/album.service';
import { FileService } from '../../services/file.service';
import { of, throwError } from 'rxjs';

describe('AlbumFormComponent', () => {
  let component: AlbumFormComponent;
  let fixture: ComponentFixture<AlbumFormComponent>;
  let albumServiceSpy: any;
  let fileServiceSpy: any;
  let router: Router;

  beforeEach(async () => {
    albumServiceSpy = {
      createAlbum: vi.fn().mockReturnValue(of({}))
    };
    fileServiceSpy = {
      upload: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AlbumFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AlbumService, useValue: albumServiceSpy },
        { provide: FileService, useValue: fileServiceSpy },
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

    fixture = TestBed.createComponent(AlbumFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component.albumForm.valid).toBeFalsy();
  });

  it('should call createAlbum on submit', () => {
    component.albumForm.patchValue({
      title: 'Album 1',
      releasedAt: '2024-01-01',
      artistIds: ['1']
    });

    component.onSubmit();

    expect(albumServiceSpy.createAlbum).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Album 1'
    }));
    expect(router.navigate).toHaveBeenCalledWith(['/albums']);
  });

  it('should upload cover before creating album', () => {
    const file = new File([''], 'cover.jpg', { type: 'image/jpeg' });
    component.albumForm.patchValue({
      title: 'Album 1',
      releasedAt: '2024-01-01',
      artistIds: ['1'],
      cover: file
    });
    fileServiceSpy.upload.mockReturnValue(of({ id: 'file-123' }));

    component.onSubmit();

    expect(fileServiceSpy.upload).toHaveBeenCalledWith(file);
    expect(albumServiceSpy.createAlbum).toHaveBeenCalledWith(expect.objectContaining({
      fileId: 'file-123'
    }));
  });
});

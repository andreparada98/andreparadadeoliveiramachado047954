import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlbumFormComponent } from './album-form';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, provideRouter } from '@angular/router';
import { AlbumFacade } from '../../shared/facades/album.facade';
import { FileFacade } from '../../shared/facades/file.facade';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('AlbumFormComponent', () => {
  let component: AlbumFormComponent;
  let fixture: ComponentFixture<AlbumFormComponent>;
  let albumFacadeSpy: any;
  let fileFacadeSpy: any;
  let router: Router;

  beforeEach(async () => {
    albumFacadeSpy = {
      createAlbum: vi.fn(),
      isLoading: signal(false),
      errorMessage: signal<string | null>(null)
    };
    fileFacadeSpy = {
      uploadFile: vi.fn(),
      isUploading: signal(false),
      errorMessage: signal<string | null>(null)
    };

    await TestBed.configureTestingModule({
      imports: [AlbumFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AlbumFacade, useValue: albumFacadeSpy },
        { provide: FileFacade, useValue: fileFacadeSpy },
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

  it('should call createAlbum on submit', () => {
    component.albumForm.patchValue({
      title: 'Album 1',
      releasedAt: '2024-01-01',
      artistIds: ['1']
    });

    component.onSubmit();

    expect(albumFacadeSpy.createAlbum).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Album 1' }),
      expect.any(Function)
    );
  });

  it('should upload cover before creating album', () => {
    const file = new File([''], 'cover.jpg', { type: 'image/jpeg' });
    component.albumForm.patchValue({
      title: 'Album 1',
      releasedAt: '2024-01-01',
      artistIds: ['1'],
      cover: file
    });
    
    fileFacadeSpy.uploadFile.mockImplementation((f: any, callback: any) => {
      callback({ id: 'file-123' });
    });

    component.onSubmit();

    expect(fileFacadeSpy.uploadFile).toHaveBeenCalled();
    expect(albumFacadeSpy.createAlbum).toHaveBeenCalledWith(
      expect.objectContaining({ fileId: 'file-123' }),
      expect.any(Function)
    );
  });
});

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlbumEditComponent } from './album-edit';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, provideRouter } from '@angular/router';
import { AlbumFacade } from '../../shared/facades/album.facade';
import { FileFacade } from '../../shared/facades/file.facade';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('AlbumEditComponent', () => {
  let component: AlbumEditComponent;
  let fixture: ComponentFixture<AlbumEditComponent>;
  let albumFacadeSpy: any;
  let fileFacadeSpy: any;
  let router: Router;

  const mockAlbum = {
    id: '1',
    title: 'Dark Side',
    releasedAt: '1973-03-01T00:00:00',
    artists: [{ id: 'a1', name: 'Pink Floyd' }],
    coverUrl: 'http://example.com/cover.jpg'
  };

  beforeEach(async () => {
    albumFacadeSpy = {
      loadAlbumById: vi.fn(),
      updateAlbum: vi.fn(),
      selectedAlbum: signal(mockAlbum),
      isLoading: signal(false),
      errorMessage: signal<string | null>(null),
      totalPages: signal(1)
    };
    fileFacadeSpy = {
      uploadFile: vi.fn(),
      isUploading: signal(false),
      errorMessage: signal<string | null>(null)
    };

    await TestBed.configureTestingModule({
      imports: [AlbumEditComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AlbumFacade, useValue: albumFacadeSpy },
        { provide: FileFacade, useValue: fileFacadeSpy },
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

  it('should call facade load on init', () => {
    expect(albumFacadeSpy.loadAlbumById).toHaveBeenCalledWith('1');
  });

  it('should call updateAlbum on submit without new cover', () => {
    component.onSubmit();
    expect(albumFacadeSpy.updateAlbum).toHaveBeenCalledWith(
      '1', 
      expect.objectContaining({ title: 'Dark Side' }),
      expect.any(Function)
    );
  });

  it('should upload file and then updateAlbum on submit with new cover', () => {
    const file = new File([''], 'new-cover.jpg', { type: 'image/jpeg' });
    component.albumForm.patchValue({ cover: file });
    
    fileFacadeSpy.uploadFile.mockImplementation((f: any, callback: any) => {
      callback({ id: 'file-123' });
    });

    component.onSubmit();

    expect(fileFacadeSpy.uploadFile).toHaveBeenCalled();
    expect(albumFacadeSpy.updateAlbum).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({ fileId: 'file-123' }),
      expect.any(Function)
    );
  });
});

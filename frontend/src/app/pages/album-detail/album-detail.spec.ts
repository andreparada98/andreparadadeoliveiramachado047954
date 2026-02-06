import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlbumDetailComponent } from './album-detail';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { AlbumFacade } from '../../shared/facades/album.facade';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { convertToParamMap } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('AlbumDetailComponent', () => {
  let component: AlbumDetailComponent;
  let fixture: ComponentFixture<AlbumDetailComponent>;
  let albumFacadeSpy: any;
  let routerSpy: any;

  const mockAlbum = { id: '1', title: 'Album 1', artists: [] };

  beforeEach(async () => {
    albumFacadeSpy = {
      loadAlbumById: vi.fn(),
      selectedAlbum: signal(mockAlbum),
      isLoading: signal(false),
      errorMessage: signal<string | null>(null)
    };
    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AlbumDetailComponent],
      providers: [
        provideRouter([]),
        { provide: AlbumFacade, useValue: albumFacadeSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' }))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call facade to load album on init', () => {
    fixture.detectChanges();
    expect(albumFacadeSpy.loadAlbumById).toHaveBeenCalledWith('1');
  });

  it('should navigate back to albums', () => {
    component.onBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/albums']);
  });

  it('should navigate to edit album', () => {
    component.onEdit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/album', '1', 'edit']);
  });
});

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlbumListComponent } from './album-list';
import { Router, provideRouter } from '@angular/router';
import { AlbumFacade } from '../../shared/facades/album.facade';
import { signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('AlbumListComponent', () => {
  let component: AlbumListComponent;
  let fixture: ComponentFixture<AlbumListComponent>;
  let albumFacadeSpy: any;
  let routerSpy: any;

  const mockAlbums = [{ id: '1', title: 'Album 1', artists: [] }];

  beforeEach(async () => {
    albumFacadeSpy = {
      getAlbums: vi.fn(),
      albums: signal(mockAlbums),
      totalElements: signal(1),
      totalPages: signal(1),
      isLoading: signal(false),
      errorMessage: signal<string | null>(null)
    };
    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AlbumListComponent, FormsModule],
      providers: [
        provideRouter([]),
        { provide: AlbumFacade, useValue: albumFacadeSpy },
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

  it('should call facade to load albums on init', async () => {
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 400));
    expect(albumFacadeSpy.getAlbums).toHaveBeenCalled();
  });

  it('should filter albums by title', async () => {
    fixture.detectChanges();
    component.searchQuery.set('Dark');
    await new Promise(resolve => setTimeout(resolve, 400));
    expect(albumFacadeSpy.getAlbums).toHaveBeenCalledWith('Dark', 0, 10);
  });

  it('should navigate to add album', () => {
    component.onAddAlbum();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/album/new']);
  });

  it('should navigate to album detail', () => {
    const mockAlbum = mockAlbums[0];
    component.onViewAlbum(mockAlbum as any);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/album', mockAlbum.id]);
  });
});

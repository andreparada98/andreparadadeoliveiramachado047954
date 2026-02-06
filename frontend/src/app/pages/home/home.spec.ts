import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home';
import { Router, provideRouter } from '@angular/router';
import { ArtistFacade } from '../../shared/facades/artist.facade';
import { signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let artistFacadeSpy: any;
  let routerSpy: any;

  const mockArtists = [{ id: '1', name: 'Pink Floyd' }];

  beforeEach(async () => {
    artistFacadeSpy = {
      getArtists: vi.fn(),
      loadArtistAlbums: vi.fn(),
      artists: signal(mockArtists),
      totalElements: signal(1),
      totalPages: signal(1),
      isLoading: signal(false),
      errorMessage: signal<string | null>(null),
      artistAlbums: signal([]),
      isLoadingAlbums: signal(false)
    };
    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent, FormsModule],
      providers: [
        provideRouter([]),
        { provide: ArtistFacade, useValue: artistFacadeSpy },
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

  it('should call getArtists on init', async () => {
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 400));
    expect(artistFacadeSpy.getArtists).toHaveBeenCalled();
  });

  it('should filter artists by name', async () => {
    fixture.detectChanges();
    component.searchQuery.set('Pink');
    await new Promise(resolve => setTimeout(resolve, 400));
    expect(artistFacadeSpy.getArtists).toHaveBeenCalledWith('Pink', 0, 10, 'name,asc');
  });

  it('should toggle sort order', async () => {
    fixture.detectChanges();
    component.onSort();
    await new Promise(resolve => setTimeout(resolve, 400));
    expect(component.sortOrder()).toBe('desc');
    expect(artistFacadeSpy.getArtists).toHaveBeenCalledWith('', 0, 10, 'name,desc');
  });

  it('should call loadArtistAlbums when artist is clicked', async () => {
    fixture.detectChanges();
    const artist = mockArtists[0];
    component.onArtistClick(artist);
    expect(component.selectedArtist()).toEqual(artist);
    // O efeito chama loadArtistAlbums
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(artistFacadeSpy.loadArtistAlbums).toHaveBeenCalledWith(artist.id);
  });

  it('should navigate to add artist', () => {
    component.onAddArtist();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/artist/new']);
  });
});

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlbumDetailComponent } from './album-detail';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { AlbumService } from '../../services/album.service';
import { of, throwError } from 'rxjs';
import { convertToParamMap } from '@angular/router';

describe('AlbumDetailComponent', () => {
  let component: AlbumDetailComponent;
  let fixture: ComponentFixture<AlbumDetailComponent>;
  let albumServiceSpy: any;
  let routerSpy: any;

  const mockAlbum = { id: '1', title: 'Album 1', artists: [] };

  beforeEach(async () => {
    albumServiceSpy = {
      getAlbumById: vi.fn().mockReturnValue(of(mockAlbum))
    };
    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AlbumDetailComponent],
      providers: [
        provideRouter([]),
        { provide: AlbumService, useValue: albumServiceSpy },
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

  it('should load album on init', () => {
    fixture.detectChanges();
    expect(albumServiceSpy.getAlbumById).toHaveBeenCalledWith('1');
    expect(component.album()).toEqual(mockAlbum);
    expect(component.isLoading()).toBeFalsy();
  });

  it('should handle error when loading album', () => {
    albumServiceSpy.getAlbumById.mockReturnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();
    expect(component.isLoading()).toBeFalsy();
    expect(component.album()).toBeNull();
  });

  it('should navigate back to albums', () => {
    component.onBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/albums']);
  });

  it('should navigate to edit album', () => {
    component.album.set(mockAlbum as any);
    component.onEdit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/album', '1', 'edit']);
  });
});


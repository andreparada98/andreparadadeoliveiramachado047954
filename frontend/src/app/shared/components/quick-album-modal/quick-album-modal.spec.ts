import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickAlbumModalComponent } from './quick-album-modal';
import { AlbumService } from '../../../services/album.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('QuickAlbumModalComponent', () => {
  let component: QuickAlbumModalComponent;
  let fixture: ComponentFixture<QuickAlbumModalComponent>;
  let albumServiceSpy: any;

  beforeEach(async () => {
    albumServiceSpy = {
      createAlbum: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [QuickAlbumModalComponent, ReactiveFormsModule],
      providers: [
        { provide: AlbumService, useValue: albumServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuickAlbumModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when onClose is called', () => {
    const spy = vi.fn();
    component.close.subscribe(spy);
    component.onClose();
    expect(spy).toHaveBeenCalled();
  });

  it('should call createAlbum and emit saved on submit', () => {
    const mockAlbum = { id: '1', title: 'New Album' };
    albumServiceSpy.createAlbum.mockReturnValue(of(mockAlbum));
    const savedSpy = vi.fn();
    const closeSpy = vi.fn();
    component.saved.subscribe(savedSpy);
    component.close.subscribe(closeSpy);

    component.quickAlbumForm.patchValue({
      title: 'New Album',
      releasedAt: '2024-01-01'
    });

    component.onSubmit();

    expect(albumServiceSpy.createAlbum).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Album',
      releasedAt: '2024-01-01T00:00:00'
    }));
    expect(savedSpy).toHaveBeenCalledWith(mockAlbum);
    expect(closeSpy).toHaveBeenCalled();
    expect(component.isLoading()).toBeFalsy();
  });

  it('should handle error on submit', () => {
    albumServiceSpy.createAlbum.mockReturnValue(throwError(() => new Error('Error')));
    component.quickAlbumForm.patchValue({
      title: 'New Album',
      releasedAt: '2024-01-01'
    });

    component.onSubmit();

    expect(component.isLoading()).toBeFalsy();
  });
});


import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlbumCardComponent } from './album-card';
import { Album } from '../../models/album.model';

describe('AlbumCardComponent', () => {
  let component: AlbumCardComponent;
  let fixture: ComponentFixture<AlbumCardComponent>;

  const mockAlbum: Album = {
    id: '1',
    title: 'The Dark Side of the Moon',
    releasedAt: '1973-03-01T00:00:00',
    artists: [{ id: '1', name: 'Pink Floyd', albumCount: 5 }],
    coverUrl: 'http://example.com/cover.jpg'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('album', mockAlbum);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display album title and artists', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.album-title')?.textContent).toContain('The Dark Side of the Moon');
    expect(compiled.querySelector('.album-artists')?.textContent).toContain('Pink Floyd');
  });

  it('should display formatted release date', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.album-date')?.textContent).toBeTruthy();
  });

  it('should display the cover image when coverUrl is provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img');
    expect(img?.src).toBe('http://example.com/cover.jpg');
  });

  it('should display placeholder when no cover is provided', () => {
    fixture.componentRef.setInput('album', { ...mockAlbum, coverUrl: null, covers: [] });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.no-cover')).toBeTruthy();
    expect(compiled.querySelector('.no-cover-text')?.textContent).toContain('Sem capa');
  });

  it('should emit view output when view button is clicked', () => {
    const emitSpy = vi.spyOn(component.view, 'emit');
    const viewBtn = fixture.nativeElement.querySelector('.action-btn.view');
    viewBtn.click();
    expect(emitSpy).toHaveBeenCalledWith(mockAlbum);
  });

  it('should emit edit output when edit button is clicked', () => {
    const emitSpy = vi.spyOn(component.edit, 'emit');
    const editBtn = fixture.nativeElement.querySelector('.action-btn.edit');
    editBtn.click();
    expect(emitSpy).toHaveBeenCalledWith(mockAlbum);
  });
});


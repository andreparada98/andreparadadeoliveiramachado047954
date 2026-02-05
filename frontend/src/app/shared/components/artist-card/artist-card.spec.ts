import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ArtistCardComponent } from './artist-card';
import { Artist } from '../../models/artist.model';

describe('ArtistCardComponent', () => {
  let component: ArtistCardComponent;
  let fixture: ComponentFixture<ArtistCardComponent>;

  const mockArtist: Artist = {
    id: '1',
    name: 'Pink Floyd',
    albumCount: 5
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('artist', mockArtist);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display artist name and initial', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.name')?.textContent).toContain('Pink Floyd');
    expect(compiled.querySelector('.avatar-circle')?.textContent).toContain('P');
  });

  it('should display correct album count and label', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.album-count')?.textContent).toContain('5 albums');
  });

  it('should emit clicked output when card content is clicked', () => {
    const emitSpy = vi.spyOn(component.clicked, 'emit');
    const cardContent = fixture.nativeElement.querySelector('.card-content');
    cardContent.click();
    expect(emitSpy).toHaveBeenCalledWith(mockArtist);
  });

  it('should emit view output when view button is clicked', () => {
    const emitSpy = vi.spyOn(component.view, 'emit');
    const viewBtn = fixture.nativeElement.querySelector('.action-btn.view');
    viewBtn.click();
    expect(emitSpy).toHaveBeenCalledWith(mockArtist);
  });

  it('should emit edit output when edit button is clicked', () => {
    const emitSpy = vi.spyOn(component.edit, 'emit');
    const editBtn = fixture.nativeElement.querySelector('.action-btn.edit');
    editBtn.click();
    expect(emitSpy).toHaveBeenCalledWith(mockArtist);
  });
});


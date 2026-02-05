import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ArtistFormComponent } from './artist-form';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, provideRouter } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { of, throwError } from 'rxjs';

describe('ArtistFormComponent', () => {
  let component: ArtistFormComponent;
  let fixture: ComponentFixture<ArtistFormComponent>;
  let artistServiceSpy: any;
  let router: Router;

  beforeEach(async () => {
    artistServiceSpy = {
      getArtistById: vi.fn(),
      getArtistAlbums: vi.fn(),
      createArtist: vi.fn().mockReturnValue(of({})),
      updateArtist: vi.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [ArtistFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: ArtistService, useValue: artistServiceSpy },
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

    fixture = TestBed.createComponent(ArtistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be in creation mode by default', () => {
    expect(component.isEditMode()).toBeFalsy();
  });

  it('should be in edit mode when ID is provided', async () => {
    const mockArtist = { id: '1', name: 'Pink Floyd', description: 'Legendary band' };
    artistServiceSpy.getArtistById.mockReturnValue(of(mockArtist));
    artistServiceSpy.getArtistAlbums.mockReturnValue(of({ content: [] }));

    // Re-initialize with ID
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ArtistFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: ArtistService, useValue: artistServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { 
            params: of({ id: '1' }),
            paramMap: of({ get: () => '1' })
          }
        }
      ]
    }).compileComponents();

    const editFixture = TestBed.createComponent(ArtistFormComponent);
    const editComponent = editFixture.componentInstance;
    
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');

    editFixture.detectChanges();
    await editFixture.whenStable();

    expect(editComponent.isEditMode()).toBeTruthy();
    expect(artistServiceSpy.getArtistById).toHaveBeenCalledWith('1');
  });

  it('should call createArtist on submit in creation mode', () => {
    component.artistForm.patchValue({
      name: 'New Artist',
      description: 'Some description'
    });

    component.onSubmit();

    expect(artistServiceSpy.createArtist).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Artist'
    }));
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should call updateArtist on submit in edit mode', () => {
    component.artistId.set('1');
    component.isEditMode.set(true);
    component.artistForm.patchValue({
      name: 'Updated Artist',
      description: 'New description'
    });

    component.onSubmit();

    expect(artistServiceSpy.updateArtist).toHaveBeenCalledWith('1', expect.objectContaining({
      name: 'Updated Artist'
    }));
  });
});

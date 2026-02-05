import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectManyArtistsComponent } from './select-many-artists';
import { ArtistService } from '../../../services/artist.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { XSelectManyComponent } from '../x-select-many/x-select-many';

describe('SelectManyArtistsComponent', () => {
  let component: SelectManyArtistsComponent;
  let fixture: ComponentFixture<SelectManyArtistsComponent>;
  let artistServiceSpy: any;

  const mockArtistsResponse = {
    content: [
      { id: '1', name: 'Artist 1' },
      { id: '2', name: 'Artist 2' }
    ],
    page: { totalElements: 2 }
  };

  beforeEach(async () => {
    artistServiceSpy = {
      getArtists: vi.fn().mockReturnValue(of(mockArtistsResponse))
    };

    await TestBed.configureTestingModule({
      imports: [SelectManyArtistsComponent, FormsModule, XSelectManyComponent],
      providers: [
        { provide: ArtistService, useValue: artistServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectManyArtistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load artists on init', () => {
    expect(artistServiceSpy.getArtists).toHaveBeenCalled();
    expect(component.artistOptions().length).toBe(2);
    expect(component.artistOptions()[0]).toEqual({ id: '1', label: 'Artist 1' });
  });

  it('should call onChange when value changes', () => {
    const spy = vi.fn();
    component.registerOnChange(spy);
    
    component.onValueChange(['1', '2']);
    
    expect(component.value()).toEqual(['1', '2']);
    expect(spy).toHaveBeenCalledWith(['1', '2']);
  });

  it('should update internal value when writeValue is called', () => {
    component.writeValue(['1']);
    expect(component.value()).toEqual(['1']);
  });
});


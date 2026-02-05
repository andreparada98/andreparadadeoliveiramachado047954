import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectManyAlbumsComponent } from './select-many-albums';
import { AlbumService } from '../../../services/album.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { XSelectManyComponent } from '../x-select-many/x-select-many';

describe('SelectManyAlbumsComponent', () => {
  let component: SelectManyAlbumsComponent;
  let fixture: ComponentFixture<SelectManyAlbumsComponent>;
  let albumServiceSpy: any;

  const mockAlbumsResponse = {
    content: [
      { id: '1', title: 'Album 1' },
      { id: '2', title: 'Album 2' }
    ],
    page: { totalElements: 2 }
  };

  beforeEach(async () => {
    albumServiceSpy = {
      getAlbums: vi.fn().mockReturnValue(of(mockAlbumsResponse))
    };

    await TestBed.configureTestingModule({
      imports: [SelectManyAlbumsComponent, FormsModule, XSelectManyComponent],
      providers: [
        { provide: AlbumService, useValue: albumServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectManyAlbumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load albums on init', () => {
    expect(albumServiceSpy.getAlbums).toHaveBeenCalled();
    expect(component.albumOptions().length).toBe(2);
    expect(component.albumOptions()[0]).toEqual({ id: '1', label: 'Album 1' });
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

  it('should refresh albums when refresh is called', () => {
    component.refresh();
    expect(albumServiceSpy.getAlbums).toHaveBeenCalledTimes(2);
  });
});


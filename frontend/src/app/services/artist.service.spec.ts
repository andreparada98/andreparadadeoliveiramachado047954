import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ArtistService } from './artist.service';
import { environment } from '../../environments/environment';
import { PageResponse, Artist } from '../shared/models/artist.model';

describe('ArtistService', () => {
  let service: ArtistService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ArtistService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(ArtistService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch artists with pagination and filters', () => {
    const mockResponse: PageResponse<Artist> = {
      content: [{ id: '1', name: 'Pink Floyd', albumCount: 5 }],
      page: { size: 12, number: 0, totalElements: 1, totalPages: 1 }
    };

    service.getArtists({ name: 'Pink' }).subscribe(response => {
      expect(response.content.length).toBe(1);
      expect(response.content[0].name).toBe('Pink Floyd');
    });

    const req = httpMock.expectOne(request => 
      request.url === `${environment.apiUrl}/artist` &&
      request.params.get('name') === 'Pink' &&
      request.params.get('page') === '0'
    );
    
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch artist by id', () => {
    const mockArtist: Artist = { id: '1', name: 'Pink Floyd', albumCount: 5 };

    service.getArtistById('1').subscribe(artist => {
      expect(artist.name).toBe('Pink Floyd');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/artist/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockArtist);
  });

  it('should create an artist', () => {
    const newArtist = { name: 'New Artist' };
    const mockResponse: Artist = { id: '2', name: 'New Artist', albumCount: 0 };

    service.createArtist(newArtist).subscribe(artist => {
      expect(artist.id).toBe('2');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/artist`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newArtist);
    req.flush(mockResponse);
  });
});


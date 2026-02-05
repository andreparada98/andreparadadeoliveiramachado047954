import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AlbumService, AlbumRequest } from './album.service';
import { environment } from '../../environments/environment';
import { Album } from '../shared/models/album.model';
import { PageResponse } from '../shared/models/artist.model';

describe('AlbumService', () => {
  let service: AlbumService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AlbumService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(AlbumService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch albums with filters', () => {
    const mockResponse: PageResponse<Album> = {
      content: [{ id: '1', title: 'The Dark Side of the Moon', releasedAt: '1973-03-01', artists: [] }],
      page: { size: 12, number: 0, totalElements: 1, totalPages: 1 }
    };

    service.getAlbums({ title: 'Dark Side' }).subscribe(response => {
      expect(response.content.length).toBe(1);
      expect(response.content[0].title).toBe('The Dark Side of the Moon');
    });

    const req = httpMock.expectOne(request => 
      request.url === `${environment.apiUrl}/album` &&
      request.params.get('title') === 'Dark Side'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create an album', () => {
    const newAlbum: AlbumRequest = {
      title: 'New Album',
      releasedAt: '2024-01-01',
      artistIds: ['artist-1']
    };
    const mockResponse: Album = { id: 'album-123', ...newAlbum, artists: [] };

    service.createAlbum(newAlbum).subscribe(album => {
      expect(album.id).toBe('album-123');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/album`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newAlbum);
    req.flush(mockResponse);
  });
});


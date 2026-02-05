import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { FileService, FileResponse } from './file.service';
import { environment } from '../../environments/environment';

describe('FileService', () => {
  let service: FileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FileService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(FileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload a file', () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const mockResponse: FileResponse = {
      id: 'file-123',
      name: 'test.jpg',
      size: 0,
      mimeType: 'image/jpeg',
      url: 'http://example.com/test.jpg'
    };

    service.upload(mockFile).subscribe(response => {
      expect(response.id).toBe('file-123');
      expect(response.url).toBe('http://example.com/test.jpg');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/file/upload`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    req.flush(mockResponse);
  });

  it('should fetch file by id', () => {
    const mockResponse: FileResponse = {
      id: 'file-123',
      name: 'test.jpg',
      size: 0,
      mimeType: 'image/jpeg',
      url: 'http://example.com/test.jpg'
    };

    service.getFileById('file-123').subscribe(response => {
      expect(response.name).toBe('test.jpg');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/file/file-123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});


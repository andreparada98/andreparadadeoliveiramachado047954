import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token and refreshToken in localStorage', () => {
    const mockResponse = { token: 'fake-jwt-token', refreshToken: 'fake-refresh-token' };
    const credentials = { username: 'admin', password: 'password' };

    service.login(credentials).subscribe(response => {
      expect(response.token).toBe('fake-jwt-token');
      expect(response.refreshToken).toBe('fake-refresh-token');
      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
      expect(localStorage.getItem('refreshToken')).toBe('fake-refresh-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should refresh and update tokens in localStorage', () => {
    localStorage.setItem('refreshToken', 'old-refresh-token');
    const mockResponse = { token: 'new-token', refreshToken: 'new-refresh-token' };

    service.refresh().subscribe(response => {
      expect(response.token).toBe('new-token');
      expect(localStorage.getItem('token')).toBe('new-token');
      expect(localStorage.getItem('refreshToken')).toBe('new-refresh-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/refresh`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ refreshToken: 'old-refresh-token' });
    req.flush(mockResponse);
  });

  it('should logout and remove all tokens from localStorage', () => {
    localStorage.setItem('token', 'some-token');
    localStorage.setItem('refreshToken', 'some-refresh-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  it('should return token from localStorage', () => {
    localStorage.setItem('token', 'test-token');
    expect(service.getToken()).toBe('test-token');
  });

  it('should check if user is logged in', () => {
    expect(service.isLoggedIn()).toBe(false);
    localStorage.setItem('token', 'test-token');
    expect(service.isLoggedIn()).toBe(true);
  });
});


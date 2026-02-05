import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HealthService } from './health.service';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

describe('HealthService', () => {
  let service: HealthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HealthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(HealthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true when liveness is UP', async () => {
    const promise = firstValueFrom(service.getLiveness());
    
    const req = httpMock.expectOne(`${environment.apiUrl}/actuator/health/liveness`);
    expect(req.request.method).toBe('GET');
    req.flush({ status: 'UP' });

    const status = await promise;
    expect(status).toBe(true);
  });

  it('should return false when liveness is DOWN', async () => {
    const promise = firstValueFrom(service.getLiveness());

    const req = httpMock.expectOne(`${environment.apiUrl}/actuator/health/liveness`);
    req.flush({ status: 'DOWN' });

    const status = await promise;
    expect(status).toBe(false);
  });

  it('should return false on liveness error', async () => {
    const promise = firstValueFrom(service.getLiveness());

    const req = httpMock.expectOne(`${environment.apiUrl}/actuator/health/liveness`);
    req.error(new ProgressEvent('Network error'));

    const status = await promise;
    expect(status).toBe(false);
  });
});

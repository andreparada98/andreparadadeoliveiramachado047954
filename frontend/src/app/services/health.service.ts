import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, startWith, switchMap, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface HealthStatus {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getLiveness(): Observable<boolean> {
    return this.http.get<HealthStatus>(`${this.baseUrl}/actuator/health/liveness`).pipe(
      map(res => res.status === 'UP'),
      catchError(() => of(false))
    );
  }

  getReadiness(): Observable<boolean> {
    return this.http.get<HealthStatus>(`${this.baseUrl}/actuator/health/readiness`).pipe(
      map(res => res.status === 'UP'),
      catchError(() => of(false))
    );
  }

  pollLiveness(): Observable<boolean> {
    return interval(30000).pipe( 
      startWith(0),
      switchMap(() => this.getLiveness())
    );
  }

  pollReadiness(): Observable<boolean> {
    return interval(30000).pipe(
      startWith(0),
      switchMap(() => this.getReadiness())
    );
  }
}


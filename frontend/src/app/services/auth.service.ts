import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/auth`; 

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
      })
    )
  }

  refresh(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}


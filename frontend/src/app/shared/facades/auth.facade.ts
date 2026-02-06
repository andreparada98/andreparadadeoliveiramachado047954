import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { BaseComponent } from '../helpers/base-component';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade extends BaseComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated = signal<boolean>(!!this.authService.getToken());
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  login(credentials: any): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(credentials)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.isAuthenticated.set(true);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('AuthFacade: Login error:', err);
          this.errorMessage.set(this.handleAuthError(err));
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  refreshToken(): void {
    this.authService.refresh()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        error: (err) => {
          console.error('AuthFacade: Refresh token error:', err);
          this.logout();
        }
      });
  }

  getToken(): string | null {
    return this.authService.getToken();
  }

  private handleAuthError(error: any): string {
    if (error.status === 401) {
      return 'Usuário ou senha inválidos.';
    }
    if (error.status === 403) {
      return 'Você não tem permissão para acessar este recurso.';
    }
    return 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
  }
}

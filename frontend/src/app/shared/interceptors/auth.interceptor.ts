import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();
  let request = req;

  if (token) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Se der 401 e não for a própria rota de refresh ou login
      if (error.status === 401 && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/login')) {
        return authService.refresh().pipe(
          switchMap((response) => {
            // Retry original request with new token
            const newRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.token}`
              }
            });
            return next(newRequest);
          }),
          catchError((refreshError) => {
            // Se o refresh também falhar (401), desloga e vai para login
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      // Se for 401 na própria rota de refresh ou login, desloga direto
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};


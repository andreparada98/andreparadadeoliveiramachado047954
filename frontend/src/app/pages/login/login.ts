import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { XInputComponent } from '../../shared/components/x-input/x-input';
import { XButtonComponent } from '../../shared/components/x-button/x-button';
import { BaseComponent } from '../../shared/helpers/base-component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'XLogin',
  standalone: true,
  imports: [ReactiveFormsModule, XInputComponent, XButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent extends BaseComponent{
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  onSubmit(): void {
    if (!this.loginForm.valid) return
      this.isLoading.set(true);
      this.errorMessage.set(null);
      
      const credentials = {
        username: this.loginForm.value.username!,
        password: this.loginForm.value.password!
      };

      this.authService.login(credentials).pipe(takeUntil(this.unsubscribe)).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set('Usuário ou senha inválidos');
          console.error('Login error', err);
        }
      })
    
  }
}


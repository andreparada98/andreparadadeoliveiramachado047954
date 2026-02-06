import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { XInputComponent } from '../../shared/components/x-input/x-input';
import { XButtonComponent } from '../../shared/components/x-button/x-button';
import { BaseComponent } from '../../shared/helpers/base-component';
import { takeUntil } from 'rxjs';
import { AuthFacade } from '../../shared/facades/auth.facade';

@Component({
  selector: 'XLogin',
  standalone: true,
  imports: [ReactiveFormsModule, XInputComponent, XButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent extends BaseComponent {
  private fb = inject(FormBuilder);
  readonly authFacade = inject(AuthFacade);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (!this.loginForm.valid) return;
    
    const credentials = {
      username: this.loginForm.value.username!,
      password: this.loginForm.value.password!
    };

    this.authFacade.login(credentials);
  }
}


import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { AuthFacade } from '../../shared/facades/auth.facade';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authFacadeSpy: any;

  beforeEach(async () => {
    authFacadeSpy = {
      login: vi.fn(),
      isAuthenticated: signal(false),
      isLoading: signal(false),
      errorMessage: signal<string | null>(null)
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthFacade, useValue: authFacadeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should call authFacade.login on submit', () => {
    component.loginForm.patchValue({
      username: 'admin',
      password: 'admin'
    });
    
    component.onSubmit();

    expect(authFacadeSpy.login).toHaveBeenCalledWith({
      username: 'admin',
      password: 'admin'
    });
  });

  it('should reflect loading state from facade', () => {
    authFacadeSpy.isLoading.set(true);
    fixture.detectChanges();
    expect(component.authFacade.isLoading()).toBe(true);
  });

  it('should reflect error message from facade', () => {
    authFacadeSpy.errorMessage.set('Invalid credentials');
    fixture.detectChanges();
    expect(component.authFacade.errorMessage()).toBe('Invalid credentials');
  });
});

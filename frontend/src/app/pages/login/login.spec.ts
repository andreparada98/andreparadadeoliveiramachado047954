import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: any;
  let routerSpy: any;

  beforeEach(async () => {
    authServiceSpy = {
      login: vi.fn()
    };
    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
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

  it('should call authService.login and navigate on success', () => {
    authServiceSpy.login.mockReturnValue(of({ token: 'fake-token' }));
    
    component.loginForm.patchValue({
      username: 'admin',
      password: 'admin'
    });
    
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      username: 'admin',
      password: 'admin'
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set error message on login failure', () => {
    authServiceSpy.login.mockReturnValue(throwError(() => new Error('Invalid credentials')));
    
    component.loginForm.patchValue({
      username: 'wrong',
      password: 'wrong'
    });
    
    component.onSubmit();

    expect(component.errorMessage()).toBe('Usuário ou senha inválidos');
    expect(component.isLoading()).toBeFalsy();
  });
});


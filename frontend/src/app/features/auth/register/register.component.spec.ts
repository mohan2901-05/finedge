import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError, Observable } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  class MockAuthService {
    register = () => of({ userId: 'USR-1', userName: 'New User', userEmail: 'new@example.invalid' });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useClass: MockAuthService }
      ]
    });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show required-field validation for name', () => {
    fixture.detectChanges();
    component.onSubmit();
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.alert-error');
    expect(errorEl.textContent).toContain('Full name is required.');
    expect(component.submitted()).toBe(true);
  });

  it('should show required-field validation for email', () => {
    component.form.userName = 'Test User';
    fixture.detectChanges();
    component.onSubmit();
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.alert-error');
    expect(errorEl.textContent).toContain('Email is required.');
  });

  it('should show invalid email validation', () => {
    component.form.userName = 'Test User';
    component.form.userEmail = 'not-an-email';
    component.form.password = 'password123';
    fixture.detectChanges();
    component.onSubmit();
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.alert-error');
    expect(errorEl.textContent).toContain('valid email address');
  });

  it('should show required-field validation for password', () => {
    component.form.userName = 'Test User';
    component.form.userEmail = 'user@example.com';
    fixture.detectChanges();
    component.onSubmit();
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.alert-error');
    expect(errorEl.textContent).toContain('Password is required.');
  });

  it('should successfully register and show success message', () => {
    component.form.userName = 'New User';
    component.form.userEmail = 'new@example.invalid';
    component.form.password = 'secret123';
    fixture.detectChanges();

    component.onSubmit();
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    const successEl = fixture.nativeElement.querySelector('.alert-success');
    expect(successEl.textContent).toContain('Registration complete');
  });

  it('should show error on registration failure', () => {
    const service = TestBed.inject(AuthService);
    (service as any).register = () =>
      throwError(() => ({ error: { message: 'Email already exists' } }));

    component.form.userName = 'New User';
    component.form.userEmail = 'existing@example.invalid';
    component.form.password = 'secret123';
    fixture.detectChanges();

    component.onSubmit();
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.alert-error');
    expect(errorEl.textContent).toContain('Email already exists');
    expect(component.loading()).toBe(false);
  });

  it('should disable submission while request is in progress', () => {
    const service = TestBed.inject(AuthService);
    let release: (() => void) | null = null;
    const pending = new Observable<any>((observer) => {
      release = () => observer.next({ userId: 'USR-1', userName: 'X', userEmail: 'x@e.in' });
    });
    (service as any).register = () => pending;

    component.form.userName = 'New User';
    component.form.userEmail = 'new@example.invalid';
    component.form.password = 'secret123';
    fixture.detectChanges();

    // Form is valid, button should be enabled
    const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitBtn.disabled).toBe(false);

    component.onSubmit();
    fixture.detectChanges();

    expect(component.loading()).toBe(true);
    expect(submitBtn.disabled).toBe(true);

    release!();
    fixture.detectChanges();
    expect(component.loading()).toBe(false);
  });

  it('should not assume an access token is returned on successful registration', () => {
    const service = TestBed.inject(AuthService);
    (service as any).register = () => of({ userId: 'USR-1', userName: 'X', userEmail: 'x@e.in' });

    sessionStorage.clear();

    component.form.userName = 'New User';
    component.form.userEmail = 'new@example.invalid';
    component.form.password = 'secret123';
    fixture.detectChanges();

    component.onSubmit();
    fixture.detectChanges();

    // Registration returns only UserDTO; no session/token should be set
    expect(sessionStorage.getItem('finedge_auth_token')).toBeNull();
    const successEl = fixture.nativeElement.querySelector('.alert-success');
    expect(successEl.textContent).toContain('Registration complete');

    sessionStorage.clear();
  });
});

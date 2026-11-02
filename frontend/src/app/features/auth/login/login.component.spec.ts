import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError, Observable } from 'rxjs';
import { vi } from 'vitest';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  class MockAuthService {
    login = () => of({
      accessToken: 'access-token-value',
      tokenType: 'Bearer',
      expiresIn: 3600,
      expiresAt: '2099-01-01T00:00:00Z',
      user: { userId: 'USR-1', orgId: 'ORG-1', roleId: 'ROLE-1', userName: 'User', userEmail: 'user@example.invalid', status: 'ACTIVE', createdDatetime: '', updatedDatetime: '' }
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useClass: MockAuthService }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show required-field validation for email', () => {
    fixture.detectChanges();
    component.onSubmit();
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.alert-error');
    expect(errorEl.textContent).toContain('Email is required.');
    expect(component.submitted()).toBe(true);
  });

  it('should show required-field validation for password', () => {
    component.form.userEmail = 'user@example.com';
    fixture.detectChanges();
    component.onSubmit();
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.alert-error');
    expect(errorEl.textContent).toContain('Password is required.');
  });

  it('should show invalid email validation', () => {
    component.form.userEmail = 'not-an-email';
    component.form.password = 'password123';
    fixture.detectChanges();
    component.onSubmit();
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.alert-error');
    expect(errorEl.textContent).toContain('valid email address');
  });

  it('should navigate to /borrower on successful login', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');

    component.form.userEmail = 'user@example.invalid';
    component.form.password = 'secret123';
    fixture.detectChanges();

    component.onSubmit();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith('/borrower');
    expect(component.loading()).toBe(false);
  });

  it('should show error on failed login', () => {
    const service = TestBed.inject(AuthService);
    (service as any).login = () =>
      throwError(() => ({ error: { message: 'Invalid credentials' } }));

    component.form.userEmail = 'user@example.invalid';
    component.form.password = 'wrong';
    fixture.detectChanges();

    component.onSubmit();
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.alert-error');
    expect(errorEl.textContent).toContain('Invalid credentials');
    expect(component.loading()).toBe(false);
  });

  it('should disable submission while request is in progress', () => {
    const service = TestBed.inject(AuthService);
    let release: (() => void) | null = null;
    const pending = new Observable<any>((observer) => {
      release = () => observer.next({
        accessToken: 'token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        expiresAt: '2099-01-01T00:00:00Z',
        user: { userId: 'USR-1', userName: 'X', userEmail: 'x@e.in', status: 'ACTIVE', orgId: 'ORG-1', roleId: 'ROLE-1', createdDatetime: '', updatedDatetime: '' }
      });
    });
    (service as any).login = () => pending;

    component.form.userEmail = 'user@example.invalid';
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

  it('should not store the password in browser storage', () => {
    component.form.userEmail = 'user@example.invalid';
    component.form.password = 'secret123';
    fixture.detectChanges();

    component.onSubmit();
    fixture.detectChanges();

    expect(sessionStorage.getItem('password')).toBeNull();
  });
});

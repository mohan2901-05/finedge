import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { requireAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('requireAuthGuard', () => {
  let authServiceSpy: { isAuthenticated: () => boolean };
  let router: Router;

  beforeEach(() => {
    authServiceSpy = {
      isAuthenticated: () => false,
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('redirects unauthenticated user accessing protected route to /auth/login', () => {
    authServiceSpy.isAuthenticated = () => false;

    TestBed.runInInjectionContext(() => {
      const result: any = requireAuthGuard(null, { url: '/borrower' });
      expect(result).toBeDefined();
      expect(result.redirectTo).toBeDefined();
      expect(router.serializeUrl(result.redirectTo)).toBe('/auth/login');
    });
  });

  it('allows unauthenticated user to access /auth/login', () => {
    authServiceSpy.isAuthenticated = () => false;

    TestBed.runInInjectionContext(() => {
      const result = requireAuthGuard(null, { url: '/auth/login' });
      expect(result).toBe(true);
    });
  });

  it('allows unauthenticated user to access /auth/register', () => {
    authServiceSpy.isAuthenticated = () => false;

    TestBed.runInInjectionContext(() => {
      const result = requireAuthGuard(null, { url: '/auth/register' });
      expect(result).toBe(true);
    });
  });

  it('allows authenticated user to access protected route /borrower', () => {
    authServiceSpy.isAuthenticated = () => true;

    TestBed.runInInjectionContext(() => {
      const result = requireAuthGuard(null, { url: '/borrower' });
      expect(result).toBe(true);
    });
  });

  it('redirects authenticated user accessing /auth/login to /borrower', () => {
    authServiceSpy.isAuthenticated = () => true;

    TestBed.runInInjectionContext(() => {
      const result: any = requireAuthGuard(null, { url: '/auth/login' });
      expect(result).toBeDefined();
      expect(result.redirectTo).toBeDefined();
      expect(router.serializeUrl(result.redirectTo)).toBe('/borrower');
    });
  });
});


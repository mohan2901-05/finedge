import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import {
  AuthService,
  AUTH_EXPIRES_AT_KEY,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY
} from './auth.service';
import { environment } from '../../environments/environment';
import { AuthResponse, User } from './models';

const LOGIN_URL = `${environment.apiUrl}/etfdb/auth/login`;
const REGISTER_URL = `${environment.apiUrl}/etfdb/auth/register`;

const TEST_USER: User = {
  userId: 'USR-1',
  orgId: 'ORG-1',
  roleId: 'ROLE-BORROWER',
  roleName: 'Borrower',
  userName: 'Test User',
  userEmail: 'user@example.invalid',
  status: 'ACTIVE',
  createdDatetime: '2026-01-01T00:00:00Z',
  updatedDatetime: '2026-01-01T00:00:00Z'
};

const TEST_LOGIN_RESPONSE: AuthResponse = {
  accessToken: 'access-token-value',
  tokenType: 'Bearer',
  expiresIn: 3600,
  expiresAt: '2099-01-01T00:00:00Z',
  user: TEST_USER
};

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    sessionStorage.clear();
  });

  it('login posts credentials to the login endpoint', () => {
    service
      .login({ userEmail: 'user@example.invalid', password: 'secret' })
      .subscribe();

    const req = http.expectOne(LOGIN_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      userEmail: 'user@example.invalid',
      password: 'secret'
    });
    req.flush(TEST_LOGIN_RESPONSE);
  });

  it('successful login stores the token and user information', () => {
    service.login({ userEmail: 'u@e.invalid', password: 'pw' }).subscribe();
    http.expectOne(LOGIN_URL).flush(TEST_LOGIN_RESPONSE);

    expect(service.getToken()).toBe('access-token-value');
    expect(service.isAuthenticated()).toBe(true);
    expect(service.getCurrentUser()).toEqual(TEST_USER);
    expect(sessionStorage.getItem(AUTH_TOKEN_KEY)).toBe('access-token-value');
    expect(sessionStorage.getItem(AUTH_EXPIRES_AT_KEY)).toBe(
      TEST_LOGIN_RESPONSE.expiresAt
    );
    expect(sessionStorage.getItem(AUTH_USER_KEY)).toBe(
      JSON.stringify(TEST_USER)
    );
    // Passwords are never stored.
    expect(sessionStorage.getItem('password')).toBeNull();
  });

  it('registration posts to the register endpoint', () => {
    service
      .register({
        userName: 'New User',
        password: 'secret',
        userEmail: 'new@example.invalid',
        dob: '1990-01-01',
        panNo: 'ABCDE1234F'
      })
      .subscribe();

    const req = http.expectOne(REGISTER_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      userName: 'New User',
      password: 'secret',
      userEmail: 'new@example.invalid',
      dob: '1990-01-01',
      panNo: 'ABCDE1234F'
    });
    req.flush(TEST_USER);
  });

  it('registration does not assume an access token in a UserDTO response', () => {
    service.register({ userName: 'N', password: 'pw', userEmail: 'n@e.in' }).subscribe();
    http.expectOne(REGISTER_URL).flush(TEST_USER);

    // Registration returns only UserDTO; no session must be created.
    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
    expect(sessionStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
  });

  it('getToken returns null when no token is stored', () => {
    expect(service.getToken()).toBeNull();
  });

  it('isAuthenticated returns false with no token and no expiry', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('isAuthenticated returns true for a non-expired token', () => {
    sessionStorage.setItem(AUTH_TOKEN_KEY, 'valid-token');
    sessionStorage.setItem(AUTH_EXPIRES_AT_KEY, '2099-01-01T00:00:00Z');

    expect(service.isAuthenticated()).toBe(true);
  });

  it('isAuthenticated returns false for an expired token', () => {
    sessionStorage.setItem(AUTH_TOKEN_KEY, 'expired-token');
    sessionStorage.setItem(AUTH_EXPIRES_AT_KEY, '2000-01-01T00:00:00Z');

    expect(service.isAuthenticated()).toBe(false);
    // An expired token must not be treated as authenticated merely because it exists.
    expect(service.getToken()).toBe('expired-token');
  });

  it('isAuthenticated returns false when expiry cannot be determined', () => {
    sessionStorage.setItem(AUTH_TOKEN_KEY, 'token-no-expiry');

    expect(service.isAuthenticated()).toBe(false);
  });

  it('logout clears all authentication data', () => {
    sessionStorage.setItem(AUTH_TOKEN_KEY, 'some-token');
    sessionStorage.setItem(AUTH_EXPIRES_AT_KEY, '2099-01-01T00:00:00Z');
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(TEST_USER));

    service.logout();

    expect(sessionStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
    expect(sessionStorage.getItem(AUTH_EXPIRES_AT_KEY)).toBeNull();
    expect(sessionStorage.getItem(AUTH_USER_KEY)).toBeNull();
    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
  });
});

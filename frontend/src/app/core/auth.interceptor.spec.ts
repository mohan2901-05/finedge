import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { authInterceptor, AUTH_TOKEN_KEY } from './auth.interceptor';
import { environment } from '../../environments/environment';

const API_USERS_URL = `${environment.apiUrl}/etfdb/users`;
const EXTERNAL_URL = 'https://example.com/unrelated/endpoint';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
    sessionStorage.clear();
  });

  function setAuthenticated(token = 'stored-access-token') {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    // Future expiry so the token is treated as authenticated.
    sessionStorage.setItem('finedge_auth_expires_at', '2099-01-01T00:00:00Z');
  }

  it('attaches the Bearer token to a request targeting the backend API', () => {
    setAuthenticated();

    http.get(API_USERS_URL).subscribe();

    const req = backend.expectOne(API_USERS_URL);
    expect(req.request.headers.get('Authorization')).toBe(
      'Bearer stored-access-token'
    );
    req.flush([]);
  });

  it('does not attach a token when none exists', () => {
    // No session data at all.
    http.get(API_USERS_URL).subscribe();

    const req = backend.expectOne(API_USERS_URL);
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush([]);
  });

  it('does not overwrite an existing Authorization header', () => {
    setAuthenticated();

    http
      .get(API_USERS_URL, {
        headers: new HttpHeaders({ Authorization: 'Bearer existing-value' })
      })
      .subscribe();

    const req = backend.expectOne(API_USERS_URL);
    expect(req.request.headers.get('Authorization')).toBe(
      'Bearer existing-value'
    );
    req.flush([]);
  });

  it('does not leak the token to unrelated external origins', () => {
    setAuthenticated();

    http.get(EXTERNAL_URL).subscribe();

    const req = backend.expectOne(EXTERNAL_URL);
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush({});
  });

  it('does not modify requests to unrelated URLs', () => {
    setAuthenticated();

    http
      .get(EXTERNAL_URL, {
        headers: new HttpHeaders({ 'X-Custom': 'preserve-me' })
      })
      .subscribe();

    const req = backend.expectOne(EXTERNAL_URL);
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(req.request.headers.get('X-Custom')).toBe('preserve-me');
    req.flush({});
  });

  it('does not attach the token to authentication endpoints', () => {
    setAuthenticated();

    const registerUrl = `${environment.apiUrl}/etfdb/auth/register`;
    http.post(registerUrl, { userName: 'n', password: 'p', userEmail: 'e@e.in' }).subscribe();

    const req = backend.expectOne(registerUrl);
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush({ userId: 'USR-1' });
  });
});

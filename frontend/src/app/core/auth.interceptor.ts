import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { AuthService, AUTH_TOKEN_KEY } from './auth.service';
import { environment } from '../../environments/environment';

/**
 * Functional HTTP interceptor that attaches a Bearer token to requests aimed at
 * the configured backend API.
 *
 * Restrictions:
 *  - Token is attached only to URLs originating from environment.apiUrl.
 *  - Token is never attached to authentication endpoints (register/login), which
 *    are public and do not require (or benefit from) a client token.
 *  - An existing Authorization header is never overwritten.
 *  - Unrelated headers and third-party origins are left untouched.
 *
 * Error handling (D5.2): failed requests are re-thrown as-is. No automatic
 * retry, no redirect on 401/403, and no outgoing HTTP request from the error
 * handler. Route-guard and redirect behaviour is deferred to D5.5.
 */
export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  const isApiOrigin = req.url.startsWith(environment.apiUrl);
  const isAuthEndpoint = req.url.includes('/etfdb/auth/');
  const isAuthenticated = authService.isAuthenticated();
  const existingAuth = req.headers.get('Authorization');

  let request = req;
  if (isApiOrigin && !isAuthEndpoint && isAuthenticated && !existingAuth) {
    const token = authService.getToken();
    if (token) {
      request = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }
  }

  return next(request).pipe(
    catchError((error: unknown) => {
      // No retry, no redirect, no outgoing validation request in this phase.
      return throwError(() => error);
    })
  );
}

export { AUTH_TOKEN_KEY };

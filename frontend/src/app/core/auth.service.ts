import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import {
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthResponse,
  User
} from './models';
import { environment } from '../../environments/environment';

/**
 * sessionStorage key under which the access token is kept.
 *
 * sessionStorage (rather than localStorage) is used so the token is cleared
 * when the tab/session ends, shortening the reuse window for a stolen token.
 * The token is never persisted across browser restarts.
 */
export const AUTH_TOKEN_KEY = 'finedge_auth_token';

/**
 * sessionStorage key under which the login expiry instant (ISO-8601 UTC) is kept.
 */
export const AUTH_EXPIRES_AT_KEY = 'finedge_auth_expires_at';

/**
 * sessionStorage key under which the logged-in user summary is kept.
 */
export const AUTH_USER_KEY = 'finedge_auth_user';

const AUTH_BASE = '/etfdb/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  /** Registers a new borrower user. Returns the backend UserDTO only; the
    backend does not issue a token for registration, so no session is created. */
  register(body: AuthRegisterRequest): Observable<User> {
    return this.api.post<User>(`${AUTH_BASE}/register`, body);
  }

  /** Authenticates email/password and persists the issued token, expiry and
   user summary. Returns the backend AuthResponse. */
  login(body: AuthLoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(`${AUTH_BASE}/login`, body).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  /** Clears all authentication data from sessionStorage. */
  logout(): void {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_EXPIRES_AT_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
  }

  /** Returns the stored access token, or null when none is stored. */
  getToken(): string | null {
    return sessionStorage.getItem(AUTH_TOKEN_KEY) ?? null;
  }

  /**
   * Returns true only when a token is stored and it has not locally expired.
   *
   * Client-side expiry is a best-effort hint: a token may be expired client-side
   * yet still valid server-side (clock skew) or revoked server-side while still
   * appearing valid client-side. The backend remains authoritative for token
   * validity and authorisation; this method never validates a signature.
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const expiresAtRaw = sessionStorage.getItem(AUTH_EXPIRES_AT_KEY);
    if (!expiresAtRaw) {
      // Cannot confirm validity without an expiry; treat as unauthenticated.
      return false;
    }

    const expiresAt = new Date(expiresAtRaw).getTime();
    if (Number.isNaN(expiresAt)) {
      return false;
    }

    return Date.now() < expiresAt;
  }

  /** Returns the stored logged-in user, or null when none is stored. */
  getCurrentUser(): User | null {
    const raw = sessionStorage.getItem(AUTH_USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  private persistSession(response: AuthResponse): void {
    sessionStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
    if (response.expiresAt) {
      sessionStorage.setItem(AUTH_EXPIRES_AT_KEY, response.expiresAt);
    }
    if (response.user) {
      sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
    }
  }
}

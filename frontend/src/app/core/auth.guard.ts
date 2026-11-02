import { inject } from '@angular/core';
import {
  CanActivateFn,
  CanMatchFn,
  RedirectCommand,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Functional route guard that requires authentication.
 *
 * - Unauthenticated users are redirected to /auth/login.
 * - Already-authenticated users attempting to access auth pages
 *   (login/register) are redirected to /borrower.
 */
export function requireAuthGuard(
  route?: any,
  state?: any
): boolean | RedirectCommand {
  const authService = inject(AuthService);
  const router = inject(Router);

  const segments = Array.isArray(state) ? state : null;
  const targetUrl: string =
    segments != null
      ? '/' + segments.map((s: any) => s.path).join('/')
      : state?.url ?? router.url;

  const isAuthPage =
    targetUrl.startsWith('/auth/login') || targetUrl.startsWith('/auth/register');

  if (!authService.isAuthenticated()) {
    if (isAuthPage) {
      return true;
    }
    return new RedirectCommand(router.parseUrl('/auth/login'));
  }

  if (isAuthPage) {
    return new RedirectCommand(router.parseUrl('/borrower'));
  }

  return true;
}

export const canActivateAuth: CanActivateFn = requireAuthGuard;
export const canMatchAuth: CanMatchFn = requireAuthGuard;

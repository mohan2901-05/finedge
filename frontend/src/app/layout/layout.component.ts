import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { LogoComponent } from '../shared/logo.component';
import { AuthService } from '../core/auth.service';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, LogoComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly notifications = inject(NotificationService);

  readonly collapsed = signal(false);
  readonly toasts$ = this.notifications.toasts$;

  readonly nav = [
    { label: 'Overview', path: '/overview', icon: '📊' },
    { label: 'Dashboard', path: '/dashboard', icon: '📋' },
    { label: 'Financier Dashboard', path: '/financier/dashboard', icon: '🏦' },
    { label: 'Organizations', path: '/orgs', icon: '🏢' },
    { label: 'Roles', path: '/roles', icon: '🛡️' },
    { label: 'Users', path: '/users', icon: '👥' },
    { label: 'Access', path: '/access', icon: '🔑' },
    { label: 'Intake', path: '/intake', icon: '📝' },
    { label: 'Loans', path: '/loans', icon: '💰' },
    { label: 'Collections', path: '/collections', icon: '💵' },
    { label: 'Audit', path: '/audit', icon: '📋' }
  ];

  readonly isAuthenticated = () => this.authService.isAuthenticated();
  readonly currentUser = () => this.authService.getCurrentUser();

  /** True when the authenticated user holds the FINANCIER_ADMIN authority. */
  readonly isFinancierAdmin = () => {
    const user = this.authService.getCurrentUser();
    return user?.roleName === 'FINANCIER_ADMIN';
  };

  toggleSidebar(): void {
    this.collapsed.update((v) => !v);
  }

  dismissToast(id: number): void {
    this.notifications.dismiss(id);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}

import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  readonly notifications = inject(NotificationService);

  readonly collapsed = signal(false);
  readonly toasts$ = this.notifications.toasts$;

  readonly nav = [
    { label: 'Overview', path: '/overview', icon: '📊' },
    { label: 'Organizations', path: '/orgs', icon: '🏢' },
    { label: 'Roles', path: '/roles', icon: '🛡️' },
    { label: 'Users', path: '/users', icon: '👥' },
    { label: 'Access', path: '/access', icon: '🔑' },
    { label: 'Intake', path: '/intake', icon: '📝' },
    { label: 'Loans', path: '/loans', icon: '💰' },
    { label: 'Collections', path: '/collections', icon: '💵' },
    { label: 'Audit', path: '/audit', icon: '📋' }
  ];

  toggleSidebar(): void {
    this.collapsed.update((v) => !v);
  }

  dismissToast(id: number): void {
    this.notifications.dismiss(id);
  }
}

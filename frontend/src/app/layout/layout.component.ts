import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, FormsModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private readonly router = inject(Router);
  readonly notifications = inject(NotificationService);

  readonly collapsed = signal(false);
  readonly toasts$ = this.notifications.toasts$;
  globalSearch = '';

  readonly nav = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Customers', path: '/customers', icon: '👥' },
    { label: 'Accounts', path: '/accounts', icon: '🏦' },
    { label: 'Transactions', path: '/transactions', icon: '💸' },
    { label: 'Loans', path: '/loans', icon: '📝' }
  ];

  toggleSidebar(): void {
    this.collapsed.update((v) => !v);
  }

  onSearch(): void {
    const q = this.globalSearch.trim();
    this.router.navigate(['/customers'], { queryParams: q ? { search: q } : {} });
  }

  dismissToast(id: number): void {
    this.notifications.dismiss(id);
  }
}

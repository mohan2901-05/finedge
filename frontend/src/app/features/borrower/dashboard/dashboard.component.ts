import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../../../shared/logo.component';
import { NotificationService } from '../../../shared/notification.service';
import {
  LoanApplicationResponse,
} from '../../../core/models';
import { BorrowerService } from '../../../core/borrower.service';
import { LoadingComponent } from '../../../shared/loading.component';
import { EmptyStateComponent } from '../../../shared/empty-state.component';

/**
 * Borrower dashboard.
 *
 * Displays a personalized summary of the authenticated borrower's own loan
 * applications. All data is fetched from the backend which scopes reads to
 * the current user's security context — the frontend never supplies a
 * borrower ID.
 */
@Component({
  selector: 'app-borrower-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LogoComponent, LoadingComponent, EmptyStateComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class BorrowerDashboardComponent {
  private readonly service = inject(BorrowerService);
  private readonly toast = inject(NotificationService);

  readonly logoSize = 32;

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly applications = signal<LoanApplicationResponse[]>([]);
  readonly totalElements = signal(0);

  readonly page = 0;
  readonly size = 10;
  statusFilter = '';

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.list(this.statusFilter || undefined, this.page, this.size).subscribe({
      next: (res) => {
        this.applications.set(res.content ?? []);
        this.totalElements.set(res.totalElements);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set(
          err?.error?.message ||
          err?.message ||
          'Failed to load your applications.'
        );
        this.loading.set(false);
      }
    });
  }

  retry(): void {
    this.load();
  }

  onFilterChange(): void {
    this.load();
  }

  clearFilter(): void {
    this.statusFilter = '';
    this.load();
  }

  /** Returns the count of applications matching the given status. */
  countByStatus(status: string): number {
    return this.applications().filter((a) => a.status === status).length;
  }

  statusBadgeClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'approved') return 'status-approved';
    if (s === 'rejected') return 'status-rejected';
    return 'status-pending';
  }

  readonly formatCurrency = (value: number): string =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
}

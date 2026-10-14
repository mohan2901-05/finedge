import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../core/account.service';
import { NotificationService } from '../../shared/notification.service';
import { Account } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss'
})
export class AccountListComponent implements OnInit {
  private readonly accounts = inject(AccountService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly items = signal<Account[]>([]);
  readonly totalPages = signal(1);
  readonly totalElements = signal(0);

  search = '';
  type = '';
  status = '';
  page = 0;
  readonly size = 10;
  pendingDelete: Account | null = null;

  readonly types = ['CHECKING', 'SAVINGS', 'BUSINESS', 'MONEY_MARKET'];
  readonly statuses = ['ACTIVE', 'DORMANT', 'FROZEN', 'CLOSED'];

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((p) => {
      const cid = p.get('customerId');
      this.search = cid ? '' : this.search;
      if (cid) this.search = cid;
      this.load();
    });
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    const customerId = /^\d+$/.test(this.search.trim()) ? Number(this.search.trim()) : undefined;
    this.accounts.list({
      customerId, type: this.type || undefined, status: this.status || undefined,
      search: customerId ? undefined : (this.search || undefined),
      page: this.page, size: this.size
    }).subscribe({
      next: (res) => {
        this.items.set(res.content ?? []);
        this.totalPages.set(res.totalPages || 1);
        this.totalElements.set(res.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load accounts.');
        this.loading.set(false);
      }
    });
  }

  onFilter(): void {
    this.page = 0;
    this.load();
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.id;
    this.pendingDelete = null;
    this.accounts.remove(id).subscribe({
      next: () => {
        this.toast.success('Account deleted.');
        this.load();
      },
      error: () => this.toast.error('Failed to delete account.')
    });
  }
}

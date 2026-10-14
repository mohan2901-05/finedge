import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../core/transaction.service';
import { NotificationService } from '../../shared/notification.service';
import { Transaction } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent implements OnInit {
  private readonly txns = inject(TransactionService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly items = signal<Transaction[]>([]);
  readonly totalPages = signal(1);
  readonly totalElements = signal(0);

  search = '';
  type = '';
  status = '';
  accountId: number | null = null;
  page = 0;
  readonly size = 10;
  pendingDelete: Transaction | null = null;

  readonly types = ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER_IN', 'TRANSFER_OUT', 'PAYMENT', 'FEE'];
  readonly statuses = ['COMPLETED', 'PENDING', 'FAILED', 'REVERSED'];

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((p) => {
      const a = p.get('accountId');
      this.accountId = a ? Number(a) : null;
      this.load();
    });
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.txns.list({
      accountId: this.accountId ?? undefined, type: this.type || undefined,
      status: this.status || undefined, search: this.search || undefined,
      page: this.page, size: this.size
    }).subscribe({
      next: (res) => {
        this.items.set(res.content ?? []);
        this.totalPages.set(res.totalPages || 1);
        this.totalElements.set(res.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load transactions.');
        this.loading.set(false);
      }
    });
  }

  onFilter(): void {
    this.page = 0;
    this.load();
  }

  clearAccount(): void {
    this.accountId = null;
    this.onFilter();
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.id;
    this.pendingDelete = null;
    this.txns.remove(id).subscribe({
      next: () => {
        this.toast.success('Transaction deleted.');
        this.load();
      },
      error: () => this.toast.error('Failed to delete transaction.')
    });
  }
}

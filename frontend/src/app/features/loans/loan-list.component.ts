import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { LoanService } from '../../core/loan.service';
import { NotificationService } from '../../shared/notification.service';
import { Loan } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './loan-list.component.html'
})
export class LoanListComponent implements OnInit {
  private readonly loans = inject(LoanService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly items = signal<Loan[]>([]);
  readonly totalElements = signal(0);
  readonly totalPages = signal(1);

  orgId = '';
  userId = '';
  status = '';
  page = 0;
  readonly size = 10;
  pendingDelete: Loan | null = null;

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParamMap.get('userId') ?? '';
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.loans.list({
      orgId: this.orgId || undefined, userId: this.userId || undefined,
      status: this.status || undefined, page: this.page, size: this.size
    }).subscribe({
      next: (res) => {
        this.items.set(res.content ?? []);
        this.totalElements.set(res.totalElements);
        this.totalPages.set(res.totalPages || 1);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load loans.');
        this.loading.set(false);
      }
    });
  }

  onFilter(): void {
    this.page = 0;
    this.load();
  }

  prev(): void {
    if (this.page > 0) {
      this.page--;
      this.load();
    }
  }

  next(): void {
    if (this.page + 1 < this.totalPages()) {
      this.page++;
      this.load();
    }
  }

  askDelete(l: Loan): void {
    this.pendingDelete = l;
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.loanId;
    this.pendingDelete = null;
    this.loans.remove(id).subscribe({
      next: () => {
        this.toast.success('Loan deleted.');
        this.load();
      },
      error: (err) => this.toast.error(err?.error?.message ?? 'Failed to delete loan.')
    });
  }
}

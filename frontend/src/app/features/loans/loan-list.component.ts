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
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.scss'
})
export class LoanListComponent implements OnInit {
  private readonly loans = inject(LoanService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly items = signal<Loan[]>([]);
  readonly totalPages = signal(1);
  readonly totalElements = signal(0);

  search = '';
  loanType = '';
  status = '';
  page = 0;
  readonly size = 10;
  pendingDelete: Loan | null = null;

  readonly types = ['PERSONAL', 'MORTGAGE', 'AUTO', 'BUSINESS', 'EDUCATION'];
  readonly statuses = ['PENDING', 'APPROVED', 'REJECTED'];

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(() => this.load());
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.loans.list({
      loanType: this.loanType || undefined, status: this.status || undefined,
      search: this.search || undefined, page: this.page, size: this.size
    }).subscribe({
      next: (res) => {
        this.items.set(res.content ?? []);
        this.totalPages.set(res.totalPages || 1);
        this.totalElements.set(res.totalElements);
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

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.id;
    this.pendingDelete = null;
    this.loans.remove(id).subscribe({
      next: () => {
        this.toast.success('Loan application deleted.');
        this.load();
      },
      error: () => this.toast.error('Failed to delete loan.')
    });
  }
}

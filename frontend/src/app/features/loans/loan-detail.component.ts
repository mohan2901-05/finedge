import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LoanService } from '../../core/loan.service';
import { NotificationService } from '../../shared/notification.service';
import { Collection, Loan, LoanActivity, Repayment } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-loan-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './loan-detail.component.html'
})
export class LoanDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly loans = inject(LoanService);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly loan = signal<Loan | null>(null);
  readonly activities = signal<LoanActivity[]>([]);
  readonly repayments = signal<Repayment[]>([]);
  readonly collections = signal<Collection[]>([]);
  tab: 'activities' | 'repayments' | 'collections' = 'activities';
  confirmDelete = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin({
      loan: this.loans.getById(id),
      activities: this.loans.activities(id, 0, 50),
      repayments: this.loans.repayments(id, 0, 50),
      collections: this.loans.collections(id, 0, 50)
    }).subscribe({
      next: ({ loan, activities, repayments, collections }) => {
        this.loan.set(loan);
        this.activities.set(activities.content ?? []);
        this.repayments.set(repayments.content ?? []);
        this.collections.set(collections.content ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load loan.');
        this.loading.set(false);
      }
    });
  }

  delete(): void {
    const id = this.loan()?.loanId;
    if (!id) return;
    this.confirmDelete = false;
    this.loans.remove(id).subscribe({
      next: () => {
        this.toast.success('Loan deleted.');
        this.router.navigate(['/loans']);
      },
      error: (err) => this.toast.error(err?.error?.message ?? 'Failed to delete loan.')
    });
  }
}

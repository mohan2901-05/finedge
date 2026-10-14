import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserService } from '../../core/user.service';
import { LoanService } from '../../core/loan.service';
import { AuditService } from '../../core/audit.service';
import { NotificationService } from '../../shared/notification.service';
import { AuditEntry, Loan, User } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly users = inject(UserService);
  private readonly loans = inject(LoanService);
  private readonly audits = inject(AuditService);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly user = signal<User | null>(null);
  readonly loansList = signal<Loan[]>([]);
  readonly auditList = signal<AuditEntry[]>([]);
  confirmDelete = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin({
      user: this.users.getById(id),
      loans: this.loans.list({ userId: id, size: 50 }),
      audits: this.audits.list({ userId: id, size: 20 })
    }).subscribe({
      next: ({ user, loans, audits }) => {
        this.user.set(user);
        this.loansList.set(loans.content ?? []);
        this.auditList.set(audits.content ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load user.');
        this.loading.set(false);
      }
    });
  }

  delete(): void {
    const id = this.user()?.userId;
    if (!id) return;
    this.confirmDelete = false;
    this.users.remove(id).subscribe({
      next: () => {
        this.toast.success('User deleted.');
        this.router.navigate(['/users']);
      },
      error: (err) => this.toast.error(err?.error?.message ?? 'Failed to delete user.')
    });
  }
}

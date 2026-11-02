import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LogoComponent } from '../../shared/logo.component';
import { NotificationService } from '../../shared/notification.service';
import { LoanApplicationResponse, DisbursementDTO, DisbursementCreateRequest, OutstandingDTO } from '../../core/models';
import { FinancierService } from '../../core/financier.service';
import { DisbursementService } from '../../core/disbursement.service';
import { LoadingComponent } from '../../shared/loading.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

/**
 * Financier application review.
 *
 * Displays a single application owned by the current financier's institution
 * and allows approve/reject decisions. The backend enforces financier
 * institution scoping and valid status transitions.
 */
@Component({
  selector: 'app-financier-review',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LogoComponent, LoadingComponent, ConfirmDialogComponent],
  templateUrl: './financier-review.component.html',
  styleUrl: './financier-review.component.scss'
})
export class FinancierReviewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(FinancierService);
  private readonly disbursementService = inject(DisbursementService);
  private readonly toast = inject(NotificationService);

  readonly logoSize = 32;

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly application = signal<LoanApplicationResponse | null>(null);
  readonly deciding = signal(false);

  readonly disbursement = signal<DisbursementDTO | null>(null);
  readonly disbursementLoading = signal(false);
  readonly disbursementSubmitting = signal(false);
  readonly disbursementFormError = signal<string | null>(null);
  disbursementAmount = '';

  constructor() {
    this.load();
  }

  load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) {
      this.error.set('Invalid application reference.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.service.getByIdForFinancier(id).subscribe({
      next: (app) => {
        this.application.set(app);
        this.loading.set(false);
        this.loadDisbursementInfo(id);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ||
          err?.message ||
          'Application not found or you do not have access to it.'
        );
      }
    });
  }

  loadDisbursementInfo(applicationId: number): void {
    this.disbursementLoading.set(true);
    this.disbursementService.getDisbursement(applicationId).subscribe({
      next: (d) => {
        this.disbursement.set(d);
        this.disbursementLoading.set(false);
      },
      error: () => {
        this.disbursement.set(null);
        this.disbursementLoading.set(false);
      },
    });
  }

  retry(): void {
    this.load();
  }

  backToDashboard(): void {
    this.router.navigateByUrl('/financier/dashboard');
  }

  readonly formatCurrency = (value: number): string =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  statusBadgeClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'approved') return 'status-approved';
    if (s === 'rejected') return 'status-rejected';
    return 'status-pending';
  }

  canDecide(): boolean {
    const app = this.application();
    return !!app && app.status === 'Pending Review' && !this.deciding();
  }

  onApprove(): void {
    const app = this.application();
    if (!app || this.deciding()) return;

    this.deciding.set(true);
    this.error.set(null);

    this.service.approve(app.id).subscribe({
      next: (updated) => {
        this.application.set(updated);
        this.deciding.set(false);
        this.toast.success('Application approved.');
      },
      error: (err: any) => {
        this.deciding.set(false);
        this.error.set(
          err?.error?.message ||
          err?.message ||
          'Failed to approve application.'
        );
      }
    });
  }

  onReject(): void {
    const app = this.application();
    if (!app || this.deciding()) return;

    this.deciding.set(true);
    this.error.set(null);

    this.service.reject(app.id).subscribe({
      next: (updated) => {
        this.application.set(updated);
        this.deciding.set(false);
        this.toast.success('Application rejected.');
      },
      error: (err: any) => {
        this.deciding.set(false);
        this.error.set(
          err?.error?.message ||
          err?.message ||
          'Failed to reject application.'
        );
      }
    });
  }

  submitDisbursement(): void {
    const app = this.application();
    const amountStr = this.disbursementAmount;
    const amount = Number(amountStr);

    if (!app) {
      this.disbursementFormError.set('Application not loaded.');
      return;
    }

    if (!amountStr || amountStr.trim() === '') {
      this.disbursementFormError.set('Disbursed amount is required.');
      return;
    }

    if (Number.isNaN(amount)) {
      this.disbursementFormError.set('Amount must be a valid number.');
      return;
    }

    if (amount <= 0) {
      this.disbursementFormError.set('Disbursed amount must be greater than zero.');
      return;
    }

    if (app.status !== 'Approved') {
      this.disbursementFormError.set('Only approved loans may be disbursed.');
      return;
    }

    if (this.disbursement()) {
      this.disbursementFormError.set('This loan has already been disbursed.');
      return;
    }

    this.disbursementSubmitting.set(true);
    this.disbursementFormError.set(null);

    const body: DisbursementCreateRequest = { disbursedAmount: amount };
    this.disbursementService.disburse(app.id, body).subscribe({
      next: (d) => {
        this.disbursementSubmitting.set(false);
        this.disbursementAmount = '';
        this.disbursement.set(d);
        this.application.set({ ...app, status: 'Approved' });
        this.toast.success('Disbursement recorded successfully.');
      },
      error: (err: any) => {
        this.disbursementSubmitting.set(false);
        this.disbursementFormError.set(
          err?.error?.message ||
          err?.message ||
          'Failed to record disbursement.'
        );
      },
    });
  }

  canDisburse(): boolean {
    const app = this.application();
    return !!app && app.status === 'Approved' && !this.disbursement() && !this.disbursementSubmitting();
  }

  confirmDecide(action: 'approve' | 'reject'): void {
    // Delegate to the confirm dialog via template; this method is a hook
    // for any pre-dialog logic if needed.
  }
}

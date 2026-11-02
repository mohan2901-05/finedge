import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LogoComponent } from '../../../shared/logo.component';
import { NotificationService } from '../../../shared/notification.service';
import {
  LoanApplicationResponse,
  DisbursementDTO,
  OutstandingDTO,
  DisbursementRepaymentResponse,
  DisbursementRepaymentCreateRequest,
} from '../../../core/models';
import { BorrowerService } from '../../../core/borrower.service';
import { DisbursementService } from '../../../core/disbursement.service';
import { LoadingComponent } from '../../../shared/loading.component';

@Component({
  selector: 'app-borrower-application-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LogoComponent, LoadingComponent],
  templateUrl: './application-detail.component.html',
  styleUrl: './application-detail.component.scss'
})
export class BorrowerApplicationDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly borrowerService = inject(BorrowerService);
  private readonly disbursementService = inject(DisbursementService);
  private readonly toast = inject(NotificationService);

  readonly logoSize = 32;

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly application = signal<LoanApplicationResponse | null>(null);

  readonly disbursement = signal<DisbursementDTO | null>(null);
  readonly outstanding = signal<OutstandingDTO | null>(null);
  readonly repayments = signal<DisbursementRepaymentResponse[]>([]);
  readonly disbursementInfoLoading = signal(false);

  repaymentAmount = '';
  readonly repaymentSubmitting = signal(false);
  readonly repaymentFormError = signal<string | null>(null);

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
    this.borrowerService.getById(id).subscribe({
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
    this.disbursementInfoLoading.set(true);
    // Load disbursement, outstanding, and repayments concurrently
    this.disbursementService.getDisbursement(applicationId).subscribe({
      next: (d) => this.disbursement.set(d),
      error: () => this.disbursement.set(null),
    });

    this.disbursementService.getOutstanding(applicationId).subscribe({
      next: (o) => {
        this.outstanding.set(o);
        this.disbursementInfoLoading.set(false);
      },
      error: () => {
        this.outstanding.set(null);
        this.disbursementInfoLoading.set(false);
      },
    });

    this.disbursementService.listRepayments(applicationId, 0, 10).subscribe({
      next: (res) => this.repayments.set(res.content ?? []),
      error: () => this.repayments.set([]),
    });
  }

  retry(): void {
    this.load();
  }

  backToDashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }

  submitRepayment(): void {
    const app = this.application();
    const amountStr = this.repaymentAmount;
    const amount = Number(amountStr);

    if (!app) {
      this.repaymentFormError.set('Application not loaded.');
      return;
    }

    if (!amountStr || amountStr.trim() === '') {
      this.repaymentFormError.set('Repayment amount is required.');
      return;
    }

    if (Number.isNaN(amount)) {
      this.repaymentFormError.set('Amount must be a valid number.');
      return;
    }

    if (amount <= 0) {
      this.repaymentFormError.set('Repayment amount must be greater than zero.');
      return;
    }

    const out = this.outstanding();
    if (out && out.outstandingAmount > 0 && amount > out.outstandingAmount) {
      this.repaymentFormError.set('Repayment exceeds the outstanding balance.');
      return;
    }

    if (out && out.fullyRepaid) {
      this.repaymentFormError.set('This loan is already fully repaid.');
      return;
    }

    if (!out || !out.disbursed) {
      this.repaymentFormError.set('This loan has not been disbursed yet.');
      return;
    }

    this.repaymentSubmitting.set(true);
    this.repaymentFormError.set(null);

    const body: DisbursementRepaymentCreateRequest = { repaymentAmount: amount };
    this.disbursementService.repay(app.id, body).subscribe({
      next: () => {
        this.repaymentSubmitting.set(false);
        this.repaymentAmount = '';
        this.toast.success('Repayment recorded successfully.');
        // Refresh disbursement info to show updated balance and history
        this.loadDisbursementInfo(app.id);
      },
      error: (err: any) => {
        this.repaymentSubmitting.set(false);
        this.repaymentFormError.set(
          err?.error?.message ||
          err?.message ||
          'Failed to record repayment.'
        );
      },
    });
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
}

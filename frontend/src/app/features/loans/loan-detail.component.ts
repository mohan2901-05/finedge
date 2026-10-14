import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoanService } from '../../core/loan.service';
import { NotificationService } from '../../shared/notification.service';
import { Loan } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-loan-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingComponent, ConfirmDialogComponent],
  templateUrl: './loan-detail.component.html',
  styleUrl: './loan-detail.component.scss'
})
export class LoanDetailComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly loans = inject(LoanService);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly loan = signal<Loan | null>(null);
  confirmDelete = false;

  readonly reviewForm = this.fb.group({
    status: ['APPROVED', [Validators.required]],
    reviewedBy: [''],
    rejectionReason: ['']
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loans.getById(id).subscribe({
      next: (l) => {
        this.loan.set(l);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load loan.');
        this.loading.set(false);
      }
    });
  }

  review(): void {
    const loan = this.loan();
    if (!loan || this.reviewForm.invalid) return;
    const raw = this.reviewForm.getRawValue();
    if (raw.status === 'REJECTED' && !(raw.rejectionReason ?? '').trim()) {
      this.error.set('Rejection reason is required when rejecting.');
      return;
    }
    this.saving.set(true);
    this.error.set('');
    this.loans.update(loan.id, {
      status: raw.status as never,
      reviewedBy: raw.reviewedBy?.trim() || undefined,
      rejectionReason: raw.rejectionReason?.trim() || undefined
    }).subscribe({
      next: (updated) => {
        this.loan.set(updated);
        this.toast.success(`Loan ${updated.status.toLowerCase()}.`);
        this.saving.set(false);
      },
      error: (e) => {
        this.error.set(e?.error?.message ?? 'Review failed.');
        this.saving.set(false);
      }
    });
  }

  delete(): void {
    const id = this.loan()?.id;
    if (!id) return;
    this.confirmDelete = false;
    this.loans.remove(id).subscribe({
      next: () => {
        this.toast.success('Loan deleted.');
        this.router.navigate(['/loans']);
      },
      error: () => this.toast.error('Failed to delete loan.')
    });
  }
}

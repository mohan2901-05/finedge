import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoanService } from '../../core/loan.service';
import { NotificationService } from '../../shared/notification.service';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingComponent],
  templateUrl: './loan-form.component.html'
})
export class LoanFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly loans = inject(LoanService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly serverErrors = signal<Record<string, string>>({});
  readonly editId = signal<string | null>(null);
  readonly isEdit = signal(false);

  readonly form = this.fb.group({
    orgId: ['', [Validators.required]],
    userId: ['', [Validators.required]],
    loanAmount: [null as number | null, [Validators.required]],
    interestRate: [null as number | null],
    tenureMonths: [null as number | null, [Validators.required]],
    purpose: [''],
    applicationDate: [''],
    approvalDate: [''],
    disbursementDate: [''],
    dueDate: [''],
    outstandingAmount: [null as number | null],
    received: [false],
    status: ['PENDING', [Validators.required, Validators.maxLength(20)]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(id);
      this.isEdit.set(true);
      this.loading.set(true);
      this.loans.getById(id).subscribe({
        next: (l) => {
          // Booked terms are immutable: only operational fields are editable.
          this.form.patchValue({
            purpose: l.purpose ?? '', approvalDate: l.approvalDate ?? '',
            disbursementDate: l.disbursementDate ?? '', dueDate: l.dueDate ?? '',
            outstandingAmount: l.outstandingAmount ?? null,
            received: l.received ?? false, status: l.status
          });
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load loan.');
          this.loading.set(false);
        }
      });
    }
  }

  fieldInvalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  serverError(name: string): string {
    return this.serverErrors()[name] ?? '';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.serverErrors.set({});
    const value = this.form.getRawValue() as Record<string, unknown>;
    for (const key of ['interestRate', 'purpose', 'applicationDate', 'approvalDate', 'disbursementDate', 'dueDate', 'outstandingAmount']) {
      if (value[key] === '' || value[key] == null) delete value[key];
    }
    const id = this.editId();
    if (id) {
      for (const key of ['orgId', 'userId', 'loanAmount', 'interestRate', 'tenureMonths', 'applicationDate']) delete value[key];
    }
    const req$ = id
      ? this.loans.update(id, value as unknown as import('../../core/models').LoanUpdateRequest)
      : this.loans.create(value as never);
    req$.subscribe({
      next: (l) => {
        this.toast.success(id ? 'Loan updated.' : 'Loan booked.');
        this.router.navigate(['/loans', l.loanId]);
      },
      error: (err) => {
        this.serverErrors.set(err?.error?.fieldErrors ?? {});
        this.error.set(err?.error?.message ?? 'Save failed. Please try again.');
        this.loading.set(false);
      }
    });
  }
}

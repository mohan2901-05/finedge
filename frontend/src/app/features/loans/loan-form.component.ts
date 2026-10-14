import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoanService } from '../../core/loan.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './loan-form.component.html',
  styleUrl: './loan-form.component.scss'
})
export class LoanFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly loans = inject(LoanService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(NotificationService);

  readonly saving = signal(false);
  readonly error = signal('');
  readonly types = ['PERSONAL', 'MORTGAGE', 'AUTO', 'BUSINESS', 'EDUCATION'];

  readonly form = this.fb.group({
    customerId: [null as number | null, [Validators.required, Validators.min(1)]],
    loanType: ['', [Validators.required]],
    requestedAmount: [null as number | null, [Validators.required, Validators.min(100)]],
    interestRate: [null as number | null, [Validators.required, Validators.min(0.01), Validators.max(50)]],
    tenureMonths: [null as number | null, [Validators.required, Validators.min(1), Validators.max(480)]],
    purpose: ['', [Validators.required, Validators.maxLength(255)]]
  });

  ngOnInit(): void {
    const c = this.route.snapshot.queryParamMap.get('customerId');
    if (c) this.form.patchValue({ customerId: Number(c) });
  }

  invalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.error.set('');
    const raw = this.form.getRawValue();
    this.loans.create({
      customerId: Number(raw.customerId),
      loanType: raw.loanType as never,
      requestedAmount: Number(raw.requestedAmount),
      interestRate: Number(raw.interestRate),
      tenureMonths: Number(raw.tenureMonths),
      purpose: (raw.purpose ?? '').trim()
    }).subscribe({
      next: (l) => {
        this.toast.success('Loan application submitted.');
        this.router.navigate(['/loans', l.id]);
      },
      error: (e) => {
        this.error.set(e?.error?.message ?? 'Submit failed.');
        this.saving.set(false);
      }
    });
  }
}

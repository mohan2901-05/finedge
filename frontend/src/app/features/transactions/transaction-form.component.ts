import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TransactionService } from '../../core/transaction.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss'
})
export class TransactionFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly txns = inject(TransactionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(NotificationService);

  readonly saving = signal(false);
  readonly error = signal('');
  readonly types = ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER_IN', 'TRANSFER_OUT', 'PAYMENT', 'FEE'];

  readonly form = this.fb.group({
    accountId: [null as number | null, [Validators.required, Validators.min(1)]],
    transactionType: ['', [Validators.required]],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.required, Validators.maxLength(255)]]
  });

  ngOnInit(): void {
    const a = this.route.snapshot.queryParamMap.get('accountId');
    if (a) this.form.patchValue({ accountId: Number(a) });
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
    this.txns.create({
      accountId: Number(raw.accountId),
      transactionType: raw.transactionType as never,
      amount: Number(raw.amount),
      description: (raw.description ?? '').trim()
    }).subscribe({
      next: () => {
        this.toast.success('Transaction created.');
        const aid = Number(raw.accountId);
        this.router.navigate(['/transactions'], { queryParams: { accountId: aid } });
      },
      error: (e) => {
        this.error.set(e?.error?.message ?? 'Create failed. Check balance / account status.');
        this.saving.set(false);
      }
    });
  }
}

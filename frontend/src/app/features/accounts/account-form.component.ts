import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../../core/account.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.scss'
})
export class AccountFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly accounts = inject(AccountService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly editId = signal<number | null>(null);

  readonly types = ['CHECKING', 'SAVINGS', 'BUSINESS', 'MONEY_MARKET'];
  readonly statuses = ['ACTIVE', 'DORMANT', 'FROZEN', 'CLOSED'];

  readonly form = this.fb.group({
    customerId: [null as number | null, [Validators.required, Validators.min(1)]],
    accountType: ['', [Validators.required]],
    initialBalance: [0, [Validators.required, Validators.min(0)]],
    currency: ['USD', [Validators.required, Validators.maxLength(10)]],
    status: ['ACTIVE', [Validators.required]]
  });

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap.get('customerId');
    if (qp) this.form.patchValue({ customerId: Number(qp) });
    const id = this.route.snapshot.paramMap.get('id');
    if (id && this.route.snapshot.url.some((s) => s.path === 'edit')) {
      this.editId.set(Number(id));
      this.loading.set(true);
      this.accounts.getById(Number(id)).subscribe({
        next: (a) => {
          this.form.patchValue({
            customerId: a.customerId, accountType: a.accountType,
            initialBalance: a.balance, currency: a.currency, status: a.status
          });
          this.form.get('customerId')?.disable();
          this.form.get('initialBalance')?.disable();
          this.form.get('currency')?.disable();
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load account.');
          this.loading.set(false);
        }
      });
    }
  }

  get isEdit(): boolean {
    return this.editId() !== null;
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
    this.loading.set(true);
    this.error.set('');
    const raw = this.form.getRawValue();
    const id = this.editId();
    if (id) {
      this.accounts.update(id, { accountType: raw.accountType as never, status: raw.status as never }).subscribe({
        next: (a) => {
          this.toast.success('Account updated.');
          this.router.navigate(['/accounts', a.id]);
        },
        error: (e) => {
          this.error.set(e?.error?.message ?? 'Update failed.');
          this.loading.set(false);
        }
      });
    } else {
      this.accounts.create({
        customerId: Number(raw.customerId), accountType: raw.accountType as never,
        initialBalance: Number(raw.initialBalance), currency: raw.currency ?? 'USD', status: (raw.status as never) ?? 'ACTIVE'
      }).subscribe({
        next: (a) => {
          this.toast.success('Account created.');
          this.router.navigate(['/accounts', a.id]);
        },
        error: (e) => {
          this.error.set(e?.error?.message ?? 'Create failed.');
          this.loading.set(false);
        }
      });
    }
  }
}

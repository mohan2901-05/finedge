import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IntakeService } from '../../core/intake.service';
import { NotificationService } from '../../shared/notification.service';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-intake-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingComponent],
  templateUrl: './intake-form.component.html'
})
export class IntakeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly intake = inject(IntakeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly serverErrors = signal<Record<string, string>>({});
  readonly editId = signal<number | null>(null);
  readonly isEdit = signal(false);

  readonly form = this.fb.group({
    ref: ['', [Validators.required, Validators.maxLength(50)]],
    customerName: ['', [Validators.required, Validators.maxLength(100)]],
    customerPhone: ['', [Validators.required, Validators.maxLength(15)]],
    customerEmail: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    customerDob: [''],
    customerPan: ['', [Validators.maxLength(20)]],
    customerCity: ['', [Validators.required, Validators.maxLength(100)]],
    customerAddress: ['', [Validators.required, Validators.maxLength(255)]],
    financierKey: ['', [Validators.required, Validators.maxLength(50)]],
    financierLabel: ['', [Validators.required, Validators.maxLength(100)]],
    loanAmount: [null as number | null, [Validators.required]],
    tenureMonths: [null as number | null, [Validators.required]],
    interestRate: [null as number | null, [Validators.required]],
    emi: [null as number | null, [Validators.required]],
    totalInterest: [null as number | null, [Validators.required]],
    totalPayable: [null as number | null, [Validators.required]],
    status: ['Pending Review', [Validators.required, Validators.maxLength(30)]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(Number(id));
      this.isEdit.set(true);
      this.loading.set(true);
      this.intake.getById(Number(id)).subscribe({
        next: (a) => {
          this.form.patchValue({
            ref: a.ref, customerName: a.customerName, customerPhone: a.customerPhone,
            customerEmail: a.customerEmail, customerDob: a.customerDob ?? '',
            customerCity: a.customerCity, customerAddress: a.customerAddress,
            financierKey: a.financierKey, financierLabel: a.financierLabel,
            loanAmount: a.loanAmount, tenureMonths: a.tenureMonths, interestRate: a.interestRate,
            emi: a.emi, totalInterest: a.totalInterest, totalPayable: a.totalPayable,
            status: a.status
          });
          this.form.get('ref')?.disable();
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load application.');
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
    if (this.editId()) delete (value as Record<string, unknown>)['ref'];
    if (!value['customerPan']) delete value['customerPan'];
    if (!value['customerDob']) delete value['customerDob'];
    const id = this.editId();
    const req$ = id
      ? this.intake.update(id, value as unknown as import('../../core/models').IntakeUpdateRequest)
      : this.intake.create(value as never);
    req$.subscribe({
      next: (a) => {
        this.toast.success(id ? 'Application updated.' : 'Application created.');
        this.router.navigate(['/intake', a.id]);
      },
      error: (err) => {
        this.serverErrors.set(err?.error?.fieldErrors ?? {});
        this.error.set(err?.error?.message ?? 'Save failed. Please try again.');
        this.loading.set(false);
      }
    });
  }
}

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../core/customer.service';
import { NotificationService } from '../../shared/notification.service';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingComponent],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss'
})
export class CustomerFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly customers = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly editId = signal<number | null>(null);
  readonly isEdit = signal(false);

  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    phone: ['', [Validators.required, Validators.pattern(/^[+0-9\-\s()]{7,25}$/)]],
    address: ['', [Validators.required, Validators.maxLength(255)]],
    city: ['', [Validators.required, Validators.maxLength(50)]],
    state: ['', [Validators.required, Validators.maxLength(50)]],
    postalCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    status: ['ACTIVE' as string, [Validators.required]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(Number(id));
      this.isEdit.set(true);
      this.loading.set(true);
      this.customers.getById(Number(id)).subscribe({
        next: (c) => {
          this.form.patchValue({
            firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone,
            address: c.address, city: c.city, state: c.state, postalCode: c.postalCode,
            status: c.status
          });
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load customer.');
          this.loading.set(false);
        }
      });
    }
  }

  fieldInvalid(name: string): boolean {
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
    const value = this.form.getRawValue() as Record<string, string>;
    const id = this.editId();
    const req$ = id ? this.customers.update(id, value as never) : this.customers.create(value as never);
    req$.subscribe({
      next: (c) => {
        this.toast.success(id ? 'Customer updated.' : 'Customer created.');
        this.router.navigate(['/customers', c.id]);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Save failed. Please try again.');
        this.loading.set(false);
      }
    });
  }
}

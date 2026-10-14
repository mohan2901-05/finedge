import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CollectionService } from '../../core/collection.service';
import { NotificationService } from '../../shared/notification.service';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-collection-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingComponent],
  templateUrl: './collection-form.component.html'
})
export class CollectionFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly collections = inject(CollectionService);
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
    loanId: ['', [Validators.required]],
    userId: ['', [Validators.required]],
    collectionAmount: [null as number | null, [Validators.required]],
    collectionDate: [''],
    paymentMode: ['CASH', [Validators.maxLength(20)]],
    referenceNo: ['', [Validators.maxLength(100)]],
    collectedByUserId: [''],
    remarks: ['', [Validators.maxLength(255)]],
    status: ['SUCCESS', [Validators.maxLength(20)]]
  });

  ngOnInit(): void {
    const presetLoan = this.route.snapshot.queryParamMap.get('loanId');
    if (presetLoan) this.form.patchValue({ loanId: presetLoan });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Edit mode only corrects annotations; amounts and parties are immutable.
      this.editId.set(id);
      this.isEdit.set(true);
      this.loading.set(true);
      this.collections.getById(id).subscribe({
        next: (c) => {
          this.form.patchValue({
            referenceNo: c.referenceNo ?? '', remarks: c.remarks ?? '', status: c.status ?? 'SUCCESS'
          });
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load collection.');
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
    for (const key of Object.keys(value)) {
      if (value[key] === '' || value[key] == null) delete value[key];
    }
    const id = this.editId();
    if (id) {
      for (const key of ['orgId', 'loanId', 'userId', 'collectionAmount', 'collectionDate', 'paymentMode', 'collectedByUserId']) delete value[key];
    }
    const req$ = id
      ? this.collections.update(id, value as unknown as import('../../core/models').CollectionUpdateRequest)
      : this.collections.create(value as never);
    req$.subscribe({
      next: (c) => {
        this.toast.success(id ? 'Collection updated.' : 'Collection recorded.');
        this.router.navigate(['/collections'], { queryParams: { loanId: c.loanId } });
      },
      error: (err) => {
        this.serverErrors.set(err?.error?.fieldErrors ?? {});
        this.error.set(err?.error?.message ?? 'Save failed. Please try again.');
        this.loading.set(false);
      }
    });
  }
}

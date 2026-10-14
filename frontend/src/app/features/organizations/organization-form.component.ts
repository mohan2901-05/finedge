import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrganizationService } from '../../core/organization.service';
import { NotificationService } from '../../shared/notification.service';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-organization-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingComponent],
  templateUrl: './organization-form.component.html'
})
export class OrganizationFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly orgs = inject(OrganizationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly serverErrors = signal<Record<string, string>>({});
  readonly editId = signal<string | null>(null);
  readonly isEdit = signal(false);

  readonly form = this.fb.group({
    orgName: ['', [Validators.required, Validators.maxLength(100)]],
    orgEmail: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    status: ['ACTIVE', [Validators.required, Validators.maxLength(10)]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(id);
      this.isEdit.set(true);
      this.loading.set(true);
      this.orgs.getById(id).subscribe({
        next: (o) => {
          this.form.patchValue({ orgName: o.orgName, orgEmail: o.orgEmail, status: o.status });
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load organization.');
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
    const raw = this.form.getRawValue();
    const id = this.editId();
    // Validated above: required fields are non-null strings at runtime.
    const req$ = id
      ? this.orgs.update(id, raw as unknown as import('../../core/models').OrganizationUpdateRequest)
      : this.orgs.create(raw as unknown as import('../../core/models').OrganizationCreateRequest);
    req$.subscribe({
      next: (o) => {
        this.toast.success(id ? 'Organization updated.' : 'Organization created.');
        this.router.navigate(['/orgs', o.orgId]);
      },
      error: (err) => {
        this.serverErrors.set(err?.error?.fieldErrors ?? {});
        this.error.set(err?.error?.message ?? 'Save failed. Please try again.');
        this.loading.set(false);
      }
    });
  }
}

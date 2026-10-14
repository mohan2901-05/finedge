import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoleService } from '../../core/role.service';
import { OrganizationService } from '../../core/organization.service';
import { NotificationService } from '../../shared/notification.service';
import { Organization } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingComponent],
  templateUrl: './role-form.component.html'
})
export class RoleFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly roles = inject(RoleService);
  private readonly orgs = inject(OrganizationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly serverErrors = signal<Record<string, string>>({});
  readonly editId = signal<string | null>(null);
  readonly isEdit = signal(false);
  readonly orgOptions = signal<Organization[]>([]);

  readonly form = this.fb.group({
    orgId: ['', [Validators.required]],
    roleName: ['', [Validators.required, Validators.maxLength(50)]],
    roleDescription: ['', [Validators.maxLength(255)]],
    status: ['ACTIVE', [Validators.required]]
  });

  ngOnInit(): void {
    this.orgs.list({ size: 100 }).subscribe({
      next: (res) => this.orgOptions.set(res.content ?? [])
    });
    const presetOrg = this.route.snapshot.queryParamMap.get('orgId');
    if (presetOrg) this.form.patchValue({ orgId: presetOrg });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(id);
      this.isEdit.set(true);
      this.loading.set(true);
      this.roles.getById(id).subscribe({
        next: (r) => {
          this.form.patchValue({
            orgId: r.orgId, roleName: r.roleName,
            roleDescription: r.roleDescription ?? '', status: r.status
          });
          this.form.get('orgId')?.disable();
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load role.');
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
    const value = this.form.getRawValue();
    const id = this.editId();
    // Validated above: required fields are non-null strings at runtime.
    const req$ = id
      ? this.roles.update(id, { roleName: value.roleName ?? undefined, roleDescription: value.roleDescription || undefined, status: value.status ?? undefined })
      : this.roles.create({ orgId: value.orgId ?? '', roleName: value.roleName ?? '', roleDescription: value.roleDescription || undefined, status: value.status ?? 'ACTIVE' });
    req$.subscribe({
      next: (r) => {
        this.toast.success(id ? 'Role updated.' : 'Role created.');
        this.router.navigate(['/roles', r.roleId]);
      },
      error: (err) => {
        this.serverErrors.set(err?.error?.fieldErrors ?? {});
        this.error.set(err?.error?.message ?? 'Save failed. Please try again.');
        this.loading.set(false);
      }
    });
  }
}

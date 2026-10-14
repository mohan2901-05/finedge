import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/user.service';
import { OrganizationService } from '../../core/organization.service';
import { RoleService } from '../../core/role.service';
import { NotificationService } from '../../shared/notification.service';
import { Organization, Role } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingComponent],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly users = inject(UserService);
  private readonly orgs = inject(OrganizationService);
  private readonly roles = inject(RoleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly serverErrors = signal<Record<string, string>>({});
  readonly editId = signal<string | null>(null);
  readonly isEdit = signal(false);
  readonly orgOptions = signal<Organization[]>([]);
  readonly roleOptions = signal<Role[]>([]);

  readonly form = this.fb.group({
    orgId: ['', [Validators.required]],
    roleId: ['', [Validators.required]],
    userName: ['', [Validators.required, Validators.maxLength(50)]],
    password: ['', [Validators.maxLength(255)]],
    userEmail: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    dob: [''],
    panNo: ['', [Validators.maxLength(20)]],
    status: ['ACTIVE', [Validators.required]]
  });

  ngOnInit(): void {
    this.orgs.list({ size: 100 }).subscribe({
      next: (res) => this.orgOptions.set(res.content ?? [])
    });
    this.roles.list({ size: 100 }).subscribe({
      next: (res) => this.roleOptions.set(res.content ?? [])
    });
    const presetOrg = this.route.snapshot.queryParamMap.get('orgId');
    if (presetOrg) this.form.patchValue({ orgId: presetOrg });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(id);
      this.isEdit.set(true);
      this.loading.set(true);
      this.users.getById(id).subscribe({
        next: (u) => {
          this.form.patchValue({
            orgId: u.orgId, roleId: u.roleId, userName: u.userName,
            userEmail: u.userEmail, dob: u.dob ?? '', status: u.status
          });
          this.form.get('orgId')?.disable();
          this.form.get('password')?.disable();
          this.form.get('password')?.clearValidators();
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load user.');
          this.loading.set(false);
        }
      });
    } else {
      this.form.get('password')?.addValidators([Validators.required]);
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
      ? this.users.update(id, {
          userName: value.userName ?? undefined, userEmail: value.userEmail ?? undefined,
          dob: value.dob || undefined, roleId: value.roleId ?? undefined, status: value.status ?? undefined
        })
      : this.users.create({
          orgId: value.orgId ?? '', roleId: value.roleId ?? '', userName: value.userName ?? '',
          password: value.password ?? '', userEmail: value.userEmail ?? '',
          dob: value.dob || undefined, panNo: value.panNo || undefined, status: value.status ?? 'ACTIVE'
        });
    req$.subscribe({
      next: (u) => {
        this.toast.success(id ? 'User updated.' : 'User created.');
        this.router.navigate(['/users', u.userId]);
      },
      error: (err) => {
        this.serverErrors.set(err?.error?.fieldErrors ?? {});
        this.error.set(err?.error?.message ?? 'Save failed. Please try again.');
        this.loading.set(false);
      }
    });
  }
}

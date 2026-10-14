import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { RoleMappingService } from '../../core/role-mapping.service';
import { RoleService } from '../../core/role.service';
import { ModuleService } from '../../core/module.service';
import { PermissionService } from '../../core/permission.service';
import { NotificationService } from '../../shared/notification.service';
import { Module, Permission, Role, RoleMapping } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-access-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './access-list.component.html'
})
export class AccessListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly mappings = inject(RoleMappingService);
  private readonly roles = inject(RoleService);
  private readonly modules = inject(ModuleService);
  private readonly permissions = inject(PermissionService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly items = signal<RoleMapping[]>([]);
  readonly roleOptions = signal<Role[]>([]);
  readonly moduleOptions = signal<Module[]>([]);
  readonly permissionOptions = signal<Permission[]>([]);
  readonly totalElements = signal(0);
  readonly totalPages = signal(1);

  roleId = '';
  page = 0;
  readonly size = 10;
  pendingDelete: RoleMapping | null = null;
  readonly granting = signal(false);

  readonly grantForm = this.fb.group({
    orgId: ['', [Validators.required]],
    roleId: ['', [Validators.required]],
    moduleId: ['', [Validators.required]],
    permissionId: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.roleId = this.route.snapshot.queryParamMap.get('roleId') ?? '';
    forkJoin({
      roles: this.roles.list({ size: 100 }),
      modules: this.modules.list(0, 100),
      permissions: this.permissions.list(0, 100)
    }).subscribe({
      next: ({ roles, modules, permissions }) => {
        this.roleOptions.set(roles.content ?? []);
        this.moduleOptions.set(modules.content ?? []);
        this.permissionOptions.set(permissions.content ?? []);
        const preset = this.roleOptions().find((r) => r.roleId === this.roleId);
        if (preset) this.grantForm.patchValue({ orgId: preset.orgId, roleId: preset.roleId });
        this.load();
      },
      error: () => {
        this.error.set('Failed to load access data.');
        this.loading.set(false);
      }
    });
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.mappings.list({ roleId: this.roleId || undefined, page: this.page, size: this.size }).subscribe({
      next: (res) => {
        this.items.set(res.content ?? []);
        this.totalElements.set(res.totalElements);
        this.totalPages.set(res.totalPages || 1);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load assignments.');
        this.loading.set(false);
      }
    });
  }

  onFilter(): void {
    this.page = 0;
    this.load();
  }

  prev(): void {
    if (this.page > 0) {
      this.page--;
      this.load();
    }
  }

  next(): void {
    if (this.page + 1 < this.totalPages()) {
      this.page++;
      this.load();
    }
  }

  grant(): void {
    if (this.grantForm.invalid) {
      this.grantForm.markAllAsTouched();
      return;
    }
    this.granting.set(true);
    // Validated above: all four IDs are non-null strings at runtime.
    const body = this.grantForm.getRawValue() as unknown as import('../../core/models').RoleMappingCreateRequest;
    this.mappings.create(body).subscribe({
      next: () => {
        this.toast.success('Permission granted (recorded only — not enforced by the API).');
        this.granting.set(false);
        this.load();
      },
      error: (err) => {
        this.toast.error(err?.error?.message ?? 'Grant failed. It may already exist.');
        this.granting.set(false);
      }
    });
  }

  askDelete(m: RoleMapping): void {
    this.pendingDelete = m;
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.mappingId;
    this.pendingDelete = null;
    this.mappings.remove(id).subscribe({
      next: () => {
        this.toast.success('Assignment revoked.');
        this.load();
      },
      error: (err) => this.toast.error(err?.error?.message ?? 'Failed to revoke assignment.')
    });
  }
}

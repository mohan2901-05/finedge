import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/user.service';
import { OrganizationService } from '../../core/organization.service';
import { RoleService } from '../../core/role.service';
import { NotificationService } from '../../shared/notification.service';
import { Organization, Role, User } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  private readonly users = inject(UserService);
  private readonly orgs = inject(OrganizationService);
  private readonly roles = inject(RoleService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly items = signal<User[]>([]);
  readonly orgOptions = signal<Organization[]>([]);
  readonly roleOptions = signal<Role[]>([]);
  readonly totalElements = signal(0);
  readonly totalPages = signal(1);

  orgId = '';
  roleId = '';
  page = 0;
  readonly size = 10;
  pendingDelete: User | null = null;

  ngOnInit(): void {
    this.orgId = this.route.snapshot.queryParamMap.get('orgId') ?? '';
    this.roleId = this.route.snapshot.queryParamMap.get('roleId') ?? '';
    this.orgs.list({ size: 100 }).subscribe({
      next: (res) => this.orgOptions.set(res.content ?? [])
    });
    this.roles.list({ size: 100 }).subscribe({
      next: (res) => this.roleOptions.set(res.content ?? [])
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.users.list({ orgId: this.orgId || undefined, roleId: this.roleId || undefined, page: this.page, size: this.size }).subscribe({
      next: (res) => {
        this.items.set(res.content ?? []);
        this.totalElements.set(res.totalElements);
        this.totalPages.set(res.totalPages || 1);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load users.');
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

  askDelete(u: User): void {
    this.pendingDelete = u;
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.userId;
    this.pendingDelete = null;
    this.users.remove(id).subscribe({
      next: () => {
        this.toast.success('User deleted.');
        this.load();
      },
      error: (err) => this.toast.error(err?.error?.message ?? 'Failed to delete user.')
    });
  }
}

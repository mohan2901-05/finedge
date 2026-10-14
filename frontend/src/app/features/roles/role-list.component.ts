import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { RoleService } from '../../core/role.service';
import { OrganizationService } from '../../core/organization.service';
import { NotificationService } from '../../shared/notification.service';
import { Organization, Role } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './role-list.component.html'
})
export class RoleListComponent implements OnInit {
  private readonly roles = inject(RoleService);
  private readonly orgs = inject(OrganizationService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly items = signal<Role[]>([]);
  readonly orgOptions = signal<Organization[]>([]);
  readonly totalElements = signal(0);
  readonly totalPages = signal(1);

  orgId = '';
  page = 0;
  readonly size = 10;
  pendingDelete: Role | null = null;

  ngOnInit(): void {
    this.orgId = this.route.snapshot.queryParamMap.get('orgId') ?? '';
    this.orgs.list({ size: 100 }).subscribe({
      next: (res) => this.orgOptions.set(res.content ?? [])
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.roles.list({ orgId: this.orgId || undefined, page: this.page, size: this.size }).subscribe({
      next: (res) => {
        this.items.set(res.content ?? []);
        this.totalElements.set(res.totalElements);
        this.totalPages.set(res.totalPages || 1);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load roles.');
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

  askDelete(r: Role): void {
    this.pendingDelete = r;
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.roleId;
    this.pendingDelete = null;
    this.roles.remove(id).subscribe({
      next: () => {
        this.toast.success('Role deleted.');
        this.load();
      },
      error: (err) => this.toast.error(err?.error?.message ?? 'Failed to delete role.')
    });
  }
}

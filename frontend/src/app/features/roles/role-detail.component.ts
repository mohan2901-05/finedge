import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { RoleService } from '../../core/role.service';
import { UserService } from '../../core/user.service';
import { NotificationService } from '../../shared/notification.service';
import { Role, RoleMapping, User } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-role-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './role-detail.component.html'
})
export class RoleDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly roles = inject(RoleService);
  private readonly users = inject(UserService);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly role = signal<Role | null>(null);
  readonly permissions = signal<RoleMapping[]>([]);
  readonly usersList = signal<User[]>([]);
  confirmDelete = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin({
      role: this.roles.getById(id),
      permissions: this.roles.permissions(id, 0, 50),
      users: this.users.list({ roleId: id, size: 50 })
    }).subscribe({
      next: ({ role, permissions, users }) => {
        this.role.set(role);
        this.permissions.set(permissions.content ?? []);
        this.usersList.set(users.content ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load role.');
        this.loading.set(false);
      }
    });
  }

  delete(): void {
    const id = this.role()?.roleId;
    if (!id) return;
    this.confirmDelete = false;
    this.roles.remove(id).subscribe({
      next: () => {
        this.toast.success('Role deleted.');
        this.router.navigate(['/roles']);
      },
      error: (err) => this.toast.error(err?.error?.message ?? 'Failed to delete role.')
    });
  }
}

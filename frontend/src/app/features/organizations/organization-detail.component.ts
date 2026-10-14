import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { OrganizationService } from '../../core/organization.service';
import { RoleService } from '../../core/role.service';
import { UserService } from '../../core/user.service';
import { NotificationService } from '../../shared/notification.service';
import { Organization, Role, User } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-organization-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './organization-detail.component.html'
})
export class OrganizationDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orgs = inject(OrganizationService);
  private readonly roles = inject(RoleService);
  private readonly users = inject(UserService);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly org = signal<Organization | null>(null);
  readonly rolesList = signal<Role[]>([]);
  readonly usersList = signal<User[]>([]);
  confirmDelete = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin({
      org: this.orgs.getById(id),
      roles: this.roles.list({ orgId: id, size: 50 }),
      users: this.users.list({ orgId: id, size: 50 })
    }).subscribe({
      next: ({ org, roles, users }) => {
        this.org.set(org);
        this.rolesList.set(roles.content ?? []);
        this.usersList.set(users.content ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load organization.');
        this.loading.set(false);
      }
    });
  }

  delete(): void {
    const id = this.org()?.orgId;
    if (!id) return;
    this.confirmDelete = false;
    this.orgs.remove(id).subscribe({
      next: () => {
        this.toast.success('Organization deleted.');
        this.router.navigate(['/orgs']);
      },
      error: (err) => this.toast.error(err?.error?.message ?? 'Failed to delete organization.')
    });
  }
}

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { OrganizationService } from '../../core/organization.service';
import { RoleService } from '../../core/role.service';
import { UserService } from '../../core/user.service';
import { IntakeService } from '../../core/intake.service';
import { LoanService } from '../../core/loan.service';
import { CollectionService } from '../../core/collection.service';
import { AuditService } from '../../core/audit.service';
import { AuditEntry } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';

interface OverviewCard {
  label: string;
  path: string;
  total: number;
}

/**
 * Local overview. Every figure is a server-reported totalElements count —
 * no aggregation is computed in the browser beyond displaying those
 * totals, and no analytics endpoint is assumed.
 */
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent, EmptyStateComponent],
  templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit {
  private readonly orgs = inject(OrganizationService);
  private readonly roles = inject(RoleService);
  private readonly users = inject(UserService);
  private readonly intake = inject(IntakeService);
  private readonly loans = inject(LoanService);
  private readonly collections = inject(CollectionService);
  private readonly audits = inject(AuditService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly cards = signal<OverviewCard[]>([]);
  readonly recentAudit = signal<AuditEntry[]>([]);

  ngOnInit(): void {
    forkJoin({
      orgs: this.orgs.list({ size: 1 }),
      roles: this.roles.list({ size: 1 }),
      users: this.users.list({ size: 1 }),
      intake: this.intake.list({ size: 1 }),
      pendingIntake: this.intake.list({ status: 'Pending Review', size: 1 }),
      loans: this.loans.list({ size: 1 }),
      collections: this.collections.list({ size: 1 }),
      audits: this.audits.list({ size: 10 })
    }).subscribe({
      next: (r) => {
        this.cards.set([
          { label: 'Organizations', path: '/orgs', total: r.orgs.totalElements },
          { label: 'Roles', path: '/roles', total: r.roles.totalElements },
          { label: 'Users', path: '/users', total: r.users.totalElements },
          { label: 'Loan applications', path: '/intake', total: r.intake.totalElements },
          { label: 'Pending review', path: '/intake', total: r.pendingIntake.totalElements },
          { label: 'Booked loans', path: '/loans', total: r.loans.totalElements },
          { label: 'Collections', path: '/collections', total: r.collections.totalElements }
        ]);
        this.recentAudit.set(r.audits.content ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load overview. Is the backend running at http://localhost:8080?');
        this.loading.set(false);
      }
    });
  }
}

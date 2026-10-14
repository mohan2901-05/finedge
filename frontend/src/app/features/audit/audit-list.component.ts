import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../../core/audit.service';
import { NotificationService } from '../../shared/notification.service';
import { AuditEntry } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';

@Component({
  selector: 'app-audit-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, EmptyStateComponent],
  templateUrl: './audit-list.component.html'
})
export class AuditListComponent implements OnInit {
  private readonly audits = inject(AuditService);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly items = signal<AuditEntry[]>([]);
  readonly totalElements = signal(0);
  readonly totalPages = signal(1);

  orgId = '';
  userId = '';
  page = 0;
  readonly size = 20;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.audits.list({ orgId: this.orgId || undefined, userId: this.userId || undefined, page: this.page, size: this.size }).subscribe({
      next: (res) => {
        this.items.set(res.content ?? []);
        this.totalElements.set(res.totalElements);
        this.totalPages.set(res.totalPages || 1);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load audit entries.');
        this.toast.error(err?.error?.message ?? 'Failed to load audit entries.');
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
}

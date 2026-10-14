import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IntakeService } from '../../core/intake.service';
import { NotificationService } from '../../shared/notification.service';
import { Intake } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-intake-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './intake-list.component.html'
})
export class IntakeListComponent implements OnInit {
  private readonly intake = inject(IntakeService);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly items = signal<Intake[]>([]);
  readonly totalElements = signal(0);
  readonly totalPages = signal(1);

  status = '';
  refLookup = '';
  page = 0;
  readonly size = 10;
  pendingDelete: Intake | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.intake.list({ status: this.status || undefined, page: this.page, size: this.size }).subscribe({
      next: (res) => {
        this.items.set(res.content ?? []);
        this.totalElements.set(res.totalElements);
        this.totalPages.set(res.totalPages || 1);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load applications.');
        this.loading.set(false);
      }
    });
  }

  onFilter(): void {
    this.page = 0;
    this.load();
  }

  lookupByRef(): void {
    const ref = this.refLookup.trim();
    if (!ref) return;
    this.loading.set(true);
    this.error.set('');
    this.intake.getByRef(ref).subscribe({
      next: (app) => {
        this.items.set([app]);
        this.totalElements.set(1);
        this.totalPages.set(1);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? `No application found with ref ${ref}.`);
        this.loading.set(false);
      }
    });
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

  askDelete(a: Intake): void {
    this.pendingDelete = a;
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.id;
    this.pendingDelete = null;
    this.intake.remove(id).subscribe({
      next: () => {
        this.toast.success('Application deleted.');
        this.load();
      },
      error: (err) => this.toast.error(err?.error?.message ?? 'Failed to delete application.')
    });
  }
}

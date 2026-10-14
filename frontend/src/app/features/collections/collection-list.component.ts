import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CollectionService } from '../../core/collection.service';
import { NotificationService } from '../../shared/notification.service';
import { Collection } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './collection-list.component.html'
})
export class CollectionListComponent implements OnInit {
  private readonly collections = inject(CollectionService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly items = signal<Collection[]>([]);
  readonly totalElements = signal(0);
  readonly totalPages = signal(1);

  loanId = '';
  orgId = '';
  status = '';
  page = 0;
  readonly size = 10;
  pendingDelete: Collection | null = null;

  ngOnInit(): void {
    this.loanId = this.route.snapshot.queryParamMap.get('loanId') ?? '';
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.collections.list({
      loanId: this.loanId || undefined, orgId: this.orgId || undefined,
      status: this.status || undefined, page: this.page, size: this.size
    }).subscribe({
      next: (res) => {
        this.items.set(res.content ?? []);
        this.totalElements.set(res.totalElements);
        this.totalPages.set(res.totalPages || 1);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load collections.');
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

  askDelete(c: Collection): void {
    this.pendingDelete = c;
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.collectionId;
    this.pendingDelete = null;
    this.collections.remove(id).subscribe({
      next: () => {
        this.toast.success('Collection deleted.');
        this.load();
      },
      error: (err) => this.toast.error(err?.error?.message ?? 'Failed to delete collection.')
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../../shared/logo.component';
import { FinancierDirectoryService } from '../../core/financier-directory.service';
import {
  FinancierProfile,
  FinancierQuery,
  PageResponse,
} from '../../core/models';

@Component({
  selector: 'app-financier-directory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LogoComponent],
  templateUrl: './financier-directory.component.html',
  styleUrl: './financier-directory.component.scss'
})
export class FinancierDirectoryComponent {
  private readonly service = inject(FinancierDirectoryService);

  readonly financiers = signal<FinancierProfile[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly apiUnavailable = signal(false);

  readonly query: FinancierQuery = {
    search: '',
    sortBy: 'name',
    sortDir: 'asc',
    page: 0,
    size: 10,
  };

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.list(this.query).subscribe({
      next: (page) => {
        this.financiers.set(page.content);
        this.loading.set(false);
        if (page.totalElements === 0) {
          this.apiUnavailable.set(true);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Failed to load financiers');
        this.apiUnavailable.set(true);
      }
    });
  }

  onSearchChange(value: string): void {
    this.query.search = value.trim();
    this.query.page = 0;
    this.load();
  }

  onSortChange(sortBy: string): void {
    if (this.query.sortBy === sortBy) {
      this.query.sortDir = this.query.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.query.sortBy = sortBy as FinancierQuery['sortBy'];
      this.query.sortDir = 'asc';
    }
    this.load();
  }

  onSortSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.onSortChange(target.value);
  }

  clearFilters(): void {
    this.query.search = '';
    this.query.sortBy = 'name';
    this.query.sortDir = 'asc';
    this.query.page = 0;
    this.load();
  }

  formatCurrency(value: number | undefined): string {
    if (value === undefined) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  formatRate(value: number | undefined): string {
    if (value === undefined) return '—';
    return value.toFixed(2) + '%';
  }
}

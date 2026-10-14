import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DashboardService } from '../../core/dashboard.service';
import { DashboardSummary, Transaction } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent, EmptyStateComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly dashboard = inject(DashboardService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly summary = signal<DashboardSummary | null>(null);
  readonly recent = signal<Transaction[]>([]);

  readonly maxVolume = computed(() => {
    const vals = Object.values(this.summary()?.monthlyVolume ?? {});
    return vals.length ? Math.max(...vals) : 1;
  });
  readonly volumeEntries = computed(() => Object.entries(this.summary()?.monthlyVolume ?? {}).sort(([a], [b]) => a.localeCompare(b)));
  readonly loanStatusEntries = computed(() => Object.entries(this.summary()?.loansByStatus ?? {}));
  readonly accountTypeEntries = computed(() => Object.entries(this.summary()?.accountsByType ?? {}));

  ngOnInit(): void {
    forkJoin({ summary: this.dashboard.getSummary(), recent: this.dashboard.getRecentTransactions() }).subscribe({
      next: ({ summary, recent }) => {
        this.summary.set(summary);
        this.recent.set(recent ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load dashboard. Is the backend running at http://localhost:8080?');
        this.loading.set(false);
      }
    });
  }
}

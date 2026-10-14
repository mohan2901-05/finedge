import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IntakeService } from '../../core/intake.service';
import { NotificationService } from '../../shared/notification.service';
import { Intake } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-intake-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent, ConfirmDialogComponent],
  templateUrl: './intake-detail.component.html'
})
export class IntakeDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly intake = inject(IntakeService);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly app = signal<Intake | null>(null);
  confirmDelete = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.intake.getById(id).subscribe({
      next: (app) => {
        this.app.set(app);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load application.');
        this.loading.set(false);
      }
    });
  }

  delete(): void {
    const id = this.app()?.id;
    if (!id) return;
    this.confirmDelete = false;
    this.intake.remove(id).subscribe({
      next: () => {
        this.toast.success('Application deleted.');
        this.router.navigate(['/intake']);
      },
      error: (err) => this.toast.error(err?.error?.message ?? 'Failed to delete application.')
    });
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="overlay" role="presentation" (click)="onCancel()">
      <div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" (click)="$event.stopPropagation()">
        <h3 id="confirm-title">{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="actions">
          <button type="button" class="btn btn-ghost" (click)="onCancel()">Cancel</button>
          <button type="button" class="btn btn-danger" (click)="onConfirm()">{{ confirmLabel }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay { position: fixed; inset: 0; background: rgba(15,23,42,.5); display: flex; align-items: center; justify-content: center; z-index: 60; padding: 1rem; }
    .dialog { background: var(--surface); border-radius: 12px; padding: 1.25rem; max-width: 420px; width: 100%; box-shadow: var(--shadow); }
    .dialog h3 { margin: 0 0 .5rem; }
    .dialog p { margin: 0 0 1rem; color: var(--muted); }
    .actions { display: flex; justify-content: flex-end; gap: .5rem; }
  `]
})
export class ConfirmDialogComponent {
  @Input() title = 'Are you sure?';
  @Input() message = 'This action cannot be undone.';
  @Input() confirmLabel = 'Delete';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}

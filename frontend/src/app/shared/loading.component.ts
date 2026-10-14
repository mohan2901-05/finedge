import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="loading" role="status" aria-live="polite">
      <span class="spinner" aria-hidden="true"></span>
      <span>{{ message }}</span>
    </div>
  `,
  styles: [`
    .loading { display: flex; align-items: center; gap: .6rem; padding: 1rem; color: var(--muted); font-size: .9rem; }
    .spinner { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--primary); animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoadingComponent {
  @Input() message = 'Loading…';
}

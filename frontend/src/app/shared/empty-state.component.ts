import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty">
      <div class="empty-icon" aria-hidden="true">{{ icon }}</div>
      <h3>{{ title }}</h3>
      @if (message) { <p>{{ message }}</p> }
      <ng-content />
    </div>
  `,
  styles: [`
    .empty { text-align: center; padding: 2.5rem 1rem; color: var(--muted); }
    .empty-icon { font-size: 2rem; margin-bottom: .5rem; }
    .empty h3 { margin: 0 0 .25rem; color: var(--text); }
    .empty p { margin: 0 0 1rem; }
  `]
})
export class EmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() message = '';
  @Input() icon = '📭';
}

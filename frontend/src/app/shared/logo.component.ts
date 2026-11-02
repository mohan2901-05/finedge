import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      [attr.aria-label]="ariaLabel"
    >
      <!-- FinEdge mark: geometric F-inspired forward pathway -->
      <path
        d="M6 6h10v2H8v6h8v2H6z"
        [attr.fill]="markColor"
      />
      <path
        d="M14 6h6v2h-6zM8 14h6v2H8z"
        [attr.fill]="accentColor"
      />
    </svg>
  `,
  styles: [`
    :host { display: inline-block; vertical-align: middle; }
    svg { display: block; }
  `]
})
export class LogoComponent {
  @Input() size = 32;
  @Input() variant: 'light' | 'dark' = 'light';
  @Input() ariaLabel = 'FinEdge';

  get markColor(): string {
    return this.variant === 'dark' ? '#ffffff' : '#0f172a';
  }

  get accentColor(): string {
    return this.variant === 'dark' ? '#ffffff' : '#16a34a';
  }
}

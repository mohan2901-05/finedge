import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LogoComponent } from '../../shared/logo.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  private readonly router = inject(Router);

  readonly media = matchMedia('(prefers-reduced-motion: reduce)');
  readonly reducedMotion = signal(this.media.matches);

  constructor() {
    this.media.addEventListener('change', () => {
      this.reducedMotion.set(this.media.matches);
    });

    // Auto-transition to the landing page after ~1.75 seconds.
    setTimeout(() => this.continueToLanding(), 1750);
  }

  continueToLanding(): void {
    this.router.navigateByUrl('/landing');
  }
}

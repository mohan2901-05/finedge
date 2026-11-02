import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LogoComponent } from '../../shared/logo.component';

interface PlaceholderData {
  title: string;
  subtitle?: string;
  primaryActionLabel?: string;
  primaryActionRoute?: string;
  secondaryActionLabel?: string;
  secondaryActionRoute?: string;
}

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule, RouterLink, LogoComponent],
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.scss'
})
export class PlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  readonly data = this.route.snapshot.data as PlaceholderData;

  readonly title = this.data.title ?? 'Coming soon';
  readonly subtitle = this.data.subtitle ?? 'This area is under development.';
  readonly primaryActionLabel = this.data.primaryActionLabel ?? 'Return to landing page';
  readonly primaryActionRoute = this.data.primaryActionRoute ?? '/landing';
  readonly secondaryActionLabel = this.data.secondaryActionLabel;
  readonly secondaryActionRoute = this.data.secondaryActionRoute;
}

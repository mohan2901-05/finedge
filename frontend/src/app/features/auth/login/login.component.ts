import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { LogoComponent } from '../../../shared/logo.component';
import { AuthService } from '../../../core/auth.service';
import { AuthLoginRequest } from '../../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly submitted = signal(false);

  readonly form: AuthLoginRequest = {
    userEmail: '',
    password: ''
  };

  private clearMessages(): void {
    this.error.set(null);
  }

  get isFormValid(): boolean {
    return !!(
      this.form.userEmail.trim() &&
      this.form.password.trim() &&
      this.isEmailValid(this.form.userEmail)
    );
  }

  isEmailValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  onSubmit(): void {
    if (this.loading()) return;

    this.submitted.set(true);
    this.clearMessages();

    if (!this.form.userEmail.trim()) {
      this.error.set('Email is required.');
      return;
    }

    if (!this.isEmailValid(this.form.userEmail)) {
      this.error.set('Please enter a valid email address.');
      return;
    }

    if (!this.form.password.trim()) {
      this.error.set('Password is required.');
      return;
    }

    this.loading.set(true);

    const payload: AuthLoginRequest = {
      userEmail: this.form.userEmail.trim(),
      password: this.form.password.trim()
    };

    this.authService.login(payload).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: () => {
        this.router.navigateByUrl('/borrower');
      },
      error: (err: any) => {
        this.error.set(
          err?.error?.message ||
          err?.message ||
          'Invalid email or password. Please try again.'
        );
      }
    });
  }
}

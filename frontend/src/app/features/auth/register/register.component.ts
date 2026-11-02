import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../../../shared/logo.component';
import { AuthService } from '../../../core/auth.service';
import { AuthRegisterRequest } from '../../../core/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LogoComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly submitted = signal(false);

  readonly form: AuthRegisterRequest = {
    userName: '',
    password: '',
    userEmail: ''
  };

  private clearMessages(): void {
    this.error.set(null);
    this.success.set(null);
  }

  get isFormValid(): boolean {
    return !!(
      this.form.userName.trim() &&
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

    if (!this.form.userName.trim()) {
      this.error.set('Full name is required.');
      return;
    }

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

    const payload: AuthRegisterRequest = {
      userName: this.form.userName.trim(),
      userEmail: this.form.userEmail.trim(),
      password: this.form.password.trim(),
      dob: this.form.dob?.trim() || undefined,
      panNo: this.form.panNo?.trim() || undefined
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(
          'Registration complete. You can now log in with your email and password.'
        );
        this.form.password = '';
      },
      error: (err: any) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ||
          err?.message ||
          'Registration failed. Please try again.'
        );
      }
    });
  }
}

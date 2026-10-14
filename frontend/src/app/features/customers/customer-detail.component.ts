import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CustomerService } from '../../core/customer.service';
import { AccountService } from '../../core/account.service';
import { LoanService } from '../../core/loan.service';
import { NotificationService } from '../../shared/notification.service';
import { Account, Customer, Loan } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss'
})
export class CustomerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customers = inject(CustomerService);
  private readonly accounts = inject(AccountService);
  private readonly loans = inject(LoanService);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly customer = signal<Customer | null>(null);
  readonly accountsList = signal<Account[]>([]);
  readonly loansList = signal<Loan[]>([]);
  confirmDelete = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({
      customer: this.customers.getById(id),
      accounts: this.accounts.list({ customerId: id, size: 50 }),
      loans: this.loans.list({ customerId: id, size: 50 })
    }).subscribe({
      next: ({ customer, accounts, loans }) => {
        this.customer.set(customer);
        this.accountsList.set(accounts.content ?? []);
        this.loansList.set(loans.content ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load customer.');
        this.loading.set(false);
      }
    });
  }

  delete(): void {
    const id = this.customer()?.id;
    if (!id) return;
    this.confirmDelete = false;
    this.customers.remove(id).subscribe({
      next: () => {
        this.toast.success('Customer deleted.');
        this.router.navigate(['/customers']);
      },
      error: () => this.toast.error('Failed to delete customer.')
    });
  }
}

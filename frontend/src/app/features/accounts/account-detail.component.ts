import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AccountService } from '../../core/account.service';
import { TransactionService } from '../../core/transaction.service';
import { NotificationService } from '../../shared/notification.service';
import { Account, Transaction } from '../../core/models';
import { LoadingComponent } from '../../shared/loading.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.scss'
})
export class AccountDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly accounts = inject(AccountService);
  private readonly transactions = inject(TransactionService);
  private readonly toast = inject(NotificationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly account = signal<Account | null>(null);
  readonly txns = signal<Transaction[]>([]);
  confirmDelete = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({
      account: this.accounts.getById(id),
      txns: this.transactions.list({ accountId: id, size: 20 })
    }).subscribe({
      next: ({ account, txns }) => {
        this.account.set(account);
        this.txns.set(txns.content ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load account.');
        this.loading.set(false);
      }
    });
  }

  delete(): void {
    const id = this.account()?.id;
    if (!id) return;
    this.confirmDelete = false;
    this.accounts.remove(id).subscribe({
      next: () => {
        this.toast.success('Account deleted.');
        this.router.navigate(['/accounts']);
      },
      error: () => this.toast.error('Failed to delete account.')
    });
  }
}

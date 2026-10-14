import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'Dashboard'
      },
      {
        path: 'customers',
        loadComponent: () => import('./features/customers/customer-list.component').then((m) => m.CustomerListComponent),
        title: 'Customers'
      },
      {
        path: 'customers/new',
        loadComponent: () => import('./features/customers/customer-form.component').then((m) => m.CustomerFormComponent),
        title: 'New customer'
      },
      {
        path: 'customers/:id',
        loadComponent: () => import('./features/customers/customer-detail.component').then((m) => m.CustomerDetailComponent),
        title: 'Customer detail'
      },
      {
        path: 'customers/:id/edit',
        loadComponent: () => import('./features/customers/customer-form.component').then((m) => m.CustomerFormComponent),
        title: 'Edit customer'
      },
      {
        path: 'accounts',
        loadComponent: () => import('./features/accounts/account-list.component').then((m) => m.AccountListComponent),
        title: 'Accounts'
      },
      {
        path: 'accounts/new',
        loadComponent: () => import('./features/accounts/account-form.component').then((m) => m.AccountFormComponent),
        title: 'New account'
      },
      {
        path: 'accounts/:id',
        loadComponent: () => import('./features/accounts/account-detail.component').then((m) => m.AccountDetailComponent),
        title: 'Account detail'
      },
      {
        path: 'accounts/:id/edit',
        loadComponent: () => import('./features/accounts/account-form.component').then((m) => m.AccountFormComponent),
        title: 'Edit account'
      },
      {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/transaction-list.component').then((m) => m.TransactionListComponent),
        title: 'Transactions'
      },
      {
        path: 'transactions/new',
        loadComponent: () => import('./features/transactions/transaction-form.component').then((m) => m.TransactionFormComponent),
        title: 'New transaction'
      },
      {
        path: 'loans',
        loadComponent: () => import('./features/loans/loan-list.component').then((m) => m.LoanListComponent),
        title: 'Loans'
      },
      {
        path: 'loans/new',
        loadComponent: () => import('./features/loans/loan-form.component').then((m) => m.LoanFormComponent),
        title: 'New loan'
      },
      {
        path: 'loans/:id',
        loadComponent: () => import('./features/loans/loan-detail.component').then((m) => m.LoanDetailComponent),
        title: 'Loan detail'
      },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];

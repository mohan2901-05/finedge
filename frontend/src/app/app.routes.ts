import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { WelcomeComponent } from './features/welcome/welcome.component';
import { LandingComponent } from './features/landing/landing.component';
import { PlaceholderComponent } from './features/placeholder/placeholder.component';
import { EmiCalculatorComponent } from './features/emi-calculator/emi-calculator.component';
import { FinancierDirectoryComponent } from './features/financier-directory/financier-directory.component';
import { BorrowerComponent } from './features/borrower/borrower.component';
import { BorrowerDashboardComponent } from './features/borrower/dashboard/dashboard.component';
import { BorrowerApplicationDetailComponent } from './features/borrower/application-detail/application-detail.component';
import { FinancierDashboardComponent } from './features/financier-dashboard/financier-dashboard.component';
import { FinancierReviewComponent } from './features/financier-review/financier-review.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { canActivateAuth, canMatchAuth } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'landing', component: LandingComponent },
  {
    path: 'borrower',
    component: BorrowerComponent,
    title: 'Borrower Application',
    canActivate: [canActivateAuth],
    canMatch: [canMatchAuth],
  },
  {
    path: 'dashboard',
    component: BorrowerDashboardComponent,
    title: 'Borrower Dashboard',
    canActivate: [canActivateAuth],
    canMatch: [canMatchAuth],
  },
  {
    path: 'dashboard/application/:id',
    component: BorrowerApplicationDetailComponent,
    title: 'Application Details',
    canActivate: [canActivateAuth],
    canMatch: [canMatchAuth],
  },
  {
    path: 'financier/dashboard',
    component: FinancierDashboardComponent,
    title: 'Financier Dashboard',
    canActivate: [canActivateAuth],
    canMatch: [canMatchAuth],
  },
  {
    path: 'financier/application/:id',
    component: FinancierReviewComponent,
    title: 'Application Review',
    canActivate: [canActivateAuth],
    canMatch: [canMatchAuth],
  },
  {
    path: 'financier',
    component: FinancierDirectoryComponent,
    title: 'Financier Directory'
  },
  {
    path: 'emi-calculator',
    component: EmiCalculatorComponent,
    title: 'EMI Calculator'
  },
  {
    path: 'auth',
    children: [
      { path: 'register', component: RegisterComponent, title: 'Register' },
      { path: 'login', component: LoginComponent, title: 'Sign in' }
    ]
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'overview',
        loadComponent: () => import('./features/overview/overview.component').then((m) => m.OverviewComponent),
        title: 'Overview'
      },
      {
        path: 'orgs',
        loadComponent: () => import('./features/organizations/organization-list.component').then((m) => m.OrganizationListComponent),
        title: 'Organizations'
      },
      {
        path: 'orgs/new',
        loadComponent: () => import('./features/organizations/organization-form.component').then((m) => m.OrganizationFormComponent),
        title: 'New organization'
      },
      {
        path: 'orgs/:id',
        loadComponent: () => import('./features/organizations/organization-detail.component').then((m) => m.OrganizationDetailComponent),
        title: 'Organization detail'
      },
      {
        path: 'orgs/:id/edit',
        loadComponent: () => import('./features/organizations/organization-form.component').then((m) => m.OrganizationFormComponent),
        title: 'Edit organization'
      },
      {
        path: 'roles',
        loadComponent: () => import('./features/roles/role-list.component').then((m) => m.RoleListComponent),
        title: 'Roles'
      },
      {
        path: 'roles/new',
        loadComponent: () => import('./features/roles/role-form.component').then((m) => m.RoleFormComponent),
        title: 'New role'
      },
      {
        path: 'roles/:id',
        loadComponent: () => import('./features/roles/role-detail.component').then((m) => m.RoleDetailComponent),
        title: 'Role detail'
      },
      {
        path: 'roles/:id/edit',
        loadComponent: () => import('./features/roles/role-form.component').then((m) => m.RoleFormComponent),
        title: 'Edit role'
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/user-list.component').then((m) => m.UserListComponent),
        title: 'Users'
      },
      {
        path: 'users/new',
        loadComponent: () => import('./features/users/user-form.component').then((m) => m.UserFormComponent),
        title: 'New user'
      },
      {
        path: 'users/:id',
        loadComponent: () => import('./features/users/user-detail.component').then((m) => m.UserDetailComponent),
        title: 'User detail'
      },
      {
        path: 'users/:id/edit',
        loadComponent: () => import('./features/users/user-form.component').then((m) => m.UserFormComponent),
        title: 'Edit user'
      },
      {
        path: 'access',
        loadComponent: () => import('./features/access/access-list.component').then((m) => m.AccessListComponent),
        title: 'Access assignments'
      },
      {
        path: 'intake',
        loadComponent: () => import('./features/intake/intake-list.component').then((m) => m.IntakeListComponent),
        title: 'Loan intake'
      },
      {
        path: 'intake/new',
        loadComponent: () => import('./features/intake/intake-form.component').then((m) => m.IntakeFormComponent),
        title: 'New application'
      },
      {
        path: 'intake/:id',
        loadComponent: () => import('./features/intake/intake-detail.component').then((m) => m.IntakeDetailComponent),
        title: 'Application detail'
      },
      {
        path: 'intake/:id/edit',
        loadComponent: () => import('./features/intake/intake-form.component').then((m) => m.IntakeFormComponent),
        title: 'Edit application'
      },
      {
        path: 'loans',
        loadComponent: () => import('./features/loans/loan-list.component').then((m) => m.LoanListComponent),
        title: 'Loans'
      },
      {
        path: 'loans/new',
        loadComponent: () => import('./features/loans/loan-form.component').then((m) => m.LoanFormComponent),
        title: 'Book loan'
      },
      {
        path: 'loans/:id',
        loadComponent: () => import('./features/loans/loan-detail.component').then((m) => m.LoanDetailComponent),
        title: 'Loan detail'
      },
      {
        path: 'loans/:id/edit',
        loadComponent: () => import('./features/loans/loan-form.component').then((m) => m.LoanFormComponent),
        title: 'Edit loan'
      },
      {
        path: 'collections',
        loadComponent: () => import('./features/collections/collection-list.component').then((m) => m.CollectionListComponent),
        title: 'Collections'
      },
      {
        path: 'collections/new',
        loadComponent: () => import('./features/collections/collection-form.component').then((m) => m.CollectionFormComponent),
        title: 'Record collection'
      },
      {
        path: 'collections/:id/edit',
        loadComponent: () => import('./features/collections/collection-form.component').then((m) => m.CollectionFormComponent),
        title: 'Correct collection'
      },
      {
        path: 'audit',
        loadComponent: () => import('./features/audit/audit-list.component').then((m) => m.AuditListComponent),
        title: 'Audit trail'
      },
      { path: '**', redirectTo: 'overview' }
    ]
  },
  { path: '**', redirectTo: '' }
];

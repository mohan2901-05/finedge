export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type AccountType = 'CHECKING' | 'SAVINGS' | 'BUSINESS' | 'MONEY_MARKET';
export type AccountStatus = 'ACTIVE' | 'DORMANT' | 'FROZEN' | 'CLOSED';
export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'PAYMENT' | 'FEE';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'REVERSED';
export type LoanType = 'PERSONAL' | 'MORTGAGE' | 'AUTO' | 'BUSINESS' | 'EDUCATION';
export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Customer {
  id: number;
  customerNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  status: CustomerStatus;
  accountCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  status?: CustomerStatus;
}

export interface CustomerUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  status?: CustomerStatus;
}

export interface Account {
  id: number;
  accountNumber: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  accountType: AccountType;
  balance: number;
  currency: string;
  status: AccountStatus;
  openedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountCreateRequest {
  customerId: number;
  accountType: AccountType;
  initialBalance: number;
  currency?: string;
  status?: AccountStatus;
}

export interface AccountUpdateRequest {
  accountType?: AccountType;
  status?: AccountStatus;
}

export interface Transaction {
  id: number;
  transactionReference: string;
  accountId: number;
  accountNumber: string;
  customerName: string;
  transactionType: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  status: TransactionStatus;
  transactionDate: string;
  createdAt: string;
}

export interface TransactionCreateRequest {
  accountId: number;
  transactionType: TransactionType;
  amount: number;
  description: string;
}

export interface TransactionUpdateRequest {
  description?: string;
  status?: TransactionStatus;
}

export interface Loan {
  id: number;
  applicationNumber: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  loanType: LoanType;
  requestedAmount: number;
  interestRate: number;
  tenureMonths: number;
  purpose: string;
  status: LoanStatus;
  applicationDate: string;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanCreateRequest {
  customerId: number;
  loanType: LoanType;
  requestedAmount: number;
  interestRate: number;
  tenureMonths: number;
  purpose: string;
}

export interface LoanUpdateRequest {
  status: LoanStatus;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface DashboardSummary {
  totalCustomers: number;
  activeAccounts: number;
  totalDeposits: number;
  pendingLoans: number;
  approvedLoans: number;
  rejectedLoans: number;
  accountsByType: Record<string, number>;
  loansByStatus: Record<string, number>;
  monthlyVolume: Record<string, number>;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface PageQuery {
  page?: number;
  size?: number;
  search?: string;
}

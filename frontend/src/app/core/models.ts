// FinEdge ETFDB API models. Field names match the backend DTO JSON exactly.
// IDs are strings (application-assigned), except loan intake (number).
// Responses never contain password or PAN values.

export interface Organization {
  orgId: string;
  orgName: string;
  orgEmail: string;
  status: string;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface OrganizationCreateRequest {
  orgName: string;
  orgEmail: string;
  status?: string;
}

export interface OrganizationUpdateRequest {
  orgName?: string;
  orgEmail?: string;
  status?: string;
}

export interface Role {
  roleId: string;
  orgId: string;
  orgName?: string;
  roleName: string;
  roleDescription?: string;
  status: string;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface RoleCreateRequest {
  orgId: string;
  roleName: string;
  roleDescription?: string;
  status?: string;
}

export interface RoleUpdateRequest {
  roleName?: string;
  roleDescription?: string;
  status?: string;
}

export interface User {
  userId: string;
  orgId: string;
  roleId: string;
  roleName?: string;
  userName: string;
  userEmail: string;
  dob?: string;
  status: string;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface UserCreateRequest {
  orgId: string;
  roleId: string;
  userName: string;
  password: string;
  userEmail: string;
  dob?: string;
  panNo?: string;
  status?: string;
}

export interface UserUpdateRequest {
  userName?: string;
  userEmail?: string;
  dob?: string;
  roleId?: string;
  status?: string;
}

export interface Module {
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface ModuleCreateRequest {
  moduleName: string;
  moduleCode: string;
}

export interface ModuleUpdateRequest {
  moduleName?: string;
  moduleCode?: string;
}

export interface Permission {
  permissionId: string;
  permissionName: string;
  permissionCode: string;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface PermissionCreateRequest {
  permissionName: string;
  permissionCode: string;
}

export interface PermissionUpdateRequest {
  permissionName?: string;
  permissionCode?: string;
}

export interface RoleMapping {
  mappingId: string;
  orgId: string;
  roleId: string;
  moduleId: string;
  moduleCode?: string;
  permissionId: string;
  permissionCode?: string;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface RoleMappingCreateRequest {
  orgId: string;
  roleId: string;
  moduleId: string;
  permissionId: string;
}

export interface Intake {
  id: number;
  ref: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerDob?: string;
  customerCity: string;
  customerAddress: string;
  financierKey: string;
  financierLabel: string;
  loanAmount: number;
  tenureMonths: number;
  interestRate: number;
  emi: number;
  totalInterest: number;
  totalPayable: number;
  status: string;
  createdAt: string;
}

export interface IntakeCreateRequest {
  ref: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerDob?: string;
  customerPan?: string;
  customerCity: string;
  customerAddress: string;
  financierKey: string;
  financierLabel: string;
  loanAmount: number;
  tenureMonths: number;
  interestRate: number;
  emi: number;
  totalInterest: number;
  totalPayable: number;
  status?: string;
}

export interface IntakeUpdateRequest {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerDob?: string;
  customerCity?: string;
  customerAddress?: string;
  financierKey?: string;
  financierLabel?: string;
  loanAmount?: number;
  tenureMonths?: number;
  interestRate?: number;
  emi?: number;
  totalInterest?: number;
  totalPayable?: number;
  status?: string;
}

export interface Loan {
  loanId: string;
  orgId: string;
  userId: string;
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  purpose?: string;
  applicationDate?: string;
  approvalDate?: string;
  disbursementDate?: string;
  dueDate?: string;
  outstandingAmount?: number;
  received?: boolean;
  status: string;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface LoanCreateRequest {
  orgId: string;
  userId: string;
  loanAmount: number;
  interestRate?: number;
  tenureMonths: number;
  purpose?: string;
  applicationDate?: string;
  approvalDate?: string;
  disbursementDate?: string;
  dueDate?: string;
  outstandingAmount?: number;
  received?: boolean;
  status?: string;
}

export interface LoanUpdateRequest {
  purpose?: string;
  approvalDate?: string;
  disbursementDate?: string;
  dueDate?: string;
  outstandingAmount?: number;
  received?: boolean;
  status?: string;
}

export interface LoanActivity {
  activityId: string;
  userId: string;
  loanId: string;
  activityCode: string;
  statusCode: string;
  updatedOn: string;
}

export interface LoanActivityCreateRequest {
  userId: string;
  loanId: string;
  activityCode: string;
  statusCode: string;
}

export interface Repayment {
  repaymentId: string;
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  openingPrincipal: number;
  installmentAmount: number;
  principal: number;
  interest: number;
  advanceFlag?: string;
  closingPrincipal: number;
  rate: number;
  createdAt: string;
}

export interface RepaymentCreateRequest {
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  openingPrincipal: number;
  installmentAmount: number;
  principal: number;
  interest: number;
  advanceFlag?: string;
  closingPrincipal: number;
  rate: number;
}

export interface Collection {
  collectionId: string;
  orgId: string;
  loanId: string;
  userId: string;
  collectionAmount: number;
  collectionDate?: string;
  paymentMode?: string;
  referenceNo?: string;
  collectedByUserId?: string;
  remarks?: string;
  status?: string;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface CollectionCreateRequest {
  orgId: string;
  loanId: string;
  userId: string;
  collectionAmount: number;
  collectionDate?: string;
  paymentMode?: string;
  referenceNo?: string;
  collectedByUserId?: string;
  remarks?: string;
  status?: string;
}

export interface CollectionUpdateRequest {
  referenceNo?: string;
  remarks?: string;
  status?: string;
}

export interface AuditEntry {
  auditId: string;
  orgId: string;
  userId: string;
  userName: string;
  action: string;
  details?: string;
  createdDatetime: string;
}

export interface FinancierProfile {
  financierId: string;
  institutionName: string;
  description?: string;
  indicativeAnnualRate?: number;
  minLoanAmount?: number;
  maxLoanAmount?: number;
  availableTenureMonths?: number;
  status?: string;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface FinancierProfileCreateRequest {
  institutionName: string;
  description?: string;
  indicativeAnnualRate?: number;
  minLoanAmount?: number;
  maxLoanAmount?: number;
  availableTenureMonths?: number;
  status?: string;
}

export interface FinancierProfileUpdateRequest {
  institutionName?: string;
  description?: string;
  indicativeAnnualRate?: number;
  minLoanAmount?: number;
  maxLoanAmount?: number;
  availableTenureMonths?: number;
  status?: string;
}

export interface FinancierQuery {
  search?: string;
  sortBy?: 'name' | 'rate' | 'minAmount' | 'maxAmount' | 'tenure';
  sortDir?: 'asc' | 'desc';
  page?: number;
  size?: number;
  status?: string;
}

export interface LoanApplicationCreateRequest {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerDob?: string;
  customerPan?: string;
  customerCity: string;
  customerAddress: string;
  financierKey: string;
  loanAmount: number;
  tenureMonths: number;
  interestRate: number;
}

export interface LoanApplicationResponse {
  id: number;
  ref: string;
  custUserId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerDob?: string;
  customerCity: string;
  customerAddress: string;
  financierKey: string;
  financierLabel: string;
  loanAmount: number;
  tenureMonths: number;
  interestRate: number;
  emi: number;
  totalInterest: number;
  totalPayable: number;
  status: string;
  createdAt: string;
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
}

// Authentication request/response contracts. Field names match the backend
// AuthRegisterRequest, AuthLoginRequest, AuthResponse and UserDTO JSON exactly.
//
// Registration returns only a UserDTO (no access token), so the client must not
// treat a successful registration as an authenticated session. Login returns the
// access token plus expiry metadata; the backend remains authoritative for token
// validity. Client-side expiry checks are a best-effort hint only.
export interface AuthRegisterRequest {
  userName: string;
  password: string;
  userEmail: string;
  dob?: string;
  panNo?: string;
}

export interface AuthLoginRequest {
  userEmail: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number; // seconds
  expiresAt: string; // ISO-8601 instant (UTC)
  user: User; // matches backend UserDTO (no password or PAN)
}

// Roadmap G — Disbursement and Repayment contracts.
export interface DisbursementCreateRequest {
  disbursedAmount: number; // positive BigDecimal mapped to number
}

export interface DisbursementDTO {
  disbursementId: string;
  applicationId: number;
  disbursedAmount: number;
  loanAmount: number;
  disbursedAt: string; // ISO-8601
  disbursedByUserId: string;
  createdDatetime: string;
}

export interface DisbursementRepaymentCreateRequest {
  repaymentAmount: number; // positive BigDecimal mapped to number
}

export interface DisbursementRepaymentResponse {
  repaymentId: string;
  applicationId: number;
  repaymentAmount: number;
  paidAt: string;
  paidByUserId: string;
  createdDatetime: string;
}

export interface OutstandingDTO {
  applicationId: number;
  disbursed: boolean;
  disbursedAmount: number;
  totalRepaid: number;
  outstandingAmount: number;
  fullyRepaid: boolean;
}

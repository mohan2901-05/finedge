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

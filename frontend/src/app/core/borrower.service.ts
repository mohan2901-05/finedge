import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import {
  LoanApplicationCreateRequest,
  LoanApplicationResponse,
  PageResponse,
} from './models';

/**
 * Borrower-facing loan application service.
 *
 * Submits applications to {@code POST /api/etfdb/loan-applications}.
 * Ownership is derived by the backend from the authenticated user;
 * the client never sends a borrower/user ID.
 *
 * {@code ref}, {@code emi}, {@code totalInterest}, and {@code totalPayable}
 * are server-generated and must not be sent in the request.
 *
 * All read operations are borrower-scoped by the backend via the
 * authenticated user's security context. The frontend never supplies
 * a borrower ID.
 */
@Injectable({ providedIn: 'root' })
export class BorrowerService {
  private readonly api = inject(ApiService);

  submitApplication(application: LoanApplicationCreateRequest): Observable<LoanApplicationResponse> {
    return this.api.post<LoanApplicationResponse>('/etfdb/loan-applications', application);
  }

  /** Lists the authenticated borrower's own applications, borrower-scoped by the backend. */
  list(status?: string, page = 0, size = 10): Observable<PageResponse<LoanApplicationResponse>> {
    return this.api.get<PageResponse<LoanApplicationResponse>>('/etfdb/loan-applications', {
      status,
      page,
      size,
    });
  }

  /** Gets a single application by ID, borrower-scoped by the backend. */
  getById(id: number): Observable<LoanApplicationResponse> {
    return this.api.get<LoanApplicationResponse>(`/etfdb/loan-applications/${id}`);
  }
}

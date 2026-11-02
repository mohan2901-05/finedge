import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import {
  LoanApplicationResponse,
  PageResponse,
} from './models';

/**
 * Financier-facing loan application review service.
 *
 * All endpoints are financier-scoped by the backend: the authenticated
 * user's associated financier institution determines which applications
 * are visible. The client never supplies a financier or user ID.
 *
 * Status transitions enforced by the backend:
 *   {@code Pending Review} → {@code Approved} or {@code Rejected}.
 * Already-decided applications cannot be re-transitioned.
 */
@Injectable({ providedIn: 'root' })
export class FinancierService {
  private readonly api = inject(ApiService);

  /** Lists the current financier's own applications, borrower-scoped by the backend. */
  listForFinancier(status?: string, page = 0, size = 10): Observable<PageResponse<LoanApplicationResponse>> {
    return this.api.get<PageResponse<LoanApplicationResponse>>('/etfdb/loan-applications/financier', {
      status,
      page,
      size,
    });
  }

  /** Gets a single application by ID, financier-scoped by the backend. */
  getByIdForFinancier(id: number): Observable<LoanApplicationResponse> {
    return this.api.get<LoanApplicationResponse>(`/etfdb/loan-applications/financier/${id}`);
  }

  /** Approves a Pending Review application owned by the current financier. */
  approve(id: number): Observable<LoanApplicationResponse> {
    return this.api.put<LoanApplicationResponse>(`/etfdb/loan-applications/financier/${id}/approve`, null);
  }

  /** Rejects a Pending Review application owned by the current financier. */
  reject(id: number): Observable<LoanApplicationResponse> {
    return this.api.put<LoanApplicationResponse>(`/etfdb/loan-applications/financier/${id}/reject`, null);
  }
}

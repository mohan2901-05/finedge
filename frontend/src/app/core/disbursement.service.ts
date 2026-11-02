import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  DisbursementDTO,
  DisbursementCreateRequest,
  OutstandingDTO,
  DisbursementRepaymentResponse,
  DisbursementRepaymentCreateRequest,
  PageResponse,
} from './models';

/**
 * Disbursement and repayment operations for loan applications (Roadmap G).
 *
 * Endpoints are sub-resources of /api/etfdb/loan-applications:
 *   POST /{id}/disburse         — financier-admin only (backend enforces role)
 *   GET  /{id}/disbursement     — current user scope
 *   GET  /{id}/outstanding      — current user scope
 *   POST /{id}/repayments       — borrower-scoped to own loan
 *   GET  /{id}/repayments       — current user scope (paginated)
 */
@Injectable({ providedIn: 'root' })
export class DisbursementService {
  private readonly api = inject(ApiService);

  disburse(id: number, body: DisbursementCreateRequest): Observable<DisbursementDTO> {
    return this.api.post<DisbursementDTO>(`/etfdb/loan-applications/${id}/disburse`, body);
  }

  getDisbursement(id: number): Observable<DisbursementDTO> {
    return this.api.get<DisbursementDTO>(`/etfdb/loan-applications/${id}/disbursement`);
  }

  getOutstanding(id: number): Observable<OutstandingDTO> {
    return this.api.get<OutstandingDTO>(`/etfdb/loan-applications/${id}/outstanding`);
  }

  repay(id: number, body: DisbursementRepaymentCreateRequest): Observable<DisbursementRepaymentResponse> {
    return this.api.post<DisbursementRepaymentResponse>(`/etfdb/loan-applications/${id}/repayments`, body);
  }

  listRepayments(id: number, page = 0, size = 10): Observable<PageResponse<DisbursementRepaymentResponse>> {
    return this.api.get<PageResponse<DisbursementRepaymentResponse>>(`/etfdb/loan-applications/${id}/repayments`, {
      page,
      size,
    });
  }
}

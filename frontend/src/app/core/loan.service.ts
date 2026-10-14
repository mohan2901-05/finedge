import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Collection, Loan, LoanActivity, LoanCreateRequest, LoanUpdateRequest, PageResponse, Repayment } from './models';

export interface LoanQuery {
  orgId?: string;
  userId?: string;
  status?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class LoanService {
  private readonly api = inject(ApiService);

  list(query: LoanQuery = {}): Observable<PageResponse<Loan>> {
    return this.api.get<PageResponse<Loan>>('/etfdb/loans', {
      orgId: query.orgId, userId: query.userId, status: query.status,
      page: query.page ?? 0, size: query.size ?? 10
    });
  }

  getById(id: string): Observable<Loan> {
    return this.api.get<Loan>(`/etfdb/loans/${id}`);
  }

  activities(id: string, page = 0, size = 10): Observable<PageResponse<LoanActivity>> {
    return this.api.get<PageResponse<LoanActivity>>(`/etfdb/loans/${id}/activities`, { page, size });
  }

  repayments(id: string, page = 0, size = 10): Observable<PageResponse<Repayment>> {
    return this.api.get<PageResponse<Repayment>>(`/etfdb/loans/${id}/repayments`, { page, size });
  }

  collections(id: string, page = 0, size = 10): Observable<PageResponse<Collection>> {
    return this.api.get<PageResponse<Collection>>(`/etfdb/loans/${id}/collections`, { page, size });
  }

  create(body: LoanCreateRequest): Observable<Loan> {
    return this.api.post<Loan>('/etfdb/loans', body);
  }

  update(id: string, body: LoanUpdateRequest): Observable<Loan> {
    return this.api.put<Loan>(`/etfdb/loans/${id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.api.remove(`/etfdb/loans/${id}`);
  }
}

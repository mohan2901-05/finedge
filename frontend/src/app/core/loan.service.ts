import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Loan, LoanCreateRequest, LoanUpdateRequest, PageResponse } from './models';

export interface LoanQuery {
  customerId?: number;
  loanType?: string;
  status?: string;
  search?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class LoanService {
  private readonly api = inject(ApiService);

  list(query: LoanQuery = {}): Observable<PageResponse<Loan>> {
    return this.api.get<PageResponse<Loan>>('/loans', {
      customerId: query.customerId, loanType: query.loanType, status: query.status,
      search: query.search, page: query.page ?? 0, size: query.size ?? 10
    });
  }

  getById(id: number): Observable<Loan> {
    return this.api.get<Loan>(`/loans/${id}`);
  }

  create(body: LoanCreateRequest): Observable<Loan> {
    return this.api.post<Loan>('/loans', body);
  }

  update(id: number, body: LoanUpdateRequest): Observable<Loan> {
    return this.api.put<Loan>(`/loans/${id}`, body);
  }

  remove(id: number): Observable<void> {
    return this.api.remove(`/loans/${id}`);
  }
}

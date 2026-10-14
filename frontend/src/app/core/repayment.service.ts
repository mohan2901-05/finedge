import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PageResponse, Repayment, RepaymentCreateRequest } from './models';

@Injectable({ providedIn: 'root' })
export class RepaymentService {
  private readonly api = inject(ApiService);

  list(loanId?: string, page = 0, size = 10): Observable<PageResponse<Repayment>> {
    return this.api.get<PageResponse<Repayment>>('/etfdb/repayments', { loanId, page, size });
  }

  getById(id: string): Observable<Repayment> {
    return this.api.get<Repayment>(`/etfdb/repayments/${id}`);
  }

  create(body: RepaymentCreateRequest): Observable<Repayment> {
    return this.api.post<Repayment>('/etfdb/repayments', body);
  }

  remove(id: string): Observable<void> {
    return this.api.remove(`/etfdb/repayments/${id}`);
  }
}

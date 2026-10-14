import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { LoanActivity, LoanActivityCreateRequest, PageResponse } from './models';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private readonly api = inject(ApiService);

  list(loanId?: string, page = 0, size = 10): Observable<PageResponse<LoanActivity>> {
    return this.api.get<PageResponse<LoanActivity>>('/etfdb/loan-activities', { loanId, page, size });
  }

  getById(id: string): Observable<LoanActivity> {
    return this.api.get<LoanActivity>(`/etfdb/loan-activities/${id}`);
  }

  create(body: LoanActivityCreateRequest): Observable<LoanActivity> {
    return this.api.post<LoanActivity>('/etfdb/loan-activities', body);
  }
}

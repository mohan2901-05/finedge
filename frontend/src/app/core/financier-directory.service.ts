import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  FinancierProfile,
  FinancierProfileCreateRequest,
  FinancierProfileUpdateRequest,
  FinancierQuery,
  PageResponse,
} from './models';

/**
 * Financier directory service.
 *
 * Calls the real backend API at {@code /etfdb/financiers}. Errors are
 * propagated to the caller (not swallowed into empty results) so the UI can
 * distinguish a genuine empty page from an API failure.
 */
@Injectable({ providedIn: 'root' })
export class FinancierDirectoryService {
  private readonly api = inject(ApiService);

  list(query: FinancierQuery = {}): Observable<PageResponse<FinancierProfile>> {
    return this.api.get<PageResponse<FinancierProfile>>('/etfdb/financiers', {
      search: query.search,
      sortBy: query.sortBy,
      sortDir: query.sortDir,
      page: query.page ?? 0,
      size: query.size ?? 10,
    });
  }

  getById(id: string): Observable<FinancierProfile> {
    return this.api.get<FinancierProfile>(`/etfdb/financiers/${id}`);
  }

  create(body: FinancierProfileCreateRequest): Observable<FinancierProfile> {
    return this.api.post<FinancierProfile>('/etfdb/financiers', body);
  }

  update(id: string, body: FinancierProfileUpdateRequest): Observable<FinancierProfile> {
    return this.api.put<FinancierProfile>(`/etfdb/financiers/${id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.api.remove(`/etfdb/financiers/${id}`);
  }
}

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Collection, CollectionCreateRequest, CollectionUpdateRequest, PageResponse } from './models';

export interface CollectionQuery {
  loanId?: string;
  orgId?: string;
  status?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class CollectionService {
  private readonly api = inject(ApiService);

  list(query: CollectionQuery = {}): Observable<PageResponse<Collection>> {
    return this.api.get<PageResponse<Collection>>('/etfdb/collections', {
      loanId: query.loanId, orgId: query.orgId, status: query.status,
      page: query.page ?? 0, size: query.size ?? 10
    });
  }

  getById(id: string): Observable<Collection> {
    return this.api.get<Collection>(`/etfdb/collections/${id}`);
  }

  create(body: CollectionCreateRequest): Observable<Collection> {
    return this.api.post<Collection>('/etfdb/collections', body);
  }

  update(id: string, body: CollectionUpdateRequest): Observable<Collection> {
    return this.api.put<Collection>(`/etfdb/collections/${id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.api.remove(`/etfdb/collections/${id}`);
  }
}

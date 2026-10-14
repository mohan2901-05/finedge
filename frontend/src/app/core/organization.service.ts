import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Organization, OrganizationCreateRequest, OrganizationUpdateRequest, PageResponse } from './models';

export interface OrganizationQuery {
  status?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly api = inject(ApiService);

  list(query: OrganizationQuery = {}): Observable<PageResponse<Organization>> {
    return this.api.get<PageResponse<Organization>>('/etfdb/organizations', {
      status: query.status, page: query.page ?? 0, size: query.size ?? 10
    });
  }

  getById(id: string): Observable<Organization> {
    return this.api.get<Organization>(`/etfdb/organizations/${id}`);
  }

  create(body: OrganizationCreateRequest): Observable<Organization> {
    return this.api.post<Organization>('/etfdb/organizations', body);
  }

  update(id: string, body: OrganizationUpdateRequest): Observable<Organization> {
    return this.api.put<Organization>(`/etfdb/organizations/${id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.api.remove(`/etfdb/organizations/${id}`);
  }
}

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PageResponse, Role, RoleCreateRequest, RoleMapping, RoleUpdateRequest } from './models';

export interface RoleQuery {
  orgId?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly api = inject(ApiService);

  list(query: RoleQuery = {}): Observable<PageResponse<Role>> {
    return this.api.get<PageResponse<Role>>('/etfdb/roles', {
      orgId: query.orgId, page: query.page ?? 0, size: query.size ?? 10
    });
  }

  getById(id: string): Observable<Role> {
    return this.api.get<Role>(`/etfdb/roles/${id}`);
  }

  permissions(id: string, page = 0, size = 10): Observable<PageResponse<RoleMapping>> {
    return this.api.get<PageResponse<RoleMapping>>(`/etfdb/roles/${id}/permissions`, { page, size });
  }

  create(body: RoleCreateRequest): Observable<Role> {
    return this.api.post<Role>('/etfdb/roles', body);
  }

  update(id: string, body: RoleUpdateRequest): Observable<Role> {
    return this.api.put<Role>(`/etfdb/roles/${id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.api.remove(`/etfdb/roles/${id}`);
  }
}

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PageResponse, RoleMapping, RoleMappingCreateRequest } from './models';

export interface RoleMappingQuery {
  orgId?: string;
  roleId?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class RoleMappingService {
  private readonly api = inject(ApiService);

  list(query: RoleMappingQuery = {}): Observable<PageResponse<RoleMapping>> {
    return this.api.get<PageResponse<RoleMapping>>('/etfdb/role-mappings', {
      orgId: query.orgId, roleId: query.roleId, page: query.page ?? 0, size: query.size ?? 10
    });
  }

  getById(id: string): Observable<RoleMapping> {
    return this.api.get<RoleMapping>(`/etfdb/role-mappings/${id}`);
  }

  create(body: RoleMappingCreateRequest): Observable<RoleMapping> {
    return this.api.post<RoleMapping>('/etfdb/role-mappings', body);
  }

  remove(id: string): Observable<void> {
    return this.api.remove(`/etfdb/role-mappings/${id}`);
  }
}

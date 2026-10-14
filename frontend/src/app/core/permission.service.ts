import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PageResponse, Permission, PermissionCreateRequest, PermissionUpdateRequest } from './models';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly api = inject(ApiService);

  list(page = 0, size = 10): Observable<PageResponse<Permission>> {
    return this.api.get<PageResponse<Permission>>('/etfdb/permissions', { page, size });
  }

  getById(id: string): Observable<Permission> {
    return this.api.get<Permission>(`/etfdb/permissions/${id}`);
  }

  create(body: PermissionCreateRequest): Observable<Permission> {
    return this.api.post<Permission>('/etfdb/permissions', body);
  }

  update(id: string, body: PermissionUpdateRequest): Observable<Permission> {
    return this.api.put<Permission>(`/etfdb/permissions/${id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.api.remove(`/etfdb/permissions/${id}`);
  }
}

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuditEntry, PageResponse } from './models';

export interface AuditQuery {
  orgId?: string;
  userId?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly api = inject(ApiService);

  list(query: AuditQuery = {}): Observable<PageResponse<AuditEntry>> {
    return this.api.get<PageResponse<AuditEntry>>('/etfdb/audit-logs', {
      orgId: query.orgId, userId: query.userId, page: query.page ?? 0, size: query.size ?? 10
    });
  }

  getById(id: string): Observable<AuditEntry> {
    return this.api.get<AuditEntry>(`/etfdb/audit-logs/${id}`);
  }
}

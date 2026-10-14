import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Intake, IntakeCreateRequest, IntakeUpdateRequest, PageResponse } from './models';

export interface IntakeQuery {
  status?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class IntakeService {
  private readonly api = inject(ApiService);

  list(query: IntakeQuery = {}): Observable<PageResponse<Intake>> {
    return this.api.get<PageResponse<Intake>>('/etfdb/loan-applications', {
      status: query.status, page: query.page ?? 0, size: query.size ?? 10
    });
  }

  getById(id: number): Observable<Intake> {
    return this.api.get<Intake>(`/etfdb/loan-applications/${id}`);
  }

  getByRef(ref: string): Observable<Intake> {
    return this.api.get<Intake>(`/etfdb/loan-applications/ref/${encodeURIComponent(ref)}`);
  }

  create(body: IntakeCreateRequest): Observable<Intake> {
    return this.api.post<Intake>('/etfdb/loan-applications', body);
  }

  update(id: number, body: IntakeUpdateRequest): Observable<Intake> {
    return this.api.put<Intake>(`/etfdb/loan-applications/${id}`, body);
  }

  remove(id: number): Observable<void> {
    return this.api.remove(`/etfdb/loan-applications/${id}`);
  }
}

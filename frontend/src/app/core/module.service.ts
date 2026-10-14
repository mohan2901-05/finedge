import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Module, ModuleCreateRequest, ModuleUpdateRequest, PageResponse } from './models';

@Injectable({ providedIn: 'root' })
export class ModuleService {
  private readonly api = inject(ApiService);

  list(page = 0, size = 10): Observable<PageResponse<Module>> {
    return this.api.get<PageResponse<Module>>('/etfdb/modules', { page, size });
  }

  getById(id: string): Observable<Module> {
    return this.api.get<Module>(`/etfdb/modules/${id}`);
  }

  create(body: ModuleCreateRequest): Observable<Module> {
    return this.api.post<Module>('/etfdb/modules', body);
  }

  update(id: string, body: ModuleUpdateRequest): Observable<Module> {
    return this.api.put<Module>(`/etfdb/modules/${id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.api.remove(`/etfdb/modules/${id}`);
  }
}

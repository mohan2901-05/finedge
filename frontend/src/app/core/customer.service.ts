import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Customer, CustomerCreateRequest, CustomerUpdateRequest, PageResponse } from './models';

export interface CustomerQuery {
  search?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly api = inject(ApiService);

  list(query: CustomerQuery = {}): Observable<PageResponse<Customer>> {
    return this.api.get<PageResponse<Customer>>('/customers', {
      search: query.search, page: query.page ?? 0, size: query.size ?? 10
    });
  }

  getById(id: number): Observable<Customer> {
    return this.api.get<Customer>(`/customers/${id}`);
  }

  create(body: CustomerCreateRequest): Observable<Customer> {
    return this.api.post<Customer>('/customers', body);
  }

  update(id: number, body: CustomerUpdateRequest): Observable<Customer> {
    return this.api.put<Customer>(`/customers/${id}`, body);
  }

  remove(id: number): Observable<void> {
    return this.api.remove(`/customers/${id}`);
  }
}

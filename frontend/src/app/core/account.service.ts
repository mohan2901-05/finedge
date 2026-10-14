import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Account, AccountCreateRequest, AccountUpdateRequest, PageResponse } from './models';

export interface AccountQuery {
  customerId?: number;
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly api = inject(ApiService);

  list(query: AccountQuery = {}): Observable<PageResponse<Account>> {
    return this.api.get<PageResponse<Account>>('/accounts', {
      customerId: query.customerId, type: query.type, status: query.status,
      search: query.search, page: query.page ?? 0, size: query.size ?? 10
    });
  }

  getById(id: number): Observable<Account> {
    return this.api.get<Account>(`/accounts/${id}`);
  }

  create(body: AccountCreateRequest): Observable<Account> {
    return this.api.post<Account>('/accounts', body);
  }

  update(id: number, body: AccountUpdateRequest): Observable<Account> {
    return this.api.put<Account>(`/accounts/${id}`, body);
  }

  remove(id: number): Observable<void> {
    return this.api.remove(`/accounts/${id}`);
  }
}

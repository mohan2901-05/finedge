import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PageResponse, Transaction, TransactionCreateRequest, TransactionUpdateRequest } from './models';

export interface TransactionQuery {
  accountId?: number;
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly api = inject(ApiService);

  list(query: TransactionQuery = {}): Observable<PageResponse<Transaction>> {
    return this.api.get<PageResponse<Transaction>>('/transactions', {
      accountId: query.accountId, type: query.type, status: query.status,
      search: query.search, page: query.page ?? 0, size: query.size ?? 10
    });
  }

  getById(id: number): Observable<Transaction> {
    return this.api.get<Transaction>(`/transactions/${id}`);
  }

  create(body: TransactionCreateRequest): Observable<Transaction> {
    return this.api.post<Transaction>('/transactions', body);
  }

  update(id: number, body: TransactionUpdateRequest): Observable<Transaction> {
    return this.api.put<Transaction>(`/transactions/${id}`, body);
  }

  remove(id: number): Observable<void> {
    return this.api.remove(`/transactions/${id}`);
  }
}

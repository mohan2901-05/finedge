import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PageResponse, User, UserCreateRequest, UserUpdateRequest } from './models';

export interface UserQuery {
  orgId?: string;
  roleId?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(ApiService);

  list(query: UserQuery = {}): Observable<PageResponse<User>> {
    return this.api.get<PageResponse<User>>('/etfdb/users', {
      orgId: query.orgId, roleId: query.roleId, page: query.page ?? 0, size: query.size ?? 10
    });
  }

  getById(id: string): Observable<User> {
    return this.api.get<User>(`/etfdb/users/${id}`);
  }

  create(body: UserCreateRequest): Observable<User> {
    return this.api.post<User>('/etfdb/users', body);
  }

  update(id: string, body: UserUpdateRequest): Observable<User> {
    return this.api.put<User>(`/etfdb/users/${id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.api.remove(`/etfdb/users/${id}`);
  }
}

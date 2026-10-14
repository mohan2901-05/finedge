import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from './models';

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('lists users with org and role filters', () => {
    service.list({ orgId: 'ORG-1', roleId: 'ROLE-1' }).subscribe((res) => {
      expect(res.content).toHaveLength(1);
    });

    const req = http.expectOne((r) => r.url.endsWith('/etfdb/users'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('orgId')).toBe('ORG-1');
    expect(req.request.params.get('roleId')).toBe('ROLE-1');
    req.flush({ content: [{ userId: 'USR-1' }], pageNumber: 0, pageSize: 10, totalElements: 1, totalPages: 1, first: true, last: true });
  });

  it('posts the password on create but the typed response carries none', () => {
    const created: User = {
      userId: 'USR-NEW', orgId: 'ORG-1', roleId: 'ROLE-1', userName: 'Test User',
      userEmail: 'user@example.invalid', status: 'ACTIVE', createdDatetime: '', updatedDatetime: ''
    };
    service.create({
      orgId: 'ORG-1', roleId: 'ROLE-1', userName: 'Test User',
      password: 'secret-value', userEmail: 'user@example.invalid'
    }).subscribe((res) => {
      expect(res.userId).toBe('USR-NEW');
      expect('password' in res).toBe(false);
      expect('panNo' in res).toBe(false);
    });

    const req = http.expectOne((r) => r.url.endsWith('/etfdb/users'));
    expect(req.request.method).toBe('POST');
    expect((req.request.body as Record<string, unknown>)['password']).toBe('secret-value');
    req.flush(created);
  });
});

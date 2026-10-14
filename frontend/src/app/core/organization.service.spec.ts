import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OrganizationService } from './organization.service';
import { Organization } from './models';

describe('OrganizationService', () => {
  let service: OrganizationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(OrganizationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('lists organizations with status filter and paging', () => {
    service.list({ status: 'ACTIVE', page: 0, size: 10 }).subscribe((res) => {
      expect(res.totalElements).toBe(1);
      expect(res.content[0].orgId).toBe('ORG-1');
    });

    const req = http.expectOne((r) => r.url.endsWith('/etfdb/organizations'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('status')).toBe('ACTIVE');
    expect(req.request.params.get('page')).toBe('0');
    req.flush({ content: [{ orgId: 'ORG-1' }], pageNumber: 0, pageSize: 10, totalElements: 1, totalPages: 1, first: true, last: true });
  });

  it('creates an organization via POST', () => {
    const created: Organization = {
      orgId: 'ORG-NEW', orgName: 'Test Org', orgEmail: 'test@example.invalid',
      status: 'ACTIVE', createdDatetime: '', updatedDatetime: ''
    };
    service.create({ orgName: 'Test Org', orgEmail: 'test@example.invalid' }).subscribe((res) => {
      expect(res.orgId).toBe('ORG-NEW');
    });

    const req = http.expectOne((r) => r.url.endsWith('/etfdb/organizations'));
    expect(req.request.method).toBe('POST');
    req.flush(created);
  });

  it('deletes via DELETE', () => {
    service.remove('ORG-1').subscribe();
    const req = http.expectOne((r) => r.url.endsWith('/etfdb/organizations/ORG-1'));
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

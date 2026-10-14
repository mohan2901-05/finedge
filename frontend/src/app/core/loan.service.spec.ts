import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoanService } from './loan.service';

describe('LoanService', () => {
  let service: LoanService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(LoanService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('reads scoped loan children from the relationship endpoints', () => {
    service.activities('LOAN-1', 0, 50).subscribe((res) => {
      expect(res.content).toHaveLength(0);
    });
    const activities = http.expectOne((r) => r.url.endsWith('/etfdb/loans/LOAN-1/activities'));
    expect(activities.request.method).toBe('GET');
    activities.flush({ content: [], pageNumber: 0, pageSize: 50, totalElements: 0, totalPages: 0, first: true, last: true });

    service.repayments('LOAN-1', 0, 50).subscribe();
    const repayments = http.expectOne((r) => r.url.endsWith('/etfdb/loans/LOAN-1/repayments'));
    expect(repayments.request.method).toBe('GET');
    repayments.flush({ content: [], pageNumber: 0, pageSize: 50, totalElements: 0, totalPages: 0, first: true, last: true });

    service.collections('LOAN-1', 0, 50).subscribe();
    const collections = http.expectOne((r) => r.url.endsWith('/etfdb/loans/LOAN-1/collections'));
    expect(collections.request.method).toBe('GET');
    collections.flush({ content: [], pageNumber: 0, pageSize: 50, totalElements: 0, totalPages: 0, first: true, last: true });
  });
});

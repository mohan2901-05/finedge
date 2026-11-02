import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ApiService } from './api.service';
import { DisbursementService } from './disbursement.service';

describe('DisbursementService', () => {
  let service: DisbursementService;
  let apiSpy: { get: any; post: any };

  beforeEach(() => {
    apiSpy = {
      get: vi.fn(),
      post: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiSpy },
        DisbursementService,
      ],
    });

    service = TestBed.inject(DisbursementService);
  });

  it('should disburse a loan', () => {
    const mockResponse = { disbursementId: 'DISB-1', applicationId: 42, disbursedAmount: 50000 };
    apiSpy.post = vi.fn(() => of(mockResponse));

    service.disburse(42, { disbursedAmount: 50000 }).subscribe((res) => {
      expect(res.applicationId).toBe(42);
    });
  });

  it('should get disbursement details', () => {
    apiSpy.get = vi.fn(() => of({ disbursementId: 'DISB-1', applicationId: 42 }));

    service.getDisbursement(42).subscribe((res) => {
      expect(res.applicationId).toBe(42);
    });
  });

  it('should get outstanding balance', () => {
    apiSpy.get = vi.fn(() => of({ disbursed: true, disbursedAmount: 50000, outstandingAmount: 25000, fullyRepaid: false }));

    service.getOutstanding(42).subscribe((res) => {
      expect(res.disbursed).toBe(true);
    });
  });

  it('should submit repayment', () => {
    apiSpy.post = vi.fn(() => of({ repaymentId: 'REPAY-1', applicationId: 42, repaymentAmount: 5000 }));

    service.repay(42, { repaymentAmount: 5000 }).subscribe();
  });

  it('should list repayments with pagination', () => {
    apiSpy.get = vi.fn(() => of({ content: [], pageNumber: 0, totalElements: 0 }));

    service.listRepayments(42, 0, 10).subscribe();
  });
});

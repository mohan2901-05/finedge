import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { FinancierReviewComponent } from './financier-review.component';
import { FinancierService } from '../../core/financier.service';
import { DisbursementService } from '../../core/disbursement.service';

describe('FinancierReviewComponent', () => {
  let component: FinancierReviewComponent;
  let fixture: ComponentFixture<FinancierReviewComponent>;

  const mockApplication = {
    id: 1,
    ref: 'LNA-000001',
    custUserId: 'USR-1',
    customerName: 'Ravi Sharma',
    customerPhone: '9876543210',
    customerEmail: 'ravi@example.com',
    customerCity: 'Mumbai',
    customerAddress: '123 MG Road, Fort',
    financierKey: 'FIN-0001',
    financierLabel: 'Alpha Capital',
    loanAmount: 500000,
    tenureMonths: 24,
    interestRate: 8.5,
    emi: 23029,
    totalInterest: 52696,
    totalPayable: 552696,
    status: 'Pending Review',
    createdAt: '2026-01-10T10:00:00',
  };

  const mockApprovedApplication = {
    ...mockApplication,
    status: 'Approved',
  };

  const mockRejectedApplication = {
    ...mockApplication,
    status: 'Rejected',
  };

  class MockDisbursementService {
    getDisbursement = () => of({ disbursementId: 'DISB-1', disbursedAmount: 50000, disbursedAt: '2026-01-15', disbursedByUserId: 'FIN-1', applicationId: 1 });
    getOutstanding = () => of({ disbursed: true, disbursedAmount: 50000, totalRepaid: 0, outstandingAmount: 50000, fullyRepaid: false, applicationId: 1 });
    listRepayments = () => of({ content: [], pageNumber: 0, totalElements: 0, pageSize: 10, totalPages: 0, first: true, last: true });
    disburse = () => of({ disbursementId: 'DISB-NEW', disbursedAmount: 50000, disbursedAt: '2026-01-20', disbursedByUserId: 'FIN-1', applicationId: 1, loanAmount: 500000, createdDatetime: '2026-01-20T10:00:00' });
    repay = () => of({ repaymentId: 'REPAY-1', applicationId: 1, repaymentAmount: 5000, paidAt: '2026-01-20', paidByUserId: 'USR-1', createdDatetime: '2026-01-20T10:00:00' });
  }

  class MockFinancierService {
    getByIdForFinancier = () => of(mockApplication);
    approve = () => of(mockApprovedApplication);
    reject = () => of(mockRejectedApplication);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FinancierReviewComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
        { provide: FinancierService, useClass: MockFinancierService },
      ],
    });

    fixture = TestBed.createComponent(FinancierReviewComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load the application by id', () => {
    fixture.detectChanges();
    expect(component.application()?.id).toBe(1);
    expect(component.application()?.ref).toBe('LNA-000001');
  });

  it('should render application details', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('LNA-000001');
    expect(compiled.textContent).toContain('Ravi Sharma');
    expect(compiled.textContent).toContain('Alpha Capital');
    expect(compiled.textContent).toContain('Pending Review');
  });

  it('should approve application', () => {
    fixture.detectChanges();
    expect(component.canDecide()).toBe(true);

    component.onApprove();
    fixture.detectChanges();

    expect(component.application()?.status).toBe('Approved');
    expect(component.deciding()).toBe(false);
  });

  it('should reject application', () => {
    fixture.detectChanges();

    component.onReject();
    fixture.detectChanges();

    expect(component.application()?.status).toBe('Rejected');
    expect(component.deciding()).toBe(false);
  });

  it('should not allow decide when already decided', () => {
    const service = TestBed.inject(FinancierService);
    (service as any).getByIdForFinancier = () => of(mockApprovedApplication);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [FinancierReviewComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
        { provide: FinancierService, useClass: MockFinancierService },
      ],
    });

    const reviewFixture = TestBed.createComponent(FinancierReviewComponent);
    const reviewComponent = reviewFixture.componentInstance;

    // Override the service to return approved application
    (reviewComponent as any).service = service;
    reviewComponent.load();
    reviewFixture.detectChanges();

    expect(reviewComponent.canDecide()).toBe(false);
  });

  it('should show error when application not found', () => {
    const service = TestBed.inject(FinancierService);
    (service as any).getByIdForFinancier = () =>
      throwError(() => ({ error: { message: 'Loan application not found with id: 99' } }));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [FinancierReviewComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
        { provide: FinancierService, useClass: MockFinancierService },
        { provide: DisbursementService, useClass: MockDisbursementService },
      ],
    });

    const reviewFixture = TestBed.createComponent(FinancierReviewComponent);
    const reviewComponent = reviewFixture.componentInstance;

    (reviewComponent as any).service = service;
    reviewComponent.load();
    reviewFixture.detectChanges();

    const err = reviewComponent.error();
    expect(err).not.toBeNull();
    expect(err).toContain('not found');
    expect(reviewComponent.loading()).toBe(false);
  });

  it('should navigate back to dashboard', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    fixture.detectChanges();
    component.backToDashboard();
    expect(navigateSpy).toHaveBeenCalledWith('/financier/dashboard');
  });

  it('should disburse approved application', () => {
    const service = TestBed.inject(FinancierService);
    (service as any).getByIdForFinancier = () => of(mockApprovedApplication);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [FinancierReviewComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
        { provide: FinancierService, useClass: MockFinancierService },
        { provide: DisbursementService, useClass: MockDisbursementService },
      ],
    });

    const reviewFixture = TestBed.createComponent(FinancierReviewComponent);
    const reviewComponent = reviewFixture.componentInstance;
    (reviewComponent as any).service = service;
    reviewComponent.load();
    reviewFixture.detectChanges();

    reviewComponent.disbursementAmount = '50000';
    reviewComponent.submitDisbursement();
    reviewFixture.detectChanges();

    expect(reviewComponent.disbursementSubmitting()).toBe(false);
    expect(reviewComponent.disbursement()).not.toBeNull();
  });
});

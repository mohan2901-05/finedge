import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BorrowerComponent } from './borrower.component';
import { BorrowerService } from '../../core/borrower.service';
import { FinancierDirectoryService } from '../../core/financier-directory.service';
import { LoanApplicationResponse } from '../../core/models';

describe('BorrowerComponent', () => {
  let component: BorrowerComponent;
  let fixture: ComponentFixture<BorrowerComponent>;

  const mockResult: LoanApplicationResponse = {
    id: 1,
    ref: 'APP-000001',
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
    createdAt: '2026-01-01T10:00:00',
  };

  const mockFinanciers = [
    { financierId: 'FIN-0001', institutionName: 'Alpha Capital', status: 'ACTIVE' },
    { financierId: 'FIN-0002', institutionName: 'Beta Finance', status: 'ACTIVE' },
    { financierId: 'FIN-0003', institutionName: 'Gamma Lending', status: 'INACTIVE' },
  ];

  const mockPage = {
    content: mockFinanciers,
    pageNumber: 0,
    pageSize: 10,
    totalElements: 3,
    totalPages: 1,
    first: true,
    last: true,
  };

  class MockBorrowerService {
    submitApplication = () => of(mockResult);
  }

  class MockFinancierDirectoryService {
    list = (query: any) => of({
      ...mockPage,
      content: mockFinanciers.filter((f) => !query.status || f.status === query.status),
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BorrowerComponent],
      providers: [
        provideRouter([]),
        { provide: BorrowerService, useClass: MockBorrowerService },
        { provide: FinancierDirectoryService, useClass: MockFinancierDirectoryService },
      ],
    });

    fixture = TestBed.createComponent(BorrowerComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load active financiers on init', () => {
    fixture.detectChanges();
    expect(component.financiers().length).toBe(2);
    expect(component.financiers()[0].key).toBe('FIN-0001');
    expect(component.financiers()[0].label).toBe('Alpha Capital');
    // Inactive financier should be excluded
    expect(component.financiers().find((f) => f.key === 'FIN-0003')).toBeUndefined();
  });

  it('should calculate EMI on init', () => {
    fixture.detectChanges();
    expect(component.emi()).toBeGreaterThan(0);
  });

  it('should not allow submit when form is invalid', () => {
    fixture.detectChanges();
    const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitBtn.disabled).toBe(true);
  });

  it('should not allow submit when no financier selected', () => {
    component.form.customerName = 'Ravi Sharma';
    component.form.customerPhone = '9876543210';
    component.form.customerEmail = 'ravi@example.com';
    component.form.customerCity = 'Mumbai';
    component.form.customerAddress = '123 MG Road';
    fixture.detectChanges();
    const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitBtn.disabled).toBe(true);
  });

  it('should allow submit when form is valid with financier selected', () => {
    component.form.customerName = 'Ravi Sharma';
    component.form.customerPhone = '9876543210';
    component.form.customerEmail = 'ravi@example.com';
    component.form.customerCity = 'Mumbai';
    component.form.customerAddress = '123 MG Road';
    component.form.financierKey = 'FIN-0001';
    fixture.detectChanges();
    const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitBtn.disabled).toBe(false);
  });

  it('should submit application and show server result', () => {
    component.form.customerName = 'Ravi Sharma';
    component.form.customerPhone = '9876543210';
    component.form.customerEmail = 'ravi@example.com';
    component.form.customerCity = 'Mumbai';
    component.form.customerAddress = '123 MG Road';
    component.form.financierKey = 'FIN-0001';
    fixture.detectChanges();

    const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
    submitBtn.click();
    fixture.detectChanges();

    expect(component.showForm()).toBe(false);
    expect(component.result()?.ref).toBe('APP-000001');
    expect(component.result()?.status).toBe('Pending Review');
    expect(component.result()?.emi).toBe(23029);
    expect(component.result()?.totalInterest).toBe(52696);
    expect(component.result()?.totalPayable).toBe(552696);
  });

  it('should not send ref, emi, totalInterest, totalPayable in request', () => {
    const service = TestBed.inject(BorrowerService);
    let capturedRequest: any = null;
    (service as any).submitApplication = (req: any) => {
      capturedRequest = req;
      return of(mockResult);
    };

    component.form.customerName = 'Ravi Sharma';
    component.form.customerPhone = '9876543210';
    component.form.customerEmail = 'ravi@example.com';
    component.form.customerCity = 'Mumbai';
    component.form.customerAddress = '123 MG Road';
    component.form.financierKey = 'FIN-0001';
    fixture.detectChanges();

    const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
    submitBtn.click();
    fixture.detectChanges();

    expect(capturedRequest.ref).toBeUndefined();
    expect(capturedRequest.emi).toBeUndefined();
    expect(capturedRequest.totalInterest).toBeUndefined();
    expect(capturedRequest.totalPayable).toBeUndefined();
    expect(capturedRequest.customerName).toBe('Ravi Sharma');
    expect(capturedRequest.financierKey).toBe('FIN-0001');
    expect(capturedRequest.financierLabel).toBeUndefined();
  });

  it('should show error on submission failure', () => {
    const service = TestBed.inject(BorrowerService);
    (service as any).submitApplication = () =>
      throwError(() => ({ error: { message: 'Financier key is required' } }));

    component.form.customerName = 'Ravi Sharma';
    component.form.customerPhone = '9876543210';
    component.form.customerEmail = 'ravi@example.com';
    component.form.customerCity = 'Mumbai';
    component.form.customerAddress = '123 MG Road';
    component.form.financierKey = 'FIN-0001';
    fixture.detectChanges();

    const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
    submitBtn.click();
    fixture.detectChanges();

    expect(component.error()).toContain('Financier key is required');
    expect(component.submitting()).toBe(false);
  });

  it('should disable submission while request is in progress', () => {
    const service = TestBed.inject(BorrowerService);
    let release: (() => void) | null = null;
    const pending = new Observable<any>((observer) => {
      release = () => observer.next(mockResult);
    });
    (service as any).submitApplication = () => pending;

    component.form.customerName = 'Ravi Sharma';
    component.form.customerPhone = '9876543210';
    component.form.customerEmail = 'ravi@example.com';
    component.form.customerCity = 'Mumbai';
    component.form.customerAddress = '123 MG Road';
    component.form.financierKey = 'FIN-0001';
    fixture.detectChanges();

    const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitBtn.disabled).toBe(false);

    submitBtn.click();
    fixture.detectChanges();

    expect(component.submitting()).toBe(true);
    expect(submitBtn.disabled).toBe(true);

    release!();
    fixture.detectChanges();
    expect(component.submitting()).toBe(false);
  });

  it('should reset form', () => {
    fixture.detectChanges();
    component.form.customerName = 'Test User';
    component.principal.set(100000);
    component.reset();
    expect(component.form.customerName).toBe('');
    expect(component.principal()).toBe(500000);
  });

  it('should format currency in Indian rupee format', () => {
    fixture.detectChanges();
    expect(component.formatIndianCurrency(100000)).toBe('₹1,00,000.00');
    expect(component.formatIndianCurrency(5000000)).toBe('₹50,00,000.00');
  });

  it('should toggle tenure mode between months and years', () => {
    fixture.detectChanges();
    expect(component.tenureUnitValue()).toBe('months');
    component.setYearsMode();
    expect(component.tenureUnitValue()).toBe('years');
    expect(component.tenureMonths()).toBe(component.tenureYears() * 12);
    component.setMonthsMode();
    expect(component.tenureUnitValue()).toBe('months');
  });

  it('should handle financier API error gracefully', () => {
    const service = TestBed.inject(FinancierDirectoryService);
    (service as any).list = () => throwError(() => ({ message: 'API unavailable' }));

    component.loadFinanciers();
    fixture.detectChanges();

    expect(component.financiersError()).toContain('API unavailable');
    expect(component.financiersLoading()).toBe(false);
  });
});

import { Observable } from 'rxjs';

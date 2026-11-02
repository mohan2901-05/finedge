import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError, Observable, Subject } from 'rxjs';
import { BorrowerDashboardComponent } from './dashboard.component';
import { BorrowerService } from '../../../core/borrower.service';
import { PageResponse } from '../../../core/models';

describe('BorrowerDashboardComponent', () => {
  let component: BorrowerDashboardComponent;
  let fixture: ComponentFixture<BorrowerDashboardComponent>;

  const mockApplications: PageResponse<{ id: number; ref: string; custUserId: string; customerName: string; customerPhone: string; customerEmail: string; customerCity: string; customerAddress: string; financierKey: string; financierLabel: string; loanAmount: number; tenureMonths: number; interestRate: number; emi: number; totalInterest: number; totalPayable: number; status: string; createdAt: string }> = {
    content: [
      {
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
      },
      {
        id: 2,
        ref: 'LNA-000002',
        custUserId: 'USR-1',
        customerName: 'Priya Patel',
        customerPhone: '9876543211',
        customerEmail: 'priya@example.com',
        customerCity: 'Delhi',
        customerAddress: '456 Connaught Place',
        financierKey: 'FIN-0002',
        financierLabel: 'Beta Finance',
        loanAmount: 300000,
        tenureMonths: 12,
        interestRate: 10.0,
        emi: 26375,
        totalInterest: 16500,
        totalPayable: 316500,
        status: 'Approved',
        createdAt: '2026-01-09T10:00:00',
      },
      {
        id: 3,
        ref: 'LNA-000003',
        custUserId: 'USR-1',
        customerName: 'Amit Singh',
        customerPhone: '9876543212',
        customerEmail: 'amit@example.com',
        customerCity: 'Bangalore',
        customerAddress: '789 MG Road',
        financierKey: 'FIN-0001',
        financierLabel: 'Alpha Capital',
        loanAmount: 200000,
        tenureMonths: 6,
        interestRate: 9.5,
        emi: 34480,
        totalInterest: 6880,
        totalPayable: 206880,
        status: 'Rejected',
        createdAt: '2026-01-08T10:00:00',
      },
    ],
    pageNumber: 0,
    pageSize: 10,
    totalElements: 3,
    totalPages: 1,
    first: true,
    last: true,
  };

  const mockEmptyPage: PageResponse<unknown> = {
    content: [],
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  };

  class MockBorrowerService {
    list = (_status?: string, _page = 0, _size = 10) => of(mockApplications);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BorrowerDashboardComponent],
      providers: [
        provideRouter([]),
        { provide: BorrowerService, useClass: MockBorrowerService },
      ],
    });

    fixture = TestBed.createComponent(BorrowerDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load applications on init', () => {
    fixture.detectChanges();
    expect(component.applications().length).toBe(3);
    expect(component.totalElements()).toBe(3);
  });

  it('should show loading state while fetching', () => {
    const service = TestBed.inject(BorrowerService);
    const subject = new Subject<PageResponse<unknown>>();
    (service as any).list = () => subject.asObservable();

    component.load();
    fixture.detectChanges();
    expect(component.loading()).toBe(true);

    subject.next(mockEmptyPage);
    subject.complete();
    fixture.detectChanges();
    expect(component.loading()).toBe(false);
  });

  it('should render application data in the list', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('LNA-000001');
    expect(compiled.textContent).toContain('Alpha Capital');
    expect(compiled.textContent).toContain('LNA-000002');
    expect(compiled.textContent).toContain('Beta Finance');
    expect(compiled.textContent).toContain('LNA-000003');
  });

  it('should compute summary metrics from actual statuses', () => {
    fixture.detectChanges();
    expect(component.countByStatus('Pending Review')).toBe(1);
    expect(component.countByStatus('Approved')).toBe(1);
    expect(component.countByStatus('Rejected')).toBe(1);
    expect(component.countByStatus('Unknown')).toBe(0);
  });

  it('should show empty state when no applications', () => {
    const service = TestBed.inject(BorrowerService);
    (service as any).list = () => of(mockEmptyPage);

    component.load();
    fixture.detectChanges();

    expect(component.applications().length).toBe(0);
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('No applications yet');
  });

  it('should show error and allow retry on API failure', () => {
    const service = TestBed.inject(BorrowerService);
    (service as any).list = () =>
      throwError(() => ({ error: { message: 'Server error' } }));

    component.load();
    fixture.detectChanges();

    expect(component.error()).toContain('Server error');
    expect(component.loading()).toBe(false);

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Server error');

    // Retry should reload
    (service as any).list = () => of(mockApplications);
    const retryBtn = compiled.querySelector('button');
    retryBtn.click();
    fixture.detectChanges();

    expect(component.error()).toBeNull();
    expect(component.applications().length).toBe(3);
  });

  it('should filter by status', () => {
    const service = TestBed.inject(BorrowerService);
    (service as any).list = (status: string, page: number, size: number) =>
      of({
        ...mockApplications,
        content: mockApplications.content.filter((a) => !status || a.status === status),
      });

    fixture.detectChanges();
    component.statusFilter = 'Approved';
    component.onFilterChange();
    fixture.detectChanges();

    expect(component.applications().length).toBe(1);
    expect(component.applications()[0].status).toBe('Approved');
  });

  it('should clear filter', () => {
    fixture.detectChanges();
    component.statusFilter = 'Approved';
    component.clearFilter();
    expect(component.statusFilter).toBe('');
  });
});

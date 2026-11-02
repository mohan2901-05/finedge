import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FinancierDirectoryComponent } from './financier-directory.component';
import { FinancierDirectoryService } from '../../core/financier-directory.service';
import { of } from 'rxjs';

describe('FinancierDirectoryComponent', () => {
  let component: FinancierDirectoryComponent;
  let fixture: ComponentFixture<FinancierDirectoryComponent>;

  const mockFinanciers = [
    {
      financierId: 'FIN-000001',
      institutionName: 'Alpha Capital',
      description: 'Term lending specialist',
      indicativeAnnualRate: 8.5,
      minLoanAmount: 100000,
      maxLoanAmount: 5000000,
      availableTenureMonths: 24,
      status: 'ACTIVE',
      createdDatetime: '2026-01-01T00:00:00',
      updatedDatetime: '2026-01-01T00:00:00',
    },
    {
      financierId: 'FIN-000002',
      institutionName: 'Beta Finance',
      description: 'Working capital finance',
      indicativeAnnualRate: 10.0,
      minLoanAmount: 50000,
      maxLoanAmount: 2000000,
      availableTenureMonths: 12,
      status: 'ACTIVE',
      createdDatetime: '2026-01-01T00:00:00',
      updatedDatetime: '2026-01-01T00:00:00',
    },
  ];

  const mockPage = {
    content: mockFinanciers,
    pageNumber: 0,
    pageSize: 10,
    totalElements: 2,
    totalPages: 1,
    first: true,
    last: true,
  };

  // Minimal mock service without jasmine
  class MockFinancierDirectoryService {
    list = () => of(mockPage);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FinancierDirectoryComponent],
      providers: [
        provideRouter([]),
        { provide: FinancierDirectoryService, useClass: MockFinancierDirectoryService },
      ],
    });

    fixture = TestBed.createComponent(FinancierDirectoryComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load financiers from the service', () => {
    fixture.detectChanges();
    expect(component.financiers().length).toBe(2);
    expect(component.financiers()[0].institutionName).toBe('Alpha Capital');
  });

  it('should set apiUnavailable when no financiers returned', async () => {
    const service = TestBed.inject(FinancierDirectoryService);
    (service as any).list = () => of({
      ...mockPage,
      content: [],
      totalElements: 0,
    });
    component.load();
    await fixture.whenStable();
    expect(component.apiUnavailable()).toBe(true);
  });

  it('should filter by search term', () => {
    fixture.detectChanges();
    component.onSearchChange('Alpha');
    expect(component.query.search).toBe('Alpha');
    expect(component.query.page).toBe(0);
  });

  it('should clear filters', () => {
    fixture.detectChanges();
    component.onSearchChange('Beta');
    component.clearFilters();
    expect(component.query.search).toBe('');
    expect(component.query.sortBy).toBe('name');
    expect(component.query.sortDir).toBe('asc');
  });

  it('should toggle sort direction on same field', () => {
    fixture.detectChanges();
    component.onSortChange('name');
    expect(component.query.sortDir).toBe('desc');
    component.onSortChange('name');
    expect(component.query.sortDir).toBe('asc');
  });

  it('should format currency in Indian rupee format', () => {
    fixture.detectChanges();
    expect(component.formatCurrency(100000)).toBe('₹1,00,000');
    expect(component.formatCurrency(5000000)).toBe('₹50,00,000');
  });

  it('should format rate with percent sign', () => {
    fixture.detectChanges();
    expect(component.formatRate(8.5)).toBe('8.50%');
    expect(component.formatRate(undefined)).toBe('—');
  });

  it('should format undefined currency as dash', () => {
    fixture.detectChanges();
    expect(component.formatCurrency(undefined)).toBe('—');
  });
});

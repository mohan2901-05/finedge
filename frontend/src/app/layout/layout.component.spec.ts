import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthService } from '../core/auth.service';
import { NotificationService } from '../shared/notification.service';
import { User } from '../core/models';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  const mockUser: User = {
    userId: 'USR-1',
    orgId: 'ORG-1',
    roleId: 'ROLE-1',
    roleName: 'BORROWER',
    userName: 'Borrower User',
    userEmail: 'borrower@example.invalid',
    status: 'ACTIVE',
    createdDatetime: '2026-01-01T00:00:00Z',
    updatedDatetime: '2026-01-01T00:00:00Z',
  };

  const mockFinancierAdminUser: User = {
    ...mockUser,
    userId: 'USR-2',
    roleName: 'FINANCIER_ADMIN',
    userName: 'Financier Admin',
    userEmail: 'financier@example.invalid',
  };

  class MockAuthService {
    isAuthenticated = () => true;
    getCurrentUser = () => mockUser;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useClass: MockAuthService },
        { provide: NotificationService, useClass: class {} },
      ],
    });

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not show Financier Dashboard nav item for non-financier users', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).not.toContain('Financier Dashboard');
  });

  it('should show Financier Dashboard nav item for FINANCIER_ADMIN users', () => {
    const authService = TestBed.inject(AuthService);
    (authService as any).getCurrentUser = () => mockFinancierAdminUser;

    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Financier Dashboard');
  });

  it('should show other nav items regardless of role', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Overview');
    expect(compiled.textContent).toContain('Organizations');
    expect(compiled.textContent).toContain('Dashboard');
  });

  it('isFinancierAdmin returns false for borrower role', () => {
    expect(component.isFinancierAdmin()).toBe(false);
  });

  it('isFinancierAdmin returns true for FINANCIER_ADMIN role', () => {
    const authService = TestBed.inject(AuthService);
    (authService as any).getCurrentUser = () => mockFinancierAdminUser;
    expect(component.isFinancierAdmin()).toBe(true);
  });

  it('isFinancierAdmin returns false when no user is stored', () => {
    const authService = TestBed.inject(AuthService);
    (authService as any).getCurrentUser = () => null;
    expect(component.isFinancierAdmin()).toBe(false);
  });
});

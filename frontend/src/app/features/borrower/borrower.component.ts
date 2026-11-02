import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../../shared/logo.component';
import {
  LoanApplicationCreateRequest,
  LoanApplicationResponse,
} from '../../core/models';
import { BorrowerService } from '../../core/borrower.service';
import { FinancierDirectoryService } from '../../core/financier-directory.service';
import {
  DEFAULT_INPUTS,
  formatIndianCurrency,
  runEmiCalculation,
} from '../../core/emi-calculation';

@Component({
  selector: 'app-borrower',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LogoComponent],
  templateUrl: './borrower.component.html',
  styleUrl: './borrower.component.scss'
})
export class BorrowerComponent {
  private readonly service = inject(BorrowerService);
  private readonly financierService = inject(FinancierDirectoryService);
  private financierSub?: Subscription;

  readonly logoSize = 32;

  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly result = signal<LoanApplicationResponse | null>(null);
  readonly showForm = signal(true);

  readonly financiers = signal<{ key: string; label: string }[]>([]);
  readonly financiersLoading = signal(false);
  readonly financiersError = signal<string | null>(null);

  readonly principal = signal<number>(DEFAULT_INPUTS.principal);
  readonly annualRate = signal<number>(DEFAULT_INPUTS.annualRate);
  readonly tenureMonths = signal<number>(DEFAULT_INPUTS.tenureMonths);
  readonly tenureYears = signal<number>(Math.round(DEFAULT_INPUTS.tenureMonths / 12));
  readonly tenureUnitValue = signal<'months' | 'years'>('months');

  readonly emi = signal<number | null>(null);
  readonly totalInterest = signal<number | null>(null);
  readonly totalPayable = signal<number | null>(null);

  readonly form = {
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerCity: '',
    customerAddress: '',
    customerDob: '',
    customerPan: '',
    financierKey: '',
  };

  constructor() {
    this.recalculate();
  }

  ngOnInit(): void {
    this.loadFinanciers();
  }

  ngOnDestroy(): void {
    this.financierSub?.unsubscribe();
  }

  loadFinanciers(): void {
    this.financiersLoading.set(true);
    this.financiersError.set(null);
    this.financierSub?.unsubscribe();
    this.financierSub = this.financierService.list({ status: 'ACTIVE', sortBy: 'name', sortDir: 'asc', page: 0, size: 50 }).subscribe({
      next: (page) => {
        this.financiers.set(
          page.content.map((f) => ({
            key: f.financierId,
            label: f.institutionName,
          }))
        );
        this.financiersLoading.set(false);
      },
      error: (err) => {
        this.financiersLoading.set(false);
        this.financiersError.set(err?.message ?? 'Failed to load financiers');
      }
    });
  }

  setMonthsMode(): void {
    this.tenureUnitValue.set('months');
    this.tenureYears.set(Math.round(this.tenureMonths() / 12));
    this.recalculate();
  }

  setYearsMode(): void {
    this.tenureUnitValue.set('years');
    this.tenureMonths.set(this.tenureYears() * 12);
    this.recalculate();
  }

  onPrincipalChange(value: string): void {
    const parsed = parseNumber(value);
    this.principal.set(parsed ?? 0);
    this.recalculate();
  }

  onRateChange(value: string): void {
    const parsed = parseNumber(value);
    this.annualRate.set(parsed ?? 0);
    this.recalculate();
  }

  onTenureMonthsChange(value: string): void {
    const parsed = parseNumber(value) ?? 0;
    this.tenureMonths.set(parsed);
    this.tenureYears.set(Math.round(this.tenureMonths() / 12));
    this.recalculate();
  }

  onTenureYearsChange(value: string): void {
    const parsed = parseNumber(value) ?? 0;
    this.tenureYears.set(parsed);
    this.tenureMonths.set(parsed * 12);
    this.recalculate();
  }

  private recalculate(): void {
    const calc = runEmiCalculation({
      principal: this.principal(),
      annualRate: this.annualRate(),
      tenureMonths: this.tenureMonths(),
    });

    if (calc.valid && calc.result) {
      this.emi.set(calc.result.emi);
      this.totalInterest.set(calc.result.totalInterest);
      this.totalPayable.set(calc.result.totalRepayment);
    } else {
      this.emi.set(null);
      this.totalInterest.set(null);
      this.totalPayable.set(null);
    }
  }

  get tenureValue(): number {
    return this.tenureUnitValue() === 'years' ? this.tenureYears() : this.tenureMonths();
  }

  set tenureValue(v: number) {
    const num = parseNumber(String(v)) ?? 0;
    if (this.tenureUnitValue() === 'years') {
      this.tenureYears.set(num);
      this.tenureMonths.set(num * 12);
    } else {
      this.tenureMonths.set(num);
      this.tenureYears.set(Math.round(this.tenureMonths() / 12));
    }
    this.recalculate();
  }

  get canSubmit(): boolean {
    const emi = this.emi();
    return !!(
      this.form.customerName.trim() &&
      this.form.customerPhone.trim() &&
      this.form.customerEmail.trim() &&
      this.form.customerCity.trim() &&
      this.form.customerAddress.trim() &&
      this.form.financierKey.trim() &&
      emi !== null &&
      emi > 0
    );
  }

  submitApplication(): void {
    if (!this.canSubmit) return;

    this.submitting.set(true);
    this.error.set(null);
    this.result.set(null);

    const application: LoanApplicationCreateRequest = {
      customerName: this.form.customerName.trim(),
      customerPhone: this.form.customerPhone.trim(),
      customerEmail: this.form.customerEmail.trim(),
      customerDob: this.form.customerDob.trim() || undefined,
      customerPan: this.form.customerPan.trim() || undefined,
      customerCity: this.form.customerCity.trim(),
      customerAddress: this.form.customerAddress.trim(),
      financierKey: this.form.financierKey.trim(),
      loanAmount: this.principal(),
      tenureMonths: this.tenureMonths(),
      interestRate: this.annualRate(),
    };

    this.service.submitApplication(application).subscribe({
      next: (created) => {
        this.result.set(created);
        this.showForm.set(false);
        this.submitting.set(false);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ||
          err?.message ||
          'Failed to submit loan application. Please try again.'
        );
        this.submitting.set(false);
      }
    });
  }

  reset(): void {
    this.form.customerName = '';
    this.form.customerPhone = '';
    this.form.customerEmail = '';
    this.form.customerCity = '';
    this.form.customerAddress = '';
    this.form.customerDob = '';
    this.form.customerPan = '';
    this.form.financierKey = '';
    this.principal.set(DEFAULT_INPUTS.principal);
    this.annualRate.set(DEFAULT_INPUTS.annualRate);
    this.tenureMonths.set(DEFAULT_INPUTS.tenureMonths);
    this.tenureYears.set(Math.round(DEFAULT_INPUTS.tenureMonths / 12));
    this.tenureUnitValue.set('months');
    this.error.set(null);
    this.result.set(null);
    this.showForm.set(true);
    this.recalculate();
  }

  readonly formatIndianCurrency = formatIndianCurrency;
}

function parseNumber(value: string): number | null {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  DEFAULT_INPUTS,
  EmiCalculation,
  formatIndianCurrency,
  runEmiCalculation,
} from '../../core/emi-calculation';

@Component({
  selector: 'app-emi-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './emi-calculator.component.html',
  styleUrl: './emi-calculator.component.scss'
})
export class EmiCalculatorComponent {
  private readonly principal = signal<number>(DEFAULT_INPUTS.principal);
  private readonly annualRate = signal<number>(DEFAULT_INPUTS.annualRate);
  private readonly tenureMonths = signal<number>(DEFAULT_INPUTS.tenureMonths);
  private readonly tenureYears = signal<number>(Math.round(DEFAULT_INPUTS.tenureMonths / 12));
  private readonly tenureUnit = signal<'months' | 'years'>('months');

  readonly calculation = signal<EmiCalculation | null>(null);

  readonly formatIndianCurrency = formatIndianCurrency;

  constructor() {
    this.recalculate();
  }

  get calc(): EmiCalculation | null {
    return this.calculation();
  }

  get tenureUnitValue(): 'months' | 'years' {
    return this.tenureUnit();
  }

  setMonthsMode(): void {
    this.tenureUnit.set('months');
    this.tenureYears.set(Math.round(this.tenureMonths() / 12));
    this.recalculate();
  }

  setYearsMode(): void {
    this.tenureUnit.set('years');
    this.tenureMonths.set(this.tenureYears() * 12);
    this.recalculate();
  }

  onPrincipalChange(value: string): void {
    this.principal.set(parseNumber(value) ?? 0);
    this.recalculate();
  }

  onRateChange(value: string): void {
    this.annualRate.set(parseNumber(value) ?? 0);
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

  reset(): void {
    this.principal.set(DEFAULT_INPUTS.principal);
    this.annualRate.set(DEFAULT_INPUTS.annualRate);
    this.tenureMonths.set(DEFAULT_INPUTS.tenureMonths);
    this.tenureYears.set(Math.round(DEFAULT_INPUTS.tenureMonths / 12));
    this.tenureUnit.set('months');
    this.recalculate();
  }

  hasError(field: 'principal' | 'rate' | 'tenure'): boolean {
    return this.calculation()?.errors.some((e) => e.field === field) ?? false;
  }

  errorFor(field: 'principal' | 'rate' | 'tenure'): string {
    return this.calculation()?.errors.find((e) => e.field === field)?.message ?? '';
  }

  get principalValue(): number {
    return this.principal();
  }

  get rateValue(): number {
    return this.annualRate();
  }

  get tenureValue(): number {
    return this.tenureUnit() === 'years' ? this.tenureYears() : this.tenureMonths();
  }

  get principalShare(): number {
    const r = this.calculation()?.result;
    if (!r || r.totalRepayment <= 0) return 0;
    return (r.principal / r.totalRepayment) * 100;
  }

  get interestShare(): number {
    const r = this.calculation()?.result;
    if (!r || r.totalRepayment <= 0) return 0;
    return (r.totalInterest / r.totalRepayment) * 100;
  }

  private recalculate(): void {
    this.calculation.set(
      runEmiCalculation({
        principal: this.principal(),
        annualRate: this.annualRate(),
        tenureMonths: this.tenureMonths(),
      })
    );
  }
}

function parseNumber(value: string): number | null {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

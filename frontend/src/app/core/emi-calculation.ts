export interface EmiInputs {
  principal: number;
  annualRate: number; // percentage, e.g. 8.5 for 8.5%
  tenureMonths: number;
}

export interface EmiResult {
  emi: number;
  totalRepayment: number;
  totalInterest: number;
  principal: number;
}

export interface EmiValidationError {
  field: 'principal' | 'rate' | 'tenure';
  message: string;
}

export interface EmiCalculation {
  inputs: EmiInputs;
  result: EmiResult | null;
  errors: EmiValidationError[];
  valid: boolean;
}

// Sensible demonstration defaults — clearly not actual financier offers.
export const DEFAULT_INPUTS: EmiInputs = {
  principal: 500000,
  annualRate: 8.5,
  tenureMonths: 24,
};

// Absolute sanity limits to prevent unstable calculations.
const MAX_PRINCIPAL = 100000000; // ₹10 crore
const MAX_TENURE_MONTHS = 360; // 30 years
const MAX_RATE = 100; // 100% per annum

/**
 * Validates EMI inputs and returns field-specific errors.
 */
export function validateInputs(inputs: EmiInputs): EmiValidationError[] {
  const errors: EmiValidationError[] = [];

  const principal = Number(inputs.principal);
  const rate = Number(inputs.annualRate);
  const tenure = Number(inputs.tenureMonths);

  if (!Number.isFinite(principal) || principal <= 0 || principal > MAX_PRINCIPAL) {
    errors.push({
      field: 'principal',
      message: 'Enter a valid loan amount greater than zero.',
    });
  }

  if (!Number.isFinite(rate) || rate < 0 || rate > MAX_RATE) {
    errors.push({
      field: 'rate',
      message: 'Enter a valid interest rate between 0 and 100 percent.',
    });
  }

  if (!Number.isFinite(tenure) || tenure <= 0 || tenure > MAX_TENURE_MONTHS) {
    errors.push({
      field: 'tenure',
      message: 'Enter a valid tenure greater than zero.',
    });
  }

  return errors;
}

/**
 * Calculates EMI using the standard fixed-rate monthly formula.
 *
 * P = principal
 * r = annual rate / 12 / 100 (monthly rate as decimal)
 * n = total monthly instalments
 *
 * For r > 0: EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)
 * For r = 0: EMI = P / n
 */
export function calculateEmi(inputs: EmiInputs): EmiResult {
  const { principal, annualRate, tenureMonths } = inputs;
  const monthlyRate = annualRate / 12 / 100;
  const n = tenureMonths;

  let emi: number;

  if (monthlyRate === 0) {
    emi = principal / n;
  } else {
    const factor = Math.pow(1 + monthlyRate, n);
    emi = (principal * monthlyRate * factor) / (factor - 1);
  }

  const totalRepayment = emi * n;
  const totalInterest = totalRepayment - principal;

  return {
    emi: Math.max(0, emi),
    totalRepayment: Math.max(0, totalRepayment),
    totalInterest: Math.max(0, totalInterest),
    principal,
  };
}

/**
 * Runs validation and calculation together, returning a complete result.
 */
export function runEmiCalculation(inputs: EmiInputs): EmiCalculation {
  const errors = validateInputs(inputs);
  const valid = errors.length === 0;
  const result = valid ? calculateEmi(inputs) : null;

  return { inputs, result, errors, valid };
}

/**
 * Formats a number as Indian currency (₹) with Indian digit grouping:
 * rightmost 3 digits, then groups of 2.
 * Examples: 100000 → ₹1,00,000; 5000000 → ₹50,00,000
 */
export function formatIndianCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  const parts = abs.toFixed(2).split('.');
  const intPart = parts[0];
  const decPart = parts[1];

  // Numbers with 3 or fewer digits need no grouping.
  if (intPart.length <= 3) {
    return `${sign}₹${intPart}.${decPart}`;
  }

  // Indian grouping: rightmost 3 digits, then groups of 2.
  let result = intPart.slice(-3);
  let remaining = intPart.slice(0, -3);

  while (remaining.length > 0) {
    if (remaining.length >= 2) {
      result = remaining.slice(-2) + ',' + result;
      remaining = remaining.slice(0, -2);
    } else {
      result = remaining + ',' + result;
      remaining = '';
    }
  }

  return `${sign}₹${result}.${decPart}`;
}

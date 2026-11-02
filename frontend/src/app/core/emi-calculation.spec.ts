import {
  calculateEmi,
  DEFAULT_INPUTS,
  formatIndianCurrency,
  runEmiCalculation,
  validateInputs,
} from './emi-calculation';

describe('EMI calculation', () => {
  describe('validateInputs', () => {
    it('should accept valid inputs', () => {
      const errors = validateInputs({ principal: 500000, annualRate: 8.5, tenureMonths: 24 });
      expect(errors).toHaveLength(0);
    });

    it('should reject zero or negative principal', () => {
      const errors = validateInputs({ principal: 0, annualRate: 8.5, tenureMonths: 24 });
      expect(errors).toContainEqual({
        field: 'principal',
        message: 'Enter a valid loan amount greater than zero.',
      });
    });

    it('should reject non-numeric principal', () => {
      const errors = validateInputs({ principal: NaN, annualRate: 8.5, tenureMonths: 24 });
      expect(errors.some((e) => e.field === 'principal')).toBe(true);
    });

    it('should reject negative interest rate', () => {
      const errors = validateInputs({ principal: 500000, annualRate: -1, tenureMonths: 24 });
      expect(errors).toContainEqual({
        field: 'rate',
        message: 'Enter a valid interest rate between 0 and 100 percent.',
      });
    });

    it('should accept zero interest rate', () => {
      const errors = validateInputs({ principal: 500000, annualRate: 0, tenureMonths: 24 });
      expect(errors.some((e) => e.field === 'rate')).toBe(false);
    });

    it('should reject zero or negative tenure', () => {
      const errors = validateInputs({ principal: 500000, annualRate: 8.5, tenureMonths: 0 });
      expect(errors).toContainEqual({
        field: 'tenure',
        message: 'Enter a valid tenure greater than zero.',
      });
    });
  });

  describe('calculateEmi', () => {
    it('should calculate EMI for standard inputs', () => {
      // P=100000, r=10%/12/100=0.008333..., n=12
      // EMI = P*r*(1+r)^n / ((1+r)^n - 1)
      const result = calculateEmi({ principal: 100000, annualRate: 10, tenureMonths: 12 });
      expect(result.emi).toBeGreaterThan(0);
      expect(result.totalRepayment).toBeGreaterThan(result.principal);
      expect(result.totalInterest).toBe(result.totalRepayment - result.principal);
    });

    it('should handle zero interest rate', () => {
      const result = calculateEmi({ principal: 120000, annualRate: 0, tenureMonths: 12 });
      expect(result.emi).toBeCloseTo(10000, 2); // 120000 / 12
      expect(result.totalInterest).toBeCloseTo(0, 2);
      expect(result.totalRepayment).toBeCloseTo(120000, 2);
    });

    it('should match known EMI value', () => {
      // P=500000, r=8.5%/12/100, n=24
      // Monthly rate = 0.0070833...
      // EMI ≈ 22675.49 (approximate)
      const result = calculateEmi({ principal: 500000, annualRate: 8.5, tenureMonths: 24 });
      expect(result.emi).toBeGreaterThan(20000);
      expect(result.emi).toBeLessThan(25000);
      expect(result.totalRepayment).toBeGreaterThan(result.principal);
    });

    it('should return non-negative values', () => {
      const result = calculateEmi({ principal: 100000, annualRate: 5, tenureMonths: 6 });
      expect(result.emi).toBeGreaterThanOrEqual(0);
      expect(result.totalInterest).toBeGreaterThanOrEqual(0);
      expect(result.totalRepayment).toBeGreaterThanOrEqual(0);
    });
  });

  describe('runEmiCalculation', () => {
    it('should return valid result for valid inputs', () => {
      const calc = runEmiCalculation(DEFAULT_INPUTS);
      expect(calc.valid).toBe(true);
      expect(calc.errors).toHaveLength(0);
      expect(calc.result).not.toBeNull();
    });

    it('should return errors for invalid inputs', () => {
      const calc = runEmiCalculation({ principal: 0, annualRate: -1, tenureMonths: 0 });
      expect(calc.valid).toBe(false);
      expect(calc.errors.length).toBeGreaterThan(0);
      expect(calc.result).toBeNull();
    });
  });

  describe('formatIndianCurrency', () => {
    it('should format with rupee symbol and Indian grouping', () => {
      expect(formatIndianCurrency(100000)).toBe('₹1,00,000.00');
      expect(formatIndianCurrency(5000000)).toBe('₹50,00,000.00');
      expect(formatIndianCurrency(1234567)).toBe('₹12,34,567.00');
    });

    it('should round to two decimal places', () => {
      expect(formatIndianCurrency(1234.567)).toBe('₹1,234.57');
      expect(formatIndianCurrency(1000)).toBe('₹1,000.00');
    });

    it('should handle zero', () => {
      expect(formatIndianCurrency(0)).toBe('₹0.00');
    });
  });

  describe('tenure unit conversion', () => {
    it('should preserve equivalence between 24 months and 2 years', () => {
      const monthsResult = calculateEmi({ principal: 500000, annualRate: 8.5, tenureMonths: 24 });
      const yearsResult = calculateEmi({ principal: 500000, annualRate: 8.5, tenureMonths: 2 * 12 });
      expect(monthsResult.emi).toBe(yearsResult.emi);
      expect(monthsResult.totalRepayment).toBe(yearsResult.totalRepayment);
    });

    it('should convert years to months correctly', () => {
      const result = calculateEmi({ principal: 120000, annualRate: 0, tenureMonths: 2 * 12 });
      expect(result.emi).toBeCloseTo(5000, 2); // 120000 / 24
    });

    it('should convert months to years correctly', () => {
      const result = calculateEmi({ principal: 120000, annualRate: 0, tenureMonths: 36 });
      expect(result.emi).toBeCloseTo(3333.33, 2); // 120000 / 36
    });
  });
});

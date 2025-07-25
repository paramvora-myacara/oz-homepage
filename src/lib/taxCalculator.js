// Tax Calculator Configuration and Logic
// For OZ Capital Gains Tax Savings Calculator

// Hard-coded constants that can be tweaked by the team
export const TAX_CALC_CONFIG = {
  // Present value factor for deferral (6% discount, 1.5-year average deferral)
  PV_FACTOR: 0.87,
  
  // Assumed return multiplier for 10-year appreciation (4x total value → 3x appreciation)
  ASSUMED_RETURN_MULT: 3.0,
  
  // Deferral deadline
  DEFERRAL_DEADLINE: 'TY.2026',
  
  // Last updated date for compliance
  LAST_UPDATED: 'January 2025',
  
  // Bill version for legal compliance
  BILL_VERSION: 'post-July 2025 ruleset'
};

// Capital gain amount options (in dollars)
export const GAIN_AMOUNT_OPTIONS = [
  { id: 'under_50k', label: '<$50K', value: 25000, min: 1000, max: 50000, display: 'Under $50,000' },
  { id: '50k_250k', label: '$50K-$250K', value: 150000, min: 50000, max: 250000, display: '$50,000 - $250,000' },
  { id: '250k_500k', label: '$250K-$500K', value: 375000, min: 250000, max: 500000, display: '$250,000 - $500,000' },
  { id: '500k_1m', label: '$500K-$1M', value: 750000, min: 500000, max: 1000000, display: '$500,000 - $1,000,000' },
  { id: 'over_1m', label: '>$1M', value: 1500000, min: 1000000, max: 5000000, display: 'Over $1,000,000' }
];

// Tax bracket options (combined federal + state LTCG rates)
export const TAX_BRACKET_OPTIONS = [
  { id: '15_percent', label: '15%', value: 0.15, display: '15% (Lower income bracket)' },
  { id: '20_percent', label: '20%', value: 0.20, display: '20% (Higher income bracket)' },
  { id: '23_8_percent', label: '23.8%', value: 0.238, display: '23.8% (with Net Investment Income Tax)' },
  { id: '30_percent_plus', label: '30%+', value: 0.30, display: '30%+ (High-tax states)' }
];

// Hold period options
export const HOLD_PERIOD_OPTIONS = [
  { id: 'yes', label: 'Yes', value: true, display: 'Yes, I plan to hold for 10+ years' },
  { id: 'no', label: 'No', value: false, display: 'No, I may exit before 10 years' }
];

/**
 * Calculate potential tax savings from OZ investment
 * @param {number} gainAmount - Capital gain amount being reinvested
 * @param {number} taxRate - Combined federal + state LTCG tax rate (decimal)
 * @param {boolean} hold10Years - Whether investor will hold for 10+ years
 * @returns {Object} Tax savings calculation breakdown
 */
export function calculateTaxSavings(gainAmount, taxRate, hold10Years) {
  // Calculate appreciation over 10 years
  const forecastAppreciation = hold10Years ? gainAmount * TAX_CALC_CONFIG.ASSUMED_RETURN_MULT : 0;
  
  // Scenario 1: Without OZ - Tax on original gain + tax on appreciation
  const taxWithoutOZ = gainAmount * taxRate + forecastAppreciation * taxRate;
  
  // Scenario 2: With OZ - Tax only on original gain (deferred to 2026)
  const taxWithOZ = gainAmount * taxRate * TAX_CALC_CONFIG.PV_FACTOR;
  
  // Total tax savings is the difference
  const totalSavings = taxWithoutOZ - taxWithOZ;
  
  return {
    gainAmount,
    taxRate,
    hold10Years,
    taxDueNow: gainAmount * taxRate,
    taxDue2026: gainAmount * taxRate * TAX_CALC_CONFIG.PV_FACTOR,
    forecastAppreciation,
    taxWithoutOZ,
    taxWithOZ,
    totalSavings,
    calculations: {
      taxWithoutOZ,
      taxWithOZ,
      totalBenefit: totalSavings
    }
  };
}

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format percentage for display
 * @param {number} rate - Rate as decimal (e.g., 0.15)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(rate) {
  return `${(rate * 100).toFixed(1)}%`;
}

/**
 * Get display label for gain amount
 * @param {number} amount - Gain amount value
 * @returns {string} Display label
 */
export function getGainAmountLabel(amount) {
  const option = GAIN_AMOUNT_OPTIONS.find(opt => opt.value === amount);
  return option ? option.display : formatCurrency(amount);
}

/**
 * Get display label for tax bracket
 * @param {number} rate - Tax rate as decimal
 * @returns {string} Display label
 */
export function getTaxBracketLabel(rate) {
  const option = TAX_BRACKET_OPTIONS.find(opt => opt.value === rate);
  return option ? option.display : formatPercentage(rate);
}

/**
 * Validate calculation inputs
 * @param {number} gainAmount - Capital gain amount
 * @param {number} taxRate - Tax rate
 * @param {boolean} hold10Years - Hold period
 * @returns {Object} Validation result
 */
export function validateInputs(gainAmount, taxRate, hold10Years) {
  const errors = [];
  
  if (!gainAmount || gainAmount <= 0) {
    errors.push('Capital gain amount must be greater than zero');
  }
  
  if (!taxRate || taxRate <= 0 || taxRate > 1) {
    errors.push('Tax rate must be between 0 and 100%');
  }
  
  if (typeof hold10Years !== 'boolean') {
    errors.push('Hold period must be specified');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
} 
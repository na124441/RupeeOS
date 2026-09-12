/**
 * Formats a number into Indian Rupee format (e.g. ₹1,20,450 or ₹12,450)
 */
export function formatRupee(amount: number, compact: boolean = false): string {
  if (isNaN(amount)) return '₹0';

  if (compact && Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (compact && Math.abs(amount) >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }

  // Use Indian number formatting
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  return formatter.format(amount);
}

export function parseRupee(input: string | number): number {
  if (typeof input === 'number') return isNaN(input) ? 0 : input;
  const cleaned = input.replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

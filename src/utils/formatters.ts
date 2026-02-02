/**
 * Format a number with comma separators
 * @param num - The number to format
 * @returns Formatted string with commas
 */
export const formatNumberWithCommas = (num: number): string => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Format currency with Philippine Peso symbol
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., ₱1,234.56)
 */
export const formatCurrency = (amount: number): string => {
  return `₱${formatNumberWithCommas(amount)}`;
};

/**
 * Gripwellrrency & Number Formatting Utilities
 */

export function formatINR(amount: number, includeDecimals = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "₹0.00";
  }

  const parts = amount.toFixed(includeDecimals ? 2 : 0).split(".");
  let integerPart = parts[0];
  const decimalPart = parts[1];

  // Indian Numbering System formatting (e.g. 1,00,000)
  const isNegative = integerPart.startsWith("-");
  if (isNegative) {
    integerPart = integerPart.substring(1);
  }

  const lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);

  let formatted =
    otherNumbers !== ""
      ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
      : lastThree;

  if (isNegative) {
    formatted = "-" + formatted;
  }

  return includeDecimals ? `₹${formatted}.${decimalPart}` : `₹${formatted}`;
}

export function formatCompactINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  }
  return `₹${amount}`;
}

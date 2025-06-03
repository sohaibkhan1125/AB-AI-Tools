
export interface FileSizeUnit {
  symbol: 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';
  name: string;
  bytes: number; // Number of bytes in this unit
}

export const FILE_SIZE_UNITS: FileSizeUnit[] = [
  { symbol: 'B',  name: 'Bytes',      bytes: 1 },
  { symbol: 'KB', name: 'Kilobytes',  bytes: 1024 },
  { symbol: 'MB', name: 'Megabytes',  bytes: 1024 ** 2 },
  { symbol: 'GB', name: 'Gigabytes',  bytes: 1024 ** 3 },
  { symbol: 'TB', name: 'Terabytes',  bytes: 1024 ** 4 },
  { symbol: 'PB', name: 'Petabytes',  bytes: 1024 ** 5 },
];

/**
 * Formats a file size value for display.
 * If the value is very small (e.g., less than 0.0001), it uses exponential notation.
 * Otherwise, it formats to a fixed number of decimal places.
 * @param value The numeric value to format.
 * @param precision The number of decimal places for non-exponential numbers.
 * @returns A string representation of the formatted value.
 */
export function formatDisplayValue(value: number, precision: number = 4): string {
  if (value === 0) return '0';
  if (Math.abs(value) < 0.0001 && value !== 0) {
    return value.toExponential(2);
  }
  // Use toLocaleString for better number formatting (e.g. commas)
  // and control fraction digits.
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0, // Don't show .00 for whole numbers
    maximumFractionDigits: precision,
  });
}

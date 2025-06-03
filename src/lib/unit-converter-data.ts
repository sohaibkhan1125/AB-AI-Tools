
export interface Unit {
  name: string;
  symbol: string;
  toBaseFactor?: number; // Factor to convert this unit to the category's base unit
}

export interface UnitCategory {
  name: string;
  baseUnitSymbol: string; // Symbol of the base unit for this category (for non-temp)
  units: Unit[];
  isTemperature?: boolean; // Special flag for temperature conversions
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    name: "Length",
    baseUnitSymbol: "m",
    units: [
      { name: "Meter", symbol: "m", toBaseFactor: 1 },
      { name: "Kilometer", symbol: "km", toBaseFactor: 1000 },
      { name: "Centimeter", symbol: "cm", toBaseFactor: 0.01 },
      { name: "Millimeter", symbol: "mm", toBaseFactor: 0.001 },
      { name: "Mile", symbol: "mi", toBaseFactor: 1609.34 },
      { name: "Yard", symbol: "yd", toBaseFactor: 0.9144 },
      { name: "Foot", symbol: "ft", toBaseFactor: 0.3048 },
      { name: "Inch", symbol: "in", toBaseFactor: 0.0254 },
      { name: "Nautical Mile", symbol: "nmi", toBaseFactor: 1852 },
    ],
  },
  {
    name: "Weight",
    baseUnitSymbol: "kg",
    units: [
      { name: "Kilogram", symbol: "kg", toBaseFactor: 1 },
      { name: "Gram", symbol: "g", toBaseFactor: 0.001 },
      { name: "Milligram", symbol: "mg", toBaseFactor: 0.000001 },
      { name: "Pound", symbol: "lb", toBaseFactor: 0.453592 },
      { name: "Ounce", symbol: "oz", toBaseFactor: 0.0283495 },
      { name: "Tonne", symbol: "t", toBaseFactor: 1000 },
    ],
  },
  {
    name: "Temperature",
    baseUnitSymbol: "°C", // Default display unit, not used for factor conversion
    isTemperature: true,
    units: [
      { name: "Celsius", symbol: "°C" },
      { name: "Fahrenheit", symbol: "°F" },
      { name: "Kelvin", symbol: "K" },
    ],
  },
  {
    name: "Area",
    baseUnitSymbol: "m²",
    units: [
        { name: "Square Meter", symbol: "m²", toBaseFactor: 1 },
        { name: "Square Kilometer", symbol: "km²", toBaseFactor: 1_000_000 },
        { name: "Square Mile", symbol: "mi²", toBaseFactor: 2_589_988.11 },
        { name: "Acre", symbol: "acre", toBaseFactor: 4046.86 },
        { name: "Hectare", symbol: "ha", toBaseFactor: 10_000 },
    ],
  },
  {
    name: "Volume",
    baseUnitSymbol: "L",
    units: [
        { name: "Liter", symbol: "L", toBaseFactor: 1 },
        { name: "Milliliter", symbol: "mL", toBaseFactor: 0.001 },
        { name: "Cubic Meter", symbol: "m³", toBaseFactor: 1000 },
        { name: "Gallon (US)", symbol: "gal", toBaseFactor: 3.78541 },
        { name: "Quart (US)", symbol: "qt", toBaseFactor: 0.946353 },
    ],
  },
];

// Temperature Conversion Functions
export function convertTemperature(value: number, fromUnitSymbol: string, toUnitSymbol: string): number {
  if (fromUnitSymbol === toUnitSymbol) return value;

  let celsiusValue: number;

  // Convert input to Celsius
  switch (fromUnitSymbol) {
    case "°F": // Fahrenheit to Celsius
      celsiusValue = (value - 32) * 5 / 9;
      break;
    case "K": // Kelvin to Celsius
      celsiusValue = value - 273.15;
      break;
    case "°C": // Already Celsius
    default:
      celsiusValue = value;
      break;
  }

  // Convert Celsius to target unit
  switch (toUnitSymbol) {
    case "°F": // Celsius to Fahrenheit
      return (celsiusValue * 9 / 5) + 32;
    case "K": // Celsius to Kelvin
      return celsiusValue + 273.15;
    case "°C": // Already Celsius (or target is Celsius)
    default:
      return celsiusValue;
  }
}

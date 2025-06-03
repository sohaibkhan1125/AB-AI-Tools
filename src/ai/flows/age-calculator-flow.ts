
'use server';
/**
 * @fileOverview Genkit flow for calculating age from a birth date.
 * - calculateAge - Function to compute age in years, months, and days.
 * - AgeCalculatorInput - Input type for age calculations.
 * - AgeCalculatorOutput - Output type for age calculations.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { parseISO, intervalToDuration, format, isValid } from 'date-fns';

const AgeCalculatorInputSchema = z.object({
  birthDateString: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Birth date must be in YYYY-MM-DD format.")
    .describe('The birth date as a string in YYYY-MM-DD format.'),
});
export type AgeCalculatorInput = z.infer<typeof AgeCalculatorInputSchema>;

const AgeCalculatorOutputSchema = z.object({
  years: z.number().int().describe('Calculated age in years.'),
  months: z.number().int().describe('Calculated age in months, after accounting for full years.'),
  days: z.number().int().describe('Calculated age in days, after accounting for full years and months.'),
  summary: z.string().describe("A human-readable summary of the age, e.g., '30 years, 5 months, and 10 days'."),
  birthDateFormatted: z.string().describe("The provided birth date, formatted nicely."),
  todayFormatted: z.string().describe("Today's date, formatted nicely."),
});
export type AgeCalculatorOutput = z.infer<typeof AgeCalculatorOutputSchema>;

const ageCalculatorFlow = ai.defineFlow(
  {
    name: 'ageCalculatorFlow',
    inputSchema: AgeCalculatorInputSchema,
    outputSchema: AgeCalculatorOutputSchema,
  },
  async (input) => {
    const birthDate = parseISO(input.birthDateString);
    const today = new Date();

    if (!isValid(birthDate)) {
      throw new Error('Invalid birth date provided. Please use YYYY-MM-DD format.');
    }
    
    if (birthDate > today) {
      throw new Error('Birth date cannot be in the future.');
    }

    const duration = intervalToDuration({ start: birthDate, end: today });

    const years = duration.years || 0;
    const months = duration.months || 0;
    const days = duration.days || 0;

    let summaryParts: string[] = [];
    if (years > 0) summaryParts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) summaryParts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (days > 0) summaryParts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (summaryParts.length === 0 && years === 0 && months === 0 && days === 0) {
        summaryParts.push("Today is the birth date!");
    }


    const summary = summaryParts.join(', ') || "Less than a day old.";
    
    return {
      years,
      months,
      days,
      summary,
      birthDateFormatted: format(birthDate, 'MMMM d, yyyy'),
      todayFormatted: format(today, 'MMMM d, yyyy'),
    };
  }
);

export async function getAgeDetails(input: AgeCalculatorInput): Promise<AgeCalculatorOutput> {
  return ageCalculatorFlow(input);
}

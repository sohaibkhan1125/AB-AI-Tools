'use server';
/**
 * @fileOverview Genkit flow for calculating simple interest.
 * - calculateSimpleInterest - Function to compute interest earned and total amount.
 * - SimpleInterestInput - Input type for simple interest calculations.
 * - SimpleInterestOutput - Output type for simple interest calculations.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SimpleInterestInputSchema = z.object({
  principal: z.number().positive({ message: 'Principal must be a positive number.' })
    .describe('The initial amount of money (principal).'),
  rate: z.number().min(0, { message: 'Interest rate cannot be negative.' }).max(100, { message: 'Interest rate seems too high (max 100%).' })
    .describe('The annual interest rate (e.g., 5 for 5%).'),
  timeYears: z.number().positive({ message: 'Time must be a positive number of years.' })
    .describe('The time period in years.'),
});
export type SimpleInterestInput = z.infer<typeof SimpleInterestInputSchema>;

const SimpleInterestOutputSchema = z.object({
  principal: z.number().describe('The initial principal amount.'),
  rate: z.number().describe('The annual interest rate applied (as percentage).'),
  timeYears: z.number().describe('The time period in years.'),
  interestEarned: z.number().describe('The calculated simple interest amount.'),
  totalAmount: z.number().describe('The total amount (principal + interest).'),
});
export type SimpleInterestOutput = z.infer<typeof SimpleInterestOutputSchema>;

const simpleInterestCalculatorFlow = ai.defineFlow(
  {
    name: 'simpleInterestCalculatorFlow',
    inputSchema: SimpleInterestInputSchema,
    outputSchema: SimpleInterestOutputSchema,
  },
  async (input) => {
    const { principal, rate, timeYears } = input;

    const interestEarned = parseFloat(((principal * rate * timeYears) / 100).toFixed(2));
    const totalAmount = parseFloat((principal + interestEarned).toFixed(2));

    return {
      principal,
      rate,
      timeYears,
      interestEarned,
      totalAmount,
    };
  }
);

export async function calculateSimpleInterest(input: SimpleInterestInput): Promise<SimpleInterestOutput> {
  return simpleInterestCalculatorFlow(input);
}

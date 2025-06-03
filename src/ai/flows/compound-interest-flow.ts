
'use server';
/**
 * @fileOverview Genkit flow for calculating compound interest.
 * - calculateCompoundInterest - Function to compute future value, total principal, total interest, and annual breakdown.
 * - CompoundInterestInput - Input type for compound interest calculations.
 * - CompoundInterestOutput - Output type for compound interest calculations.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CompoundingFrequencySchema = z.enum([
  'annually',
  'semi_annually',
  'quarterly',
  'monthly',
  'daily',
]);
export type CompoundingFrequency = z.infer<typeof CompoundingFrequencySchema>;

const CompoundInterestInputSchema = z.object({
  principalAmount: z.number().positive({ message: 'Principal amount must be a positive number.' })
    .describe('The initial amount of money invested.'),
  annualInterestRate: z.number().min(0, { message: 'Annual interest rate cannot be negative.' }).max(100, { message: 'Annual interest rate seems too high (max 100%).' })
    .describe('The annual interest rate (e.g., 5 for 5%).'),
  investmentTermYears: z.number().int().positive({ message: 'Investment term must be a positive number of years.' }).max(100, { message: 'Term seems too long (max 100 years).' })
    .describe('The number of years the money is invested or borrowed.'),
  compoundingFrequency: CompoundingFrequencySchema
    .describe('How often the interest is compounded per year.'),
  annualContribution: z.number().min(0, { message: 'Annual contribution cannot be negative.' }).optional()
    .describe('The additional amount contributed at the end of each year. Optional.'),
});
export type CompoundInterestInput = z.infer<typeof CompoundInterestInputSchema>;

const AnnualBreakdownEntrySchema = z.object({
  year: z.number().int(),
  startingBalance: z.number(),
  interestEarnedThisYear: z.number(),
  contributionThisYear: z.number(),
  endingBalance: z.number(),
});

const CompoundInterestOutputSchema = z.object({
  futureValue: z.number().describe('The total value of the investment at the end of the term.'),
  totalPrincipalInvested: z.number().describe('The initial principal plus all contributions made.'),
  totalInterestEarned: z.number().describe('The total interest earned over the term.'),
  annualBreakdown: z.array(AnnualBreakdownEntrySchema).describe('A year-by-year breakdown of the investment growth.'),
});
export type CompoundInterestOutput = z.infer<typeof CompoundInterestOutputSchema>;

function getCompoundingPeriodsPerYear(frequency: CompoundingFrequency): number {
  switch (frequency) {
    case 'annually': return 1;
    case 'semi_annually': return 2;
    case 'quarterly': return 4;
    case 'monthly': return 12;
    case 'daily': return 365; // Common practice, though can vary (365.25, 360)
    default: throw new Error('Invalid compounding frequency');
  }
}

const compoundInterestFlow = ai.defineFlow(
  {
    name: 'compoundInterestFlow',
    inputSchema: CompoundInterestInputSchema,
    outputSchema: CompoundInterestOutputSchema,
  },
  async (input) => {
    const {
      principalAmount,
      annualInterestRate,
      investmentTermYears,
      compoundingFrequency,
      annualContribution = 0, // Default to 0 if not provided
    } = input;

    const n = getCompoundingPeriodsPerYear(compoundingFrequency);
    const rate = annualInterestRate / 100;

    let currentBalance = principalAmount;
    let totalPrincipalInvested = principalAmount;
    const annualBreakdown: z.infer<typeof AnnualBreakdownEntrySchema>[] = [];

    for (let year = 1; year <= investmentTermYears; year++) {
      const startingBalanceForYear = currentBalance;
      let interestEarnedThisYear = 0;

      // Calculate interest compounded through the year
      let balanceAtYearStartForCompounding = currentBalance;
      for (let period = 0; period < n; period++) {
        const interestForPeriod = balanceAtYearStartForCompounding * (rate / n);
        balanceAtYearStartForCompounding += interestForPeriod;
        interestEarnedThisYear += interestForPeriod;
      }
      currentBalance = balanceAtYearStartForCompounding; // Update balance with compounded interest

      // Add annual contribution at the end of the year
      currentBalance += annualContribution;
      totalPrincipalInvested += annualContribution;
      
      // Round values for the breakdown to avoid floating point display issues
      const roundedInterestThisYear = parseFloat(interestEarnedThisYear.toFixed(2));
      const roundedEndingBalance = parseFloat(currentBalance.toFixed(2));
      const roundedStartingBalanceForYear = parseFloat(startingBalanceForYear.toFixed(2));


      annualBreakdown.push({
        year,
        startingBalance: roundedStartingBalanceForYear,
        interestEarnedThisYear: roundedInterestThisYear,
        contributionThisYear: annualContribution,
        endingBalance: roundedEndingBalance,
      });
    }

    const futureValue = parseFloat(currentBalance.toFixed(2));
    const roundedTotalPrincipalInvested = parseFloat(totalPrincipalInvested.toFixed(2));
    const totalInterestEarned = parseFloat((futureValue - roundedTotalPrincipalInvested).toFixed(2));


    return {
      futureValue,
      totalPrincipalInvested: roundedTotalPrincipalInvested,
      totalInterestEarned,
      annualBreakdown,
    };
  }
);

export async function calculateCompoundInterest(input: CompoundInterestInput): Promise<CompoundInterestOutput> {
  return compoundInterestFlow(input);
}

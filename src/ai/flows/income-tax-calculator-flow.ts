'use server';
/**
 * @fileOverview Genkit flow for a simplified income tax calculation.
 * - calculateIncomeTax - Function to compute total tax based on progressive brackets.
 * - IncomeTaxInput - Input type for income tax calculations.
 * - IncomeTaxOutput - Output type for income tax calculations.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define simple progressive tax brackets
const taxBrackets = [
  { limit: 10000, rate: 0.10 },  // 10% on income up to $10,000
  { limit: 50000, rate: 0.15 },  // 15% on income between $10,001 and $50,000
  { limit: Infinity, rate: 0.25 } // 25% on income above $50,000
];

const IncomeTaxInputSchema = z.object({
  income: z.number().nonnegative({ message: 'Income cannot be negative.' })
    .describe('The total annual taxable income.'),
});
export type IncomeTaxInput = z.infer<typeof IncomeTaxInputSchema>;

const TaxBracketDetailSchema = z.object({
  bracketDescription: z.string(),
  taxableInBracket: z.number(),
  taxPaidInBracket: z.number(),
  rate: z.number(),
});

const IncomeTaxOutputSchema = z.object({
  income: z.number().describe('The input income amount.'),
  totalTax: z.number().describe('The total calculated income tax.'),
  effectiveTaxRate: z.number().describe('The overall effective tax rate as a percentage.'),
  taxBreakdown: z.array(TaxBracketDetailSchema).describe('A breakdown of tax paid in each bracket.'),
});
export type IncomeTaxOutput = z.infer<typeof IncomeTaxOutputSchema>;

const incomeTaxCalculatorFlow = ai.defineFlow(
  {
    name: 'incomeTaxCalculatorFlow',
    inputSchema: IncomeTaxInputSchema,
    outputSchema: IncomeTaxOutputSchema,
  },
  async (input) => {
    const { income } = input;
    let totalTax = 0;
    let remainingIncome = income;
    let lowerBound = 0;
    const taxBreakdown: z.infer<typeof TaxBracketDetailSchema>[] = [];

    for (const bracket of taxBrackets) {
      if (remainingIncome <= 0) break;

      const bracketWidth = bracket.limit - lowerBound;
      const taxableInThisBracket = Math.min(remainingIncome, bracketWidth);
      const taxInThisBracket = parseFloat((taxableInThisBracket * bracket.rate).toFixed(2));
      
      totalTax += taxInThisBracket;
      remainingIncome -= taxableInThisBracket;

      taxBreakdown.push({
        bracketDescription: lowerBound === 0 
            ? `Up to $${bracket.limit.toLocaleString()}` 
            : (bracket.limit === Infinity 
                ? `Over $${lowerBound.toLocaleString()}` 
                : `$${(lowerBound + 1).toLocaleString()} - $${bracket.limit.toLocaleString()}`),
        taxableInBracket: taxableInThisBracket,
        taxPaidInBracket: taxInThisBracket,
        rate: bracket.rate * 100,
      });
      lowerBound = bracket.limit;
    }
    
    totalTax = parseFloat(totalTax.toFixed(2));
    const effectiveTaxRate = income > 0 ? parseFloat(((totalTax / income) * 100).toFixed(2)) : 0;

    return {
      income,
      totalTax,
      effectiveTaxRate,
      taxBreakdown,
    };
  }
);

export async function calculateIncomeTax(input: IncomeTaxInput): Promise<IncomeTaxOutput> {
  return incomeTaxCalculatorFlow(input);
}

'use server';
/**
 * @fileOverview Genkit flow for calculating sales tax.
 * - calculateSalesTax - Function to compute sales tax amount and total amount.
 * - SalesTaxInput - Input type for sales tax calculations.
 * - SalesTaxOutput - Output type for sales tax calculations.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SalesTaxInputSchema = z.object({
  amount: z.number().positive({ message: 'Amount must be a positive number.' })
    .describe('The pre-tax amount of the item or service.'),
  taxRate: z.number().min(0, { message: 'Tax rate cannot be negative.' }).max(100, { message: 'Tax rate seems too high (max 100%).' })
    .describe('The sales tax rate as a percentage (e.g., 7.5 for 7.5%).'),
});
export type SalesTaxInput = z.infer<typeof SalesTaxInputSchema>;

const SalesTaxOutputSchema = z.object({
  originalAmount: z.number().describe('The original pre-tax amount.'),
  taxRateApplied: z.number().describe('The tax rate that was applied (as percentage).'),
  taxAmount: z.number().describe('The calculated amount of sales tax.'),
  totalAmount: z.number().describe('The total amount including sales tax.'),
});
export type SalesTaxOutput = z.infer<typeof SalesTaxOutputSchema>;

const salesTaxCalculatorFlow = ai.defineFlow(
  {
    name: 'salesTaxCalculatorFlow',
    inputSchema: SalesTaxInputSchema,
    outputSchema: SalesTaxOutputSchema,
  },
  async (input) => {
    const { amount, taxRate } = input;

    const taxAmount = parseFloat((amount * (taxRate / 100)).toFixed(2));
    const totalAmount = parseFloat((amount + taxAmount).toFixed(2));

    return {
      originalAmount: amount,
      taxRateApplied: taxRate,
      taxAmount,
      totalAmount,
    };
  }
);

export async function calculateSalesTax(input: SalesTaxInput): Promise<SalesTaxOutput> {
  return salesTaxCalculatorFlow(input);
}

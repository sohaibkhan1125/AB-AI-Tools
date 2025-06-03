
'use server';
/**
 * @fileOverview Genkit flow for calculating loan details.
 * - calculateLoanDetails - Function to compute monthly payment, total payment, total interest, and amortization schedule.
 * - LoanCalculatorInput - Input type for loan calculations.
 * - LoanCalculatorOutput - Output type for loan calculations.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LoanCalculatorInputSchema = z.object({
  loanAmount: z.number().positive({ message: 'Loan amount must be positive.' })
    .describe('The principal amount of the loan.'),
  annualInterestRate: z.number().positive({ message: 'Annual interest rate must be positive.' })
    .describe('The annual interest rate (e.g., 5 for 5%).'),
  loanTermYears: z.number().int().positive({ message: 'Loan term must be a positive number of years.' })
    .describe('The loan term in years.'),
});
export type LoanCalculatorInput = z.infer<typeof LoanCalculatorInputSchema>;

const AmortizationEntrySchema = z.object({
  month: z.number().int(),
  principalPayment: z.number(),
  interestPayment: z.number(),
  remainingBalance: z.number(),
});

const LoanCalculatorOutputSchema = z.object({
  monthlyPayment: z.number().describe('The calculated monthly payment amount.'),
  totalPayment: z.number().describe('The total amount paid over the life of the loan.'),
  totalInterest: z.number().describe('The total interest paid over the life of the loan.'),
  amortizationSchedule: z.array(AmortizationEntrySchema).describe('A schedule of payments over the loan term.'),
});
export type LoanCalculatorOutput = z.infer<typeof LoanCalculatorOutputSchema>;

const loanCalculatorFlow = ai.defineFlow(
  {
    name: 'loanCalculatorFlow',
    inputSchema: LoanCalculatorInputSchema,
    outputSchema: LoanCalculatorOutputSchema,
  },
  async (input) => {
    const { loanAmount, annualInterestRate, loanTermYears } = input;

    if (loanAmount <= 0 || annualInterestRate <= 0 || loanTermYears <= 0) {
      throw new Error('Loan amount, interest rate, and term must be positive values.');
    }

    const monthlyInterestRate = (annualInterestRate / 100) / 12;
    const numberOfPayments = loanTermYears * 12;

    let monthlyPayment: number;
    if (monthlyInterestRate === 0) { // Handle 0% interest rate
      monthlyPayment = loanAmount / numberOfPayments;
    } else {
      monthlyPayment =
        loanAmount *
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    }
    
    monthlyPayment = parseFloat(monthlyPayment.toFixed(2)); // Round to 2 decimal places

    const totalPayment = parseFloat((monthlyPayment * numberOfPayments).toFixed(2));
    const totalInterest = parseFloat((totalPayment - loanAmount).toFixed(2));

    const amortizationSchedule: z.infer<typeof AmortizationEntrySchema>[] = [];
    let remainingBalance = loanAmount;

    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = parseFloat((remainingBalance * monthlyInterestRate).toFixed(2));
      let principalPayment = parseFloat((monthlyPayment - interestPayment).toFixed(2));
      
      if (month === numberOfPayments) {
        // Adjust last principal payment to ensure balance is zero
        principalPayment = remainingBalance;
        monthlyPayment = principalPayment + interestPayment; // Adjust last month's total payment
      }
      
      remainingBalance = parseFloat((remainingBalance - principalPayment).toFixed(2));

      // Ensure remaining balance doesn't go slightly negative due to floating point issues
      if (remainingBalance < 0 && remainingBalance > -0.01) remainingBalance = 0;


      amortizationSchedule.push({
        month,
        principalPayment,
        interestPayment,
        remainingBalance: remainingBalance <= 0 ? 0 : remainingBalance, // Ensure it's exactly 0 if paid off
      });

      if (remainingBalance <= 0) break; // Stop if loan is paid off early (shouldn't happen with fixed payment)
    }
     // Adjust totalPayment if the last payment was different
    const actualTotalPayment = amortizationSchedule.reduce((sum, entry) => sum + entry.principalPayment + entry.interestPayment, 0);
    const actualTotalInterest = actualTotalPayment - loanAmount;


    return {
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)), // The standard monthly payment, might be different for last month
      totalPayment: parseFloat(actualTotalPayment.toFixed(2)),
      totalInterest: parseFloat(actualTotalInterest.toFixed(2)),
      amortizationSchedule,
    };
  }
);

export async function calculateLoanDetails(input: LoanCalculatorInput): Promise<LoanCalculatorOutput> {
  return loanCalculatorFlow(input);
}

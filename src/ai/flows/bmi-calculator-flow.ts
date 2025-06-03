
'use server';
/**
 * @fileOverview Genkit flow for calculating Body Mass Index (BMI).
 * - getBmiDetails - Function to compute BMI and determine its category.
 * - BmiInput - Input type for BMI calculations (weight in kg, height in cm).
 * - BmiOutput - Output type for BMI calculations (BMI value, category, and original inputs).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Internal Zod Schemas (not exported directly due to 'use server' constraints)
const BmiInputSchemaInternal = z.object({
  weightKg: z.number().positive({ message: "Weight must be a positive number." })
    .describe('Weight in kilograms (kg).'),
  heightCm: z.number().positive({ message: "Height must be a positive number." })
    .describe('Height in centimeters (cm).'),
});
export type BmiInput = z.infer<typeof BmiInputSchemaInternal>;

const BmiOutputSchemaInternal = z.object({
  bmi: z.number().describe('Calculated Body Mass Index.'),
  category: z.string().describe('BMI category (e.g., Underweight, Normal weight, Overweight, Obese).'),
  weightKg: z.number().describe('The weight in kg used for calculation.'),
  heightCm: z.number().describe('The height in cm used for calculation.'),
});
export type BmiOutput = z.infer<typeof BmiOutputSchemaInternal>;

const bmiCalculatorFlow = ai.defineFlow(
  {
    name: 'bmiCalculatorFlow',
    inputSchema: BmiInputSchemaInternal,
    outputSchema: BmiOutputSchemaInternal,
  },
  async (input) => {
    const { weightKg, heightCm } = input;

    // Input validation is handled by Zod schema, but defensive checks are good.
    if (weightKg <= 0 || heightCm <= 0) {
      throw new Error('Weight and height must be positive values.');
    }

    const heightM = heightCm / 100; // Convert height from cm to meters
    const bmiRaw = weightKg / (heightM * heightM);
    const bmi = parseFloat(bmiRaw.toFixed(2)); // Round to 2 decimal places

    let category: string;
    if (bmi < 18.5) {
      category = 'Underweight';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      category = 'Normal weight';
    } else if (bmi >= 25 && bmi <= 29.9) {
      category = 'Overweight';
    } else { // bmi >= 30
      category = 'Obese';
    }

    return {
      bmi,
      category,
      weightKg, // Return the input values for clarity if needed on frontend
      heightCm,
    };
  }
);

export async function getBmiDetails(input: BmiInput): Promise<BmiOutput> {
  return bmiCalculatorFlow(input);
}

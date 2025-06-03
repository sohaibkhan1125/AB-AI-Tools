
'use server';
/**
 * @fileOverview Genkit flow for generating Lorem Ipsum style placeholder text.
 *
 * - generateLoremIpsum - A function that takes parameters for text generation and returns Lorem Ipsum style text.
 * - LoremIpsumInput - The input type for the generateLoremIpsum function.
 * - LoremIpsumOutput - The return type for the generateLoremIpsum function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LoremIpsumInputSchema = z.object({
  type: z.enum(['paragraphs', 'sentences', 'words'])
    .describe("The type of Lorem Ipsum text to generate: 'paragraphs', 'sentences', or 'words'."),
  count: z.number().int().min(1).max(100) // Max 100 for paragraphs/sentences, higher for words if needed but keep reasonable
    .describe("The number of paragraphs, sentences, or words to generate."),
  startsWithDefault: z.boolean().optional()
    .describe("If true, the generated text should begin with 'Lorem ipsum dolor sit amet...'."),
});
export type LoremIpsumInput = z.infer<typeof LoremIpsumInputSchema>;

const LoremIpsumOutputSchema = z.object({
  text: z.string().describe('The generated Lorem Ipsum style placeholder text.'),
});
export type LoremIpsumOutput = z.infer<typeof LoremIpsumOutputSchema>;

// Define the prompt for Lorem Ipsum generation
const loremIpsumGenPrompt = ai.definePrompt({
  name: 'loremIpsumGenPrompt',
  input: { schema: LoremIpsumInputSchema },
  output: { schema: LoremIpsumOutputSchema },
  prompt: `You are an expert in generating placeholder text.
Your task is to generate {{count}} {{type}} of Lorem Ipsum style placeholder text.
{{#if startsWithDefault}}
The text must begin with "Lorem ipsum dolor sit amet...".
{{/if}}
Ensure the output is only the generated text itself, without any additional commentary or explanation.
The text should be suitable for use as placeholder content in design mockups and web pages.`,
  // config: { temperature: 0.7 } // Adjust temperature for creativity if needed
});

// Define the Genkit flow
const loremIpsumFlow = ai.defineFlow(
  {
    name: 'loremIpsumFlow',
    inputSchema: LoremIpsumInputSchema,
    outputSchema: LoremIpsumOutputSchema,
  },
  async (input) => {
    const { output } = await loremIpsumGenPrompt(input);
    if (!output) {
      throw new Error('Lorem Ipsum generation failed to produce output.');
    }
    return output;
  }
);

// Exported wrapper function to be called from the client
export async function generateLoremIpsum(input: LoremIpsumInput): Promise<LoremIpsumOutput> {
  return loremIpsumFlow(input);
}

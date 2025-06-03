
'use server';
/**
 * @fileOverview Genkit flow for formatting HTML content using Prettier.
 *
 * - formatHtml - A function that takes an HTML string and returns a formatted HTML string.
 * - HtmlFormatterInput - The input type for the formatHtml function.
 * - HtmlFormatterOutput - The return type for the formatHtml function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as prettier from 'prettier';

const HtmlFormatterInputSchema = z.object({
  htmlContent: z.string().describe('The HTML content as a string.'),
});
export type HtmlFormatterInput = z.infer<typeof HtmlFormatterInputSchema>;

const HtmlFormatterOutputSchema = z.object({
  formattedHtml: z.string().describe('The formatted HTML content as a string.'),
});
export type HtmlFormatterOutput = z.infer<typeof HtmlFormatterOutputSchema>;

const htmlFormatterFlow = ai.defineFlow(
  {
    name: 'htmlFormatterFlow',
    inputSchema: HtmlFormatterInputSchema,
    outputSchema: HtmlFormatterOutputSchema,
  },
  async (input) => {
    try {
      // Prettier's format function is synchronous for HTML unless async plugins are involved.
      // However, defineFlow expects an async function, so we'll keep it async.
      const formatted = await prettier.format(input.htmlContent, {
        parser: 'html',
        printWidth: 100, // You can adjust printWidth as needed
        htmlWhitespaceSensitivity: 'css', // Handles whitespace like CSS would
      });
      return { formattedHtml: formatted };
    } catch (error: any) {
      console.error('HTML formatting error in flow:', error);
      // Rethrow the error so it can be caught by the client call
      throw new Error(
        `Formatting failed: ${error.message || 'Unknown error during HTML formatting.'}`
      );
    }
  }
);

export async function formatHtml(
  input: HtmlFormatterInput
): Promise<HtmlFormatterOutput> {
  return htmlFormatterFlow(input);
}

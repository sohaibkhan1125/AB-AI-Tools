
'use server';
/**
 * @fileOverview Genkit flow for extracting tabular data from an image of a PDF page to CSV text.
 *
 * - extractTableFromPdfPageImage - A function that takes an image of a PDF page and returns CSV text.
 * - PdfPageToCsvInput - The input type.
 * - PdfPageToCsvOutput - The output type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PdfPageToCsvInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image of a single PDF page, as a data URI. Expected format: 'data:image/<mimetype>;base64,<encoded_data>'."
    ),
  userPrompt: z
    .string()
    .optional()
    .describe('Optional user instructions for extraction, e.g., "focus on financial data".'),
});
export type PdfPageToCsvInput = z.infer<typeof PdfPageToCsvInputSchema>;

const PdfPageToCsvOutputSchema = z.object({
  csvText: z.string().describe('The extracted data in CSV format, or a message indicating if no table was found.'),
});
export type PdfPageToCsvOutput = z.infer<typeof PdfPageToCsvOutputSchema>;

const pdfPageToCsvPrompt = ai.definePrompt({
  name: 'pdfPageToCsvPrompt',
  input: { schema: PdfPageToCsvInputSchema },
  output: { schema: PdfPageToCsvOutputSchema },
  prompt: `You are an expert data extraction assistant.
The user has provided an image of a page from a PDF document.
Your task is to identify any tabular data within this image and convert it into valid CSV (Comma Separated Values) format.

Guidelines:
- If multiple distinct tables are present, attempt to extract them all. You can either concatenate them into a single CSV string if they share a similar structure, or clearly separate them with a few blank lines if they are very different.
- If no clear tabular data is found, respond with the exact message: "No tabular data found on this page."
- Ensure the CSV is clean, with commas as delimiters and newlines for rows.
- Handle commas within data fields by enclosing the field in double quotes (e.g., "Doe, John").
- Handle double quotes within data fields by escaping them with another double quote (e.g., "Said ""Hello""").
- Do not include any explanatory text, titles, or summaries before or after the CSV data itself, unless no table is found as specified above.
- Strive for accuracy in extracting the cell values.

Image of PDF page:
{{media url=imageDataUri}}

{{#if userPrompt}}
Additional instructions from user: {{{userPrompt}}}
{{/if}}
`,
  config: {
    temperature: 0.1, // Lower temperature for more deterministic output
  },
});

const pdfPageToCsvFlow = ai.defineFlow(
  {
    name: 'pdfPageToCsvFlow',
    inputSchema: PdfPageToCsvInputSchema,
    outputSchema: PdfPageToCsvOutputSchema,
  },
  async (input) => {
    const { output } = await pdfPageToCsvPrompt(input);
    if (!output) {
      throw new Error('CSV extraction from PDF page image failed to produce output.');
    }
    // Sanitize output slightly: Gen AI might sometimes add ```csv ... ```
    let csvText = output.csvText.trim();
    if (csvText.startsWith('```csv')) {
        csvText = csvText.substring(6);
    }
    if (csvText.endsWith('```')) {
        csvText = csvText.substring(0, csvText.length - 3);
    }
    return { csvText: csvText.trim() };
  }
);

export async function extractTableFromPdfPageImage(input: PdfPageToCsvInput): Promise<PdfPageToCsvOutput> {
  return pdfPageToCsvFlow(input);
}


'use server';
/**
 * @fileOverview Genkit flow for extracting text content from an image of a PDF page.
 *
 * - extractTextFromPdfPageImage - A function that takes an image of a PDF page and returns extracted text.
 * - PdfToWordTextExtractionInput - The input type.
 * - PdfToWordTextExtractionOutput - The output type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PdfToWordTextExtractionInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image of a single PDF page, as a data URI. Expected format: 'data:image/<mimetype>;base64,<encoded_data>'."
    ),
  userPrompt: z
    .string()
    .optional()
    .describe('Optional user instructions for extraction, e.g., "try to maintain paragraph structure".'),
});
export type PdfToWordTextExtractionInput = z.infer<typeof PdfToWordTextExtractionInputSchema>;

const PdfToWordTextExtractionOutputSchema = z.object({
  extractedText: z.string().describe('The extracted plain text content from the PDF page image.'),
});
export type PdfToWordTextExtractionOutput = z.infer<typeof PdfToWordTextExtractionOutputSchema>;

const pdfToWordTextExtractionPrompt = ai.definePrompt({
  name: 'pdfToWordTextExtractionPrompt',
  input: { schema: PdfToWordTextExtractionInputSchema },
  output: { schema: PdfToWordTextExtractionOutputSchema },
  prompt: `You are an expert Optical Character Recognition (OCR) and text extraction assistant.
The user has provided an image of a page from a PDF document.
Your task is to accurately transcribe all textual content from this image.
Preserve paragraph structure and line breaks as best as possible based on the visual layout.
The output should be only the extracted plain text itself, without any additional commentary, summaries, or markdown formatting (unless the markdown is part of the original text).

Image of PDF page:
{{media url=imageDataUri}}

{{#if userPrompt}}
Additional instructions from user: {{{userPrompt}}}
{{/if}}
`,
  config: {
    temperature: 0.1, // Lower temperature for more deterministic and accurate text extraction
  },
});

const pdfToWordTextExtractionFlow = ai.defineFlow(
  {
    name: 'pdfToWordTextExtractionFlow',
    inputSchema: PdfToWordTextExtractionInputSchema,
    outputSchema: PdfToWordTextExtractionOutputSchema,
  },
  async (input) => {
    const { output } = await pdfToWordTextExtractionPrompt(input);
    if (!output) {
      throw new Error('Text extraction from PDF page image failed to produce output.');
    }
    return { extractedText: output.extractedText.trim() };
  }
);

export async function extractTextFromPdfPageImage(input: PdfToWordTextExtractionInput): Promise<PdfToWordTextExtractionOutput> {
  return pdfToWordTextExtractionFlow(input);
}

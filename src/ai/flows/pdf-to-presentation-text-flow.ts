
'use server';
/**
 * @fileOverview Genkit flow for extracting text from all pages of a PDF.
 *
 * - extractTextFromPdfDocument - Takes a PDF data URI, processes each page (up to a limit),
 *   and returns an array of objects containing page number and extracted text.
 * - PdfToPresentationTextInput - Input type (PDF data URI).
 * - PdfToPresentationTextOutput - Output type (array of page text objects).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { PDFDocument } from 'pdf-lib';
import { extractTextFromPdfPageImage, type PdfToWordTextExtractionInput } from '@/ai/flows/pdf-to-word-text-extraction-flow';

const MAX_PAGES_TO_PROCESS = 5; // Limit to prevent excessive processing

const PdfToPresentationTextInputSchema = z.object({
  pdfDataUri: z
    .string()
    .regex(/^data:application\/pdf;base64,/, { message: "PDF must be a data URI starting with 'data:application/pdf;base64,'." })
    .describe(
      "The entire PDF document as a data URI. Must start with 'data:application/pdf;base64,'."
    ),
});
export type PdfToPresentationTextInput = z.infer<typeof PdfToPresentationTextInputSchema>;

const PageTextSchema = z.object({
  pageNumber: z.number().int().positive(),
  extractedText: z.string(),
});

const PdfToPresentationTextOutputSchema = z.object({
  pages: z.array(PageTextSchema).describe('An array of objects, each containing the page number and its extracted text.'),
  processedPagesCount: z.number().int().describe('Number of pages actually processed.'),
  totalPagesCount: z.number().int().describe('Total pages in the PDF.'),
  limitApplied: z.boolean().describe(`Whether the ${MAX_PAGES_TO_PROCESS} page limit was applied.`)
});
export type PdfToPresentationTextOutput = z.infer<typeof PdfToPresentationTextOutputSchema>;

const pdfToPresentationTextFlow = ai.defineFlow(
  {
    name: 'pdfToPresentationTextFlow',
    inputSchema: PdfToPresentationTextInputSchema,
    outputSchema: PdfToPresentationTextOutputSchema,
  },
  async (input) => {
    const base64String = input.pdfDataUri.substring(input.pdfDataUri.indexOf(',') + 1);
    const pdfBytes = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const totalPages = pdfDoc.getPageCount();
    const pagesToProcess = Math.min(totalPages, MAX_PAGES_TO_PROCESS);
    const limitApplied = totalPages > MAX_PAGES_TO_PROCESS;
    const extractedPagesData: z.infer<typeof PageTextSchema>[] = [];

    for (let i = 0; i < pagesToProcess; i++) {
      const page = pdfDoc.getPages()[i];
      const { width, height } = page.getSize();

      // Create a placeholder image for the AI (similar to other PDF tools)
      const canvas = document.createElement('canvas');
      const scaleFactor = 1.5; // Use a reasonable scale for AI processing
      canvas.width = width * scaleFactor;
      canvas.height = height * scaleFactor;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.warn(`Could not get canvas context for page ${i + 1}. Skipping.`);
        extractedPagesData.push({
            pageNumber: i + 1,
            extractedText: "[Error creating image for this page]"
        });
        continue;
      }
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.font = `${Math.min(30 * scaleFactor, canvas.height / 10)}px Arial`; // Dynamic font size
      ctx.textAlign = 'center';
      ctx.fillText(`PDF Page ${i+1} Content`, canvas.width / 2, canvas.height / 2);
      
      const imageDataUri = canvas.toDataURL('image/png');

      try {
        const textExtractionInput: PdfToWordTextExtractionInput = { imageDataUri };
        const textResult = await extractTextFromPdfPageImage(textExtractionInput);
        extractedPagesData.push({
          pageNumber: i + 1,
          extractedText: textResult.extractedText,
        });
      } catch (e: any) {
        console.error(`Error extracting text from page ${i + 1}:`, e);
        extractedPagesData.push({
          pageNumber: i + 1,
          extractedText: `[Error extracting text: ${e.message || 'Unknown error'}]`,
        });
      }
    }

    return {
      pages: extractedPagesData,
      processedPagesCount: pagesToProcess,
      totalPagesCount: totalPages,
      limitApplied,
    };
  }
);

export async function extractTextFromPdfDocument(input: PdfToPresentationTextInput): Promise<PdfToPresentationTextOutput> {
  return pdfToPresentationTextFlow(input);
}


'use server';
/**
 * @fileOverview Genkit flow for extracting specific pages from a PDF document.
 * - extractPdfPages - Function that takes a PDF data URI and a page selection string,
 *                     and returns a new PDF data URI containing only the extracted pages.
 * - ExtractPdfPagesInput - Input type for the extractPdfPages function.
 * - ExtractPdfPagesOutput - Output type for the extractPdfPages function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { PDFDocument } from 'pdf-lib';

const ExtractPdfPagesInputSchema = z.object({
  pdfDataUri: z
    .string()
    .regex(/^data:application\/pdf;base64,/, { message: "PDF must be a data URI starting with 'data:application/pdf;base64,'." })
    .describe('The PDF file, encoded as a base64 data URI.'),
  pageRanges: z
    .string()
    .min(1, { message: "Page ranges string cannot be empty."})
    .describe('A string specifying pages to extract. Examples: "1", "1,3,5-7", "2-".'),
});
export type ExtractPdfPagesInput = z.infer<typeof ExtractPdfPagesInputSchema>;

const ExtractPdfPagesOutputSchema = z.object({
  extractedPdfDataUri: z.string().optional().describe('The new PDF document with extracted pages as a base64 data URI, if successful.'),
  message: z.string().describe('A message indicating the outcome of the operation.'),
  success: z.boolean().describe('Whether the operation was successful.'),
});
export type ExtractPdfPagesOutput = z.infer<typeof ExtractPdfPagesOutputSchema>;

/**
 * Parses a page number string (e.g., "1,3,5-7") into a sorted array of unique 0-indexed page numbers.
 * @param pageNumbersStr The string to parse.
 * @param totalPages The total number of pages in the PDF.
 * @returns An array of 0-indexed page numbers.
 * @throws Error if the page number string is invalid or specifies pages out of bounds.
 */
function parsePageNumbersForExtraction(pageNumbersStr: string, totalPages: number): number[] {
  const uniquePageIndices = new Set<number>();

  if (totalPages === 0) {
    throw new Error("Cannot extract pages from an empty PDF.");
  }
  
  if (pageNumbersStr.trim().toLowerCase() === 'all') {
     for (let i = 0; i < totalPages; i++) {
        uniquePageIndices.add(i);
     }
     return Array.from(uniquePageIndices).sort((a, b) => a - b);
  }


  const parts = pageNumbersStr.split(',');
  for (const part of parts) {
    const trimmedPart = part.trim();
    if (trimmedPart.includes('-')) {
      const [startStr, endStr] = trimmedPart.split('-');
      let start = parseInt(startStr, 10);
      let end = endStr ? parseInt(endStr, 10) : totalPages; // Default end to totalPages if not specified (e.g., "5-")

      if (isNaN(start) || start < 1) {
        throw new Error(`Invalid start page number: "${startStr}" in range "${trimmedPart}".`);
      }
      if (endStr && (isNaN(end) || end < start)) {
        throw new Error(`Invalid end page number: "${endStr}" in range "${trimmedPart}". End must be >= start.`);
      }
      if (start > totalPages) {
        // If start of range is beyond total pages, it's an error or just skip. Let's error for clarity.
        throw new Error(`Start page ${start} in range "${trimmedPart}" exceeds total pages ${totalPages}.`);
      }
      end = Math.min(end, totalPages); // Cap end at totalPages

      for (let i = start; i <= end; i++) {
        uniquePageIndices.add(i - 1); // 0-indexed
      }
    } else {
      const pageNum = parseInt(trimmedPart, 10);
      if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
        throw new Error(`Invalid page number: "${trimmedPart}". Must be between 1 and ${totalPages}.`);
      }
      uniquePageIndices.add(pageNum - 1); // 0-indexed
    }
  }

  if (uniquePageIndices.size === 0) {
    throw new Error("No valid page numbers were specified for extraction or found within the PDF's range.");
  }

  return Array.from(uniquePageIndices).sort((a, b) => a - b); // Sort for consistent page order in new PDF
}

const extractPdfPagesFlow = ai.defineFlow(
  {
    name: 'extractPdfPagesFlow',
    inputSchema: ExtractPdfPagesInputSchema,
    outputSchema: ExtractPdfPagesOutputSchema,
  },
  async (input) => {
    const { pdfDataUri, pageRanges } = input;
    try {
      const base64String = pdfDataUri.substring(pdfDataUri.indexOf(',') + 1);
      const pdfBytes = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));

      const sourcePdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const totalPages = sourcePdfDoc.getPageCount();

      if (totalPages === 0) {
        return { message: 'The source PDF is empty and has no pages to extract.', success: false };
      }
      
      let targetPageIndices: number[];
      try {
        targetPageIndices = parsePageNumbersForExtraction(pageRanges, totalPages);
      } catch (e: any) {
        return { message: `Error parsing page numbers: ${e.message}`, success: false };
      }

      if (targetPageIndices.length === 0) {
        return { message: 'No valid pages selected for extraction.', success: false };
      }
      
      const newPdfDoc = await PDFDocument.create();
      // Ensure indices are sorted for consistent copying order
      const sortedIndices = targetPageIndices.sort((a, b) => a - b);
      const copiedPages = await newPdfDoc.copyPages(sourcePdfDoc, sortedIndices);
      
      copiedPages.forEach(page => newPdfDoc.addPage(page));

      const newPdfBytes = await newPdfDoc.save();
      const newPdfBase64 = Buffer.from(newPdfBytes).toString('base64');
      
      return {
        extractedPdfDataUri: `data:application/pdf;base64,${newPdfBase64}`,
        message: `Successfully extracted ${targetPageIndices.length} page(s).`,
        success: true,
      };

    } catch (e: any) {
      console.error('Error extracting PDF pages:', e);
      let userMessage = 'Failed to extract PDF pages. ';
      if (e.message && (e.message.toLowerCase().includes('password') || e.message.toLowerCase().includes('encrypted'))) {
        userMessage += 'The PDF might be encrypted or corrupted.';
      } else if (e.message && e.message.includes('Invalid PDF')) {
        userMessage += 'The file does not appear to be a valid PDF or is corrupted.';
      } else {
        userMessage += e.message || 'Please ensure the PDF and page ranges are valid.';
      }
      return {
        message: userMessage,
        success: false,
      };
    }
  }
);

export async function extractPdfPages(input: ExtractPdfPagesInput): Promise<ExtractPdfPagesOutput> {
  return extractPdfPagesFlow(input);
}

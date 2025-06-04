
'use server';
/**
 * @fileOverview Genkit flow for deleting pages from a PDF document.
 * - deletePdfPages - Function that takes a PDF data URI and a page selection string,
 *                    and returns the modified PDF data URI with specified pages removed.
 * - DeletePdfPagesInput - Input type for the deletePdfPages function.
 * - DeletePdfPagesOutput - Output type for the deletePdfPages function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { PDFDocument } from 'pdf-lib';

const DeletePdfPagesInputSchema = z.object({
  pdfDataUri: z
    .string()
    .regex(/^data:application\/pdf;base64,/, { message: "PDF must be a data URI starting with 'data:application/pdf;base64,'." })
    .describe('The PDF file, encoded as a base64 data URI.'),
  pageNumbersToDelete: z
    .string()
    .min(1, { message: "Page numbers string cannot be empty."})
    .describe('A string specifying pages to delete. Examples: "1", "1,3,5-7", "2-". Cannot be "all" or result in deleting all pages.'),
});
export type DeletePdfPagesInput = z.infer<typeof DeletePdfPagesInputSchema>;

const DeletePdfPagesOutputSchema = z.object({
  modifiedPdfDataUri: z.string().optional().describe('The modified PDF document as a base64 data URI, if successful.'),
  message: z.string().describe('A message indicating the outcome of the operation.'),
  success: z.boolean().describe('Whether the operation was successful.'),
});
export type DeletePdfPagesOutput = z.infer<typeof DeletePdfPagesOutputSchema>;

/**
 * Parses a page number string (e.g., "1,3,5-7") into an array of 0-indexed page numbers.
 * @param pageNumbersStr The string to parse.
 * @param totalPages The total number of pages in the PDF.
 * @returns An array of 0-indexed page numbers.
 * @throws Error if the page number string is invalid, out of bounds, or specifies all pages for deletion.
 */
function parsePageNumbersForDeletion(pageNumbersStr: string, totalPages: number): number[] {
  const uniquePageIndices = new Set<number>();

  if (totalPages === 0) {
    throw new Error("Cannot delete pages from an empty PDF.");
  }

  if (pageNumbersStr.toLowerCase() === 'all') {
    throw new Error("Cannot delete all pages from a PDF. The document must have at least one page remaining.");
  }

  const parts = pageNumbersStr.split(',');
  for (const part of parts) {
    const trimmedPart = part.trim();
    if (trimmedPart.includes('-')) {
      const [startStr, endStr] = trimmedPart.split('-');
      const start = parseInt(startStr, 10);
      
      if (isNaN(start) || start < 1 ) {
        throw new Error(`Invalid start page number: ${startStr}`);
      }

      if (endStr === '' || endStr === undefined) { // Range like "2-" means from 2 to end
        for (let i = start - 1; i < totalPages; i++) {
            if (i >= 0) uniquePageIndices.add(i);
        }
      } else {
        const end = parseInt(endStr, 10);
        if (isNaN(end) || end < start ) {
            throw new Error(`Invalid end page number in range: ${startStr}-${endStr}`);
        }
        if (end > totalPages) {
            throw new Error(`End page ${end} exceeds total pages ${totalPages}.`);
        }
        for (let i = start - 1; i < end; i++) { // end is inclusive for user (1-based), so loop to < end for 0-based.
           if (i >= 0 && i < totalPages) uniquePageIndices.add(i);
        }
      }
    } else {
      const pageNum = parseInt(trimmedPart, 10);
      if (isNaN(pageNum) || pageNum < 1 ) {
        throw new Error(`Invalid page number: ${trimmedPart}`);
      }
      if (pageNum > totalPages) {
          throw new Error(`Page ${pageNum} exceeds total pages ${totalPages}.`);
      }
      if (pageNum -1 >= 0 && pageNum -1 < totalPages) {
        uniquePageIndices.add(pageNum - 1); // 0-indexed
      }
    }
  }
  
  if (uniquePageIndices.size === 0) {
      throw new Error("No valid page numbers were specified for deletion or found within the PDF's range.");
  }
  
  if (uniquePageIndices.size >= totalPages) {
    throw new Error("Cannot delete all pages. At least one page must remain in the PDF.");
  }

  return Array.from(uniquePageIndices).sort((a,b) => a - b); // Sort for consistent processing, though deletion order is reversed later
}

const deletePdfPagesFlow = ai.defineFlow(
  {
    name: 'deletePdfPagesFlow',
    inputSchema: DeletePdfPagesInputSchema,
    outputSchema: DeletePdfPagesOutputSchema,
  },
  async (input) => {
    const { pdfDataUri, pageNumbersToDelete } = input;
    try {
      const base64String = pdfDataUri.substring(pdfDataUri.indexOf(',') + 1);
      const pdfBytes = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));

      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const totalPages = pdfDoc.getPageCount();

      if (totalPages === 0) {
        return { message: 'The PDF is empty and has no pages to delete.', success: false };
      }
      
      let targetPageIndices: number[];
      try {
        targetPageIndices = parsePageNumbersForDeletion(pageNumbersToDelete, totalPages);
      } catch (e: any) {
        return { message: `Error parsing page numbers: ${e.message}`, success: false };
      }

      if (targetPageIndices.length === 0) {
        return { message: 'No valid pages selected for deletion.', success: false };
      }
      if (targetPageIndices.length >= totalPages) {
        return { message: 'Cannot delete all pages. At least one page must remain.', success: false };
      }
      
      // Remove pages in descending order to avoid index shifting issues
      targetPageIndices.sort((a, b) => b - a).forEach(pageIndex => {
        if (pageIndex >= 0 && pageIndex < pdfDoc.getPageCount()) { // Check page count dynamically as it changes
          pdfDoc.removePage(pageIndex);
        }
      });

      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedPdfBase64 = Buffer.from(modifiedPdfBytes).toString('base64');
      
      return {
        modifiedPdfDataUri: `data:application/pdf;base64,${modifiedPdfBase64}`,
        message: `Successfully deleted ${targetPageIndices.length} page(s).`,
        success: true,
      };

    } catch (e: any) {
      console.error('Error deleting PDF pages:', e);
      let userMessage = 'Failed to delete PDF pages. ';
      if (e.message && (e.message.toLowerCase().includes('password') || e.message.toLowerCase().includes('encrypted'))) {
        userMessage += 'The PDF might be encrypted and require a password not handled by this tool, or it is corrupted.';
      } else if (e.message && e.message.includes('Invalid PDF')) {
        userMessage += 'The file does not appear to be a valid PDF or is corrupted.';
      } else {
        userMessage += e.message || 'Please ensure the PDF and page numbers are valid.';
      }
      return {
        message: userMessage,
        success: false,
      };
    }
  }
);

export async function deletePdfPages(input: DeletePdfPagesInput): Promise<DeletePdfPagesOutput> {
  return deletePdfPagesFlow(input);
}


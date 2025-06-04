
'use server';
/**
 * @fileOverview Genkit flow for rotating pages in a PDF document.
 * - rotatePdfPages - Function that takes a PDF data URI, page selection string, and rotation angle,
 *                    and returns the modified PDF data URI.
 * - RotatePdfInput - Input type for the rotatePdfPages function.
 * - RotatePdfOutput - Output type for the rotatePdfPages function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { PDFDocument, RotationTypes, degrees } from 'pdf-lib';

const RotatePdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .regex(/^data:application\/pdf;base64,/, { message: "PDF must be a data URI starting with 'data:application/pdf;base64,'." })
    .describe('The PDF file, encoded as a base64 data URI.'),
  pageNumbers: z
    .string()
    .min(1, { message: "Page numbers string cannot be empty."})
    .describe('A string specifying pages to rotate. Examples: "all", "1", "1,3,5-7", "2-".'),
  rotationAngle: z
    .enum(['90', '180', '270'])
    .describe('The angle to rotate pages clockwise: "90", "180", or "270" degrees.'),
});
export type RotatePdfInput = z.infer<typeof RotatePdfInputSchema>;

const RotatePdfOutputSchema = z.object({
  modifiedPdfDataUri: z.string().optional().describe('The modified PDF document as a base64 data URI, if successful.'),
  message: z.string().describe('A message indicating the outcome of the operation.'),
  success: z.boolean().describe('Whether the operation was successful.'),
});
export type RotatePdfOutput = z.infer<typeof RotatePdfOutputSchema>;

/**
 * Parses a page number string (e.g., "1,3,5-7", "all") into an array of 0-indexed page numbers.
 * @param pageNumbersStr The string to parse.
 * @param totalPages The total number of pages in the PDF.
 * @returns An array of 0-indexed page numbers.
 * @throws Error if the page number string is invalid or out of bounds.
 */
function parsePageNumbers(pageNumbersStr: string, totalPages: number): number[] {
  const uniquePageIndices = new Set<number>();

  if (pageNumbersStr.toLowerCase() === 'all') {
    for (let i = 0; i < totalPages; i++) {
      uniquePageIndices.add(i);
    }
    return Array.from(uniquePageIndices);
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
        for (let i = start - 1; i < end; i++) {
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
      throw new Error("No valid page numbers were specified or found within the PDF's range.");
  }

  return Array.from(uniquePageIndices).sort((a,b) => a-b);
}

const rotatePdfPagesFlow = ai.defineFlow(
  {
    name: 'rotatePdfPagesFlow',
    inputSchema: RotatePdfInputSchema,
    outputSchema: RotatePdfOutputSchema,
  },
  async (input) => {
    const { pdfDataUri, pageNumbers: pageNumbersStr, rotationAngle } = input;
    try {
      const base64String = pdfDataUri.substring(pdfDataUri.indexOf(',') + 1);
      const pdfBytes = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));

      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true }); // Allow loading encrypted if no password needed
      const totalPages = pdfDoc.getPageCount();

      if (totalPages === 0) {
        return { message: 'The PDF is empty and has no pages to rotate.', success: false };
      }
      
      let targetPageIndices: number[];
      try {
        targetPageIndices = parsePageNumbers(pageNumbersStr, totalPages);
      } catch (e: any) {
        return { message: `Error parsing page numbers: ${e.message}`, success: false };
      }

      if (targetPageIndices.length === 0) {
        return { message: 'No valid pages selected for rotation.', success: false };
      }

      const angle = parseInt(rotationAngle, 10) as (90 | 180 | 270);
      let rotationType: RotationTypes;
      switch (angle) {
        case 90: rotationType = RotationTypes.Degrees90; break;
        case 180: rotationType = RotationTypes.Degrees180; break;
        case 270: rotationType = RotationTypes.Degrees270; break;
        default: return { message: 'Invalid rotation angle.', success: false };
      }

      targetPageIndices.forEach(pageIndex => {
        if (pageIndex >= 0 && pageIndex < totalPages) {
          const page = pdfDoc.getPage(pageIndex);
          // Get current rotation and add to it, ensuring it wraps around 360
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees((currentRotation + angle) % 360));
        }
      });

      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedPdfBase64 = Buffer.from(modifiedPdfBytes).toString('base64');
      
      return {
        modifiedPdfDataUri: `data:application/pdf;base64,${modifiedPdfBase64}`,
        message: `Successfully rotated ${targetPageIndices.length} page(s) by ${angle} degrees.`,
        success: true,
      };

    } catch (e: any) {
      console.error('Error rotating PDF pages:', e);
      let userMessage = 'Failed to rotate PDF pages. ';
      if (e.message && (e.message.toLowerCase().includes('password') || e.message.toLowerCase().includes('encrypted'))) {
        userMessage += 'The PDF might be encrypted and require a password not handled by this tool, or it is corrupted.';
      } else if (e.message && e.message.includes('Invalid PDF')) {
        userMessage += 'The file does not appear to be a valid PDF or is corrupted.';
      } else {
        userMessage += e.message || 'Please ensure the PDF is valid.';
      }
      return {
        message: userMessage,
        success: false,
      };
    }
  }
);

export async function rotatePdfPages(input: RotatePdfInput): Promise<RotatePdfOutput> {
  return rotatePdfPagesFlow(input);
}

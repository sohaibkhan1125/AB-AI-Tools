
'use server';
/**
 * @fileOverview Genkit flow for merging multiple PDF files into one.
 * - mergePdfs - Function that takes an array of PDF data URIs and returns a single merged PDF data URI.
 * - MergePdfsInput - Input type for the mergePdfs function.
 * - MergePdfsOutput - Output type for the mergePdfs function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { PDFDocument } from 'pdf-lib';

const MergePdfsInputSchema = z.object({
  pdfDataUris: z.array(z.string().startsWith('data:application/pdf;base64,', { message: "Each PDF must be a base64 data URI." }))
    .min(1, { message: "At least one PDF file is required."})
    .describe('An array of PDF files, each encoded as a base64 data URI.'),
});
export type MergePdfsInput = z.infer<typeof MergePdfsInputSchema>;

const MergePdfsOutputSchema = z.object({
  mergedPdfDataUri: z.string().describe('The merged PDF document as a base64 data URI.'),
});
export type MergePdfsOutput = z.infer<typeof MergePdfsOutputSchema>;

const mergePdfFlow = ai.defineFlow(
  {
    name: 'mergePdfFlow',
    inputSchema: MergePdfsInputSchema,
    outputSchema: MergePdfsOutputSchema,
  },
  async (input) => {
    const { pdfDataUris } = input;

    if (pdfDataUris.length === 0) {
      throw new Error('No PDF files provided for merging.');
    }

    const mergedPdfDoc = await PDFDocument.create();

    for (const dataUri of pdfDataUris) {
      try {
        // pdf-lib expects a Uint8Array or ArrayBuffer.
        // Extract base64 part and convert.
        const base64String = dataUri.substring(dataUri.indexOf(',') + 1);
        const pdfBytes = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
        
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdfDoc.addPage(page);
        });
      } catch (e: any) {
        console.error('Error processing one of the PDFs:', e);
        throw new Error(`Failed to process or merge one of the PDFs. Please ensure all files are valid. Details: ${e.message}`);
      }
    }

    try {
      const mergedPdfBytes = await mergedPdfDoc.save();
      const mergedPdfBase64 = Buffer.from(mergedPdfBytes).toString('base64');
      return { mergedPdfDataUri: `data:application/pdf;base64,${mergedPdfBase64}` };
    } catch (e: any) {
        console.error('Error saving merged PDF:', e);
        throw new Error(`Failed to save the merged PDF. Details: ${e.message}`);
    }
  }
);

export async function mergePdfs(input: MergePdfsInput): Promise<MergePdfsOutput> {
  return mergePdfFlow(input);
}

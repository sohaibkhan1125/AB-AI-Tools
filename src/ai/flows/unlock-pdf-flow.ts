
'use server';
/**
 * @fileOverview Genkit flow for unlocking password-protected PDF files.
 * - unlockPdf - Function that takes a PDF data URI and an optional password,
 *               and returns an unlocked PDF data URI if successful.
 * - UnlockPdfInput - Input type for the unlockPdf function.
 * - UnlockPdfOutput - Output type for the unlockPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { PDFDocument } from 'pdf-lib';

const UnlockPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .regex(/^data:application\/pdf;base64,/, { message: "PDF must be a data URI starting with 'data:application/pdf;base64,'." })
    .describe('The password-protected PDF file, encoded as a base64 data URI.'),
  password: z
    .string()
    .optional()
    .describe('The password to unlock the PDF. Leave blank if no password or to attempt without.'),
});
export type UnlockPdfInput = z.infer<typeof UnlockPdfInputSchema>;

const UnlockPdfOutputSchema = z.object({
  unlockedPdfDataUri: z.string().optional().describe('The unlocked PDF document as a base64 data URI, if successful.'),
  message: z.string().describe('A message indicating the outcome of the operation.'),
  success: z.boolean().describe('Whether the operation was successful.'),
});
export type UnlockPdfOutput = z.infer<typeof UnlockPdfOutputSchema>;

const unlockPdfFlow = ai.defineFlow(
  {
    name: 'unlockPdfFlow',
    inputSchema: UnlockPdfInputSchema,
    outputSchema: UnlockPdfOutputSchema,
  },
  async (input) => {
    const { pdfDataUri, password } = input;
    try {
      const base64String = pdfDataUri.substring(pdfDataUri.indexOf(',') + 1);
      const pdfBytes = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));

      const pdfDoc = await PDFDocument.load(pdfBytes, {
        password: password || undefined, // Pass password if provided
        ignoreEncryption: false, // We want to try and decrypt with the password
      });

      // If loading succeeded, the PDF is now decrypted in memory.
      // Save it without encryption (default behavior when saving).
      const unlockedPdfBytes = await pdfDoc.save();
      const unlockedPdfBase64 = Buffer.from(unlockedPdfBytes).toString('base64');
      
      return {
        unlockedPdfDataUri: `data:application/pdf;base64,${unlockedPdfBase64}`,
        message: 'PDF unlocked successfully. Restrictions (if any based on password) should be removed.',
        success: true,
      };

    } catch (e: any) {
      console.error('Error unlocking PDF:', e);
      let userMessage = 'Failed to unlock PDF. ';
      // pdf-lib typically throws specific error types or messages for password issues.
      if (e.constructor && e.constructor.name === 'InvalidPasswordError') {
        userMessage += 'The password provided was incorrect.';
      } else if (e.message && (e.message.toLowerCase().includes('password') || e.message.toLowerCase().includes('encrypted'))) {
        userMessage += 'This might be due to an incorrect password, or the PDF is not password-protected in a way this tool can handle, or it is corrupted.';
      } else if (e.message && e.message.includes('Invalid PDF')) {
        userMessage += 'The file does not appear to be a valid PDF or is corrupted.';
      } else {
        userMessage += 'Please ensure the PDF is valid and the password (if any) is correct. This tool cannot crack unknown passwords or remove all types of restrictions.';
      }
      return {
        message: userMessage,
        success: false,
      };
    }
  }
);

export async function unlockPdf(input: UnlockPdfInput): Promise<UnlockPdfOutput> {
  return unlockPdfFlow(input);
}

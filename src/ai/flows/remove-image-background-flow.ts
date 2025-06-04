
'use server';
/**
 * @fileOverview Genkit flow for removing the background from an image using AI.
 * - removeImageBackground - Function that takes an image data URI and returns a processed image data URI.
 * - RemoveImageBackgroundInput - Input type for the function.
 * - RemoveImageBackgroundOutput - Output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RemoveImageBackgroundInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The image (e.g., JPG, PNG) as a data URI. Expected format: 'data:image/<mimetype>;base64,<encoded_data>'."
    ),
});
export type RemoveImageBackgroundInput = z.infer<typeof RemoveImageBackgroundInputSchema>;

const RemoveImageBackgroundOutputSchema = z.object({
  processedImageDataUri: z.string().describe('The processed image with background removed as a base64 data URI (intended as PNG with transparency).'),
  originalPrompt: z.string().describe('The prompt used for the AI model.'),
});
export type RemoveImageBackgroundOutput = z.infer<typeof RemoveImageBackgroundOutputSchema>;

const removeImageBackgroundFlow = ai.defineFlow(
  {
    name: 'removeImageBackgroundFlow',
    inputSchema: RemoveImageBackgroundInputSchema,
    outputSchema: RemoveImageBackgroundOutputSchema,
  },
  async (input) => {
    const { imageDataUri } = input;

    const processingPrompt = "Analyze the provided image. Identify the main subject(s) and completely remove the background, replacing it with transparency. The output must be a PNG image with a valid alpha channel representing the transparency. Preserve all details of the main subject(s).";

    try {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp', // Model specified for image generation/editing
        prompt: [
          { media: { url: imageDataUri } },
          { text: processingPrompt },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // Must provide both
        },
      });

      if (!media || !media.url) {
        throw new Error('AI image processing failed to produce an image URL.');
      }
      
      return { processedImageDataUri: media.url, originalPrompt: processingPrompt };

    } catch (error: any) {
      console.error('Error in removeImageBackgroundFlow:', error);
      if (error.message && (error.message.toLowerCase().includes('filtered') || error.message.toLowerCase().includes('safety'))) {
        throw new Error('Image processing for background removal was blocked due to safety filters. Please try a different image.');
      }
      throw new Error(error.message || 'Failed to process image for background removal due to an unexpected error.');
    }
  }
);

export async function removeImageBackground(input: RemoveImageBackgroundInput): Promise<RemoveImageBackgroundOutput> {
  return removeImageBackgroundFlow(input);
}

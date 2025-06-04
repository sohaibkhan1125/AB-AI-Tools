
'use server';
/**
 * @fileOverview Genkit flow for attempting to upscale an image using AI.
 * - upscaleImage - Function that takes an image data URI and returns a processed image data URI.
 * - UpscaleImageInput - Input type for the function.
 * - UpscaleImageOutput - Output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const UpscaleImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The image (e.g., JPG, PNG) as a data URI. Expected format: 'data:image/<mimetype>;base64,<encoded_data>'."
    ),
});
export type UpscaleImageInput = z.infer<typeof UpscaleImageInputSchema>;

const UpscaleImageOutputSchema = z.object({
  processedImageDataUri: z.string().describe('The processed (attempted upscaled) image as a base64 data URI.'),
  promptUsed: z.string().describe('The prompt used for the AI model.'),
});
export type UpscaleImageOutput = z.infer<typeof UpscaleImageOutputSchema>;

const upscaleImageFlow = ai.defineFlow(
  {
    name: 'upscaleImageFlow',
    inputSchema: UpscaleImageInputSchema,
    outputSchema: UpscaleImageOutputSchema,
  },
  async (input) => {
    const { imageDataUri } = input;

    const processingPrompt = "Analyze the provided image. Your task is to upscale this image, making it larger while attempting to intelligently enhance details, improve sharpness, and maintain overall visual quality. The goal is a higher-resolution version of the original. Output the resulting image.";

    try {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp', // Model specified for image generation/editing
        prompt: [
          { media: { url: imageDataUri } },
          { text: processingPrompt },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // Must provide both
          // Optional: Add safetySettings if needed
        },
      });

      if (!media || !media.url) {
        throw new Error('AI image upscaling failed to produce an image URL.');
      }
      
      return { processedImageDataUri: media.url, promptUsed: processingPrompt };

    } catch (error: any) {
      console.error('Error in upscaleImageFlow:', error);
      if (error.message && (error.message.toLowerCase().includes('filtered') || error.message.toLowerCase().includes('safety'))) {
        throw new Error('Image upscaling attempt was blocked due to safety filters. Please try a different image.');
      }
      throw new Error(error.message || 'Failed to process image for upscaling due to an unexpected error.');
    }
  }
);

export async function upscaleImage(input: UpscaleImageInput): Promise<UpscaleImageOutput> {
  return upscaleImageFlow(input);
}

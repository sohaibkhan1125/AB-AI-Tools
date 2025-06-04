'use server';
/**
 * @fileOverview Genkit flow for generating images from text prompts.
 * - generateImage - Function that takes a text prompt and returns an image data URI.
 * - GenerateImageInput - Input type for the generateImage function.
 * - GenerateImageOutput - Output type for the generateImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt cannot be empty." }).max(500, { message: "Prompt is too long (max 500 characters)." })
    .describe('The text prompt to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a base64 data URI.'),
  promptUsed: z.string().describe('The prompt that was used for generation.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const { prompt } = input;

    try {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp', // IMPORTANT: Specific model for image generation
        prompt: prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE
          // Optional: Add safetySettings if needed, for example:
          // safetySettings: [
          //   { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          //   { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          //   { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          //   { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          // ],
        },
      });

      if (!media || !media.url) {
        throw new Error('Image generation failed to produce an image URL.');
      }
      
      return { imageDataUri: media.url, promptUsed: prompt };

    } catch (error: any) {
      console.error('Error generating image in flow:', error);
      if (error.message && (error.message.toLowerCase().includes('filtered') || error.message.toLowerCase().includes('safety'))) {
        throw new Error('Image generation failed due to safety filters. Please try a different prompt.');
      }
      throw new Error(error.message || 'Failed to generate image due to an unexpected error.');
    }
  }
);

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}


'use server';
/**
 * @fileOverview Genkit flow for converting text to speech with a specified tone.
 * - textToVoiceWithTone - Function that takes text and a tone, and returns an audio data URI.
 * - TextToVoiceInput - Input type for the function.
 * - TextToVoiceOutput - Output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TextToVoiceInputSchema = z.object({
  textToSpeak: z.string()
    .min(1, { message: "Text to speak cannot be empty." })
    .max(1000, { message: "Text is too long (max 1000 characters)." })
    .describe('The text content to be converted to speech.'),
  desiredTone: z.string()
    .min(1, { message: "Desired tone cannot be empty."})
    .describe('The desired tone for the voice (e.g., Happy, Sad, Professional).'),
});
export type TextToVoiceInput = z.infer<typeof TextToVoiceInputSchema>;

const TextToVoiceOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a base64 data URI.'),
  promptUsed: z.string().describe('The full prompt used for generation.'),
});
export type TextToVoiceOutput = z.infer<typeof TextToVoiceOutputSchema>;

const textToVoiceWithToneFlow = ai.defineFlow(
  {
    name: 'textToVoiceWithToneFlow',
    inputSchema: TextToVoiceInputSchema,
    outputSchema: TextToVoiceOutputSchema,
  },
  async (input) => {
    const { textToSpeak, desiredTone } = input;

    // Construct the prompt carefully
    const fullPrompt = `You are an expert voice synthesis AI. Your primary task is to read the following text aloud in a ${desiredTone} voice. 
The output should ONLY be the audio file of the speech. 
Do not include any introductory text, concluding remarks, or any other commentary in your response.
Strictly output only the audio.
Text to read: "${textToSpeak}"`;

    try {
      const { media, text } = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest', // Using a model known for multimodal capabilities
        prompt: fullPrompt,
        config: {
          // It's safer to expect both and pick the audio if available.
          // If 'AUDIO' only mode caused issues or returned text, this handles it.
          responseModalities: ['TEXT', 'AUDIO'],
        },
      });
      
      if (media && media.url) {
        // media.url should be the audio data URI (e.g., "data:audio/mpeg;base64,...")
        return { audioDataUri: media.url, promptUsed: fullPrompt };
      } else if (text) {
        // This case is if the model unexpectedly returns text instead of audio.
        // Log this for debugging.
        console.warn("Audio generation returned text instead of media. Text:", text);
        throw new Error('Audio generation failed: AI returned text instead of an audio file. Please try a simpler prompt or text.');
      } else {
        throw new Error('Audio generation failed to produce an audio URL or any output.');
      }

    } catch (error: any) {
      console.error('Error in textToVoiceWithToneFlow:', error);
      if (error.message && (error.message.toLowerCase().includes('filtered') || error.message.toLowerCase().includes('safety'))) {
        throw new Error('Audio generation failed due to safety filters. Please try different text or tone.');
      }
      throw new Error(error.message || 'Failed to generate audio due to an unexpected error.');
    }
  }
);

export async function textToVoiceWithTone(input: TextToVoiceInput): Promise<TextToVoiceOutput> {
  return textToVoiceWithToneFlow(input);
}

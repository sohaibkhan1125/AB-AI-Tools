
'use server';
/**
 * @fileOverview Genkit flow for transcribing audio to text.
 *
 * - transcribeAudio - A function that takes audio data and returns transcribed text.
 * - TranscribeAudioInput - The input type for the transcribeAudio function.
 * - TranscribeAudioOutput - The return type for the transcribeAudio function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const TranscribeAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio data as a data URI. Expected format: 'data:audio/<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

export const TranscribeAudioOutputSchema = z.object({
  transcript: z.string().describe('The transcribed text from the audio.'),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;

// Define the prompt for audio transcription
const transcribePrompt = ai.definePrompt({
  name: 'transcribeAudioPrompt',
  input: { schema: TranscribeAudioInputSchema },
  output: { schema: TranscribeAudioOutputSchema },
  prompt: `Your task is to transcribe the provided audio recording into text. 
Be as accurate as possible. Only return the transcribed text.
Audio input: {{media url=audioDataUri}}`,
  // Consider specifying a model known for good ASR if the default isn't optimal.
  // model: 'googleai/gemini-1.5-flash-latest', // Example
  // config: { temperature: 0.1 } // Lower temperature for more deterministic transcription
});

// Define the Genkit flow
const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input) => {
    const { output } = await transcribePrompt(input);
    if (!output) {
      throw new Error('Transcription failed to produce output.');
    }
    return output;
  }
);

// Exported wrapper function to be called from the client
export async function transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioOutput> {
  return transcribeAudioFlow(input);
}

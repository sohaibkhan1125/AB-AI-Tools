
'use server';
/**
 * @fileOverview Genkit flow for detecting if text is AI-generated.
 * - detectAiText - Function that analyzes text and estimates AI authorship.
 * - AiDetectorInput - Input type for the detectAiText function.
 * - AiDetectorOutput - Output type for the detectAiText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const AiDetectorInputSchema = z.object({
  inputText: z.string()
    .min(50, { message: "Text must be at least 50 characters for meaningful analysis." })
    .max(5000, { message: "Text is too long (max 5000 characters)." })
    .describe('The text content to be analyzed for AI authorship.'),
});
export type AiDetectorInput = z.infer<typeof AiDetectorInputSchema>;

export const AiDetectorOutputSchema = z.object({
  assessmentCategory: z.enum([
      "Highly Likely AI-Generated", 
      "Possibly AI-Generated", 
      "Uncertain", 
      "Possibly Human-Written", 
      "Highly Likely Human-Written"
    ]).describe('The AI model\'s categorized assessment of the text\'s origin.'),
  assessmentReasoning: z.string().describe('A brief explanation for the assessment, highlighting observed patterns or stylistic cues.'),
  originalText: z.string().describe('The original input text for reference.'),
});
export type AiDetectorOutput = z.infer<typeof AiDetectorOutputSchema>;

const aiDetectorPrompt = ai.definePrompt({
  name: 'aiDetectorPrompt',
  input: { schema: AiDetectorInputSchema },
  output: { schema: AiDetectorOutputSchema.omit({ originalText: true }) }, // AI doesn't need to output originalText
  prompt: `You are an AI Text Analyzer. Your task is to evaluate the provided text and determine the likelihood that it was written by an AI language model or by a human.

Consider factors such as:
- Fluency and coherence
- Presence of overly generic phrasing or clichés often seen in AI text
- Repetitiveness or lack of deep nuanced understanding
- Unusual sentence structures or word choices
- Overall "naturalness" of the language
- Predictability or lack of distinctive voice

Based on your analysis of the text below, please provide:
1. An overall assessment category.
2. A brief reasoning for your assessment (1-3 sentences).

Text to analyze:
{{{inputText}}}

Output Format Instructions:
Respond with a JSON object matching the following schema.
The 'assessmentCategory' must be one of: "Highly Likely AI-Generated", "Possibly AI-Generated", "Uncertain", "Possibly Human-Written", "Highly Likely Human-Written".
The 'assessmentReasoning' should be a concise explanation.
`,
  config: {
    temperature: 0.3, // Lower temperature for more deterministic/analytical output
  },
});

const aiDetectorFlow = ai.defineFlow(
  {
    name: 'aiDetectorFlow',
    inputSchema: AiDetectorInputSchema,
    outputSchema: AiDetectorOutputSchema,
  },
  async (input) => {
    const { output } = await aiDetectorPrompt(input);
    if (!output) {
      throw new Error('AI text detection failed to produce output.');
    }
    return { 
      ...output,
      originalText: input.inputText 
    };
  }
);

export async function detectAiText(input: AiDetectorInput): Promise<AiDetectorOutput> {
  return aiDetectorFlow(input);
}


'use server';
/**
 * @fileOverview Genkit flow for converting JSON text to XML text using AI assistance.
 * - convertJsonToXml - Function that takes JSON text and returns XML text.
 * - JsonToXmlInput - Input type for the convertJsonToXml function.
 * - JsonToXmlOutput - Output type for the convertJsonToXml function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const JsonToXmlInputSchema = z.object({
  jsonText: z.string().describe('The JSON content as a string.'),
});
export type JsonToXmlInput = z.infer<typeof JsonToXmlInputSchema>;

const JsonToXmlOutputSchema = z.object({
  xmlText: z.string().describe('The converted XML content as a string, or an error message.'),
  success: z.boolean().describe('Indicates if the conversion was successful.'),
  message: z.string().optional().describe('Optional message, e.g., for errors.'),
});
export type JsonToXmlOutput = z.infer<typeof JsonToXmlOutputSchema>;

const jsonToXmlGenPrompt = ai.definePrompt({
  name: 'jsonToXmlGenPrompt',
  input: { schema: JsonToXmlInputSchema }, // AI will receive the JSON string directly
  output: { schema: z.object({ xmlString: z.string() }) }, // AI should output just the XML string
  prompt: `You are an expert data format converter. Your task is to convert the given JSON string into a well-formed XML string.
Represent JSON arrays as a sequence of repeated XML elements. If array elements are objects, use the object keys as tag names where appropriate. If array elements are primitive values or the array is nested under a numeric key, use a generic tag name like 'item' or a name derived from the parent key if it makes sense (e.g., if the array is keyed as 'products', use 'product' for items).
JSON object keys should generally become XML tag names. Ensure valid XML tag names (e.g., no spaces, start with a letter or underscore).
Handle boolean and null values appropriately (e.g., as text content 'true', 'false', or an empty tag for null, or use attributes if it seems semantically correct for the structure).
The primary goal is a human-readable and structurally representative XML. Avoid excessive use of attributes unless the JSON structure clearly implies them.
Your entire output should be ONLY the XML string. Do NOT include any other text, explanations, or markdown formatting like \`\`\`xml ... \`\`\`.

JSON Input:
{{{jsonText}}}
`,
  config: {
    temperature: 0.1, // Lower temperature for more deterministic data transformation
  },
});

const jsonToXmlFlow = ai.defineFlow(
  {
    name: 'jsonToXmlFlow',
    inputSchema: JsonToXmlInputSchema,
    outputSchema: JsonToXmlOutputSchema,
  },
  async (input) => {
    try {
      // Validate JSON input first
      JSON.parse(input.jsonText);
    } catch (e: any) {
      console.error("Invalid JSON input:", e);
      return {
        xmlText: `Invalid JSON input: ${e.message}`,
        success: false,
        message: `Invalid JSON input: ${e.message}`,
      };
    }

    try {
      const { output } = await jsonToXmlGenPrompt({ jsonText: input.jsonText });
      if (!output || !output.xmlString) {
        return {
          xmlText: 'AI model did not return valid XML output.',
          success: false,
          message: 'AI model did not return valid XML output.',
        };
      }
      // Basic check: does it look like XML?
      if (!output.xmlString.trim().startsWith('<') || !output.xmlString.trim().endsWith('>')) {
         return {
          xmlText: 'AI did not return well-formed XML. It might have returned an explanation instead.',
          success: false,
          message: `AI output does not appear to be XML: ${output.xmlString.substring(0,100)}...`,
        };
      }

      return { xmlText: output.xmlString.trim(), success: true };
    } catch (e: any) {
      console.error("JSON to XML conversion error in AI flow:", e);
      return {
        xmlText: `AI Conversion failed: ${e.message || 'Unknown error during AI processing.'}`,
        success: false,
        message: `AI Conversion failed: ${e.message || 'Unknown error during AI processing.'}`,
      };
    }
  }
);

export async function convertJsonToXml(input: JsonToXmlInput): Promise<JsonToXmlOutput> {
  return jsonToXmlFlow(input);
}

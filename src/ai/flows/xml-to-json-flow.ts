
'use server';
/**
 * @fileOverview Genkit flow for converting XML text to JSON text using AI assistance.
 * - convertXmlToJson - Function that takes XML text and returns JSON text.
 * - XmlToJsonInput - Input type for the convertXmlToJson function.
 * - XmlToJsonOutput - Output type for the convertXmlToJson function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const XmlToJsonInputSchema = z.object({
  xmlText: z.string().describe('The XML content as a string.'),
});
export type XmlToJsonInput = z.infer<typeof XmlToJsonInputSchema>;

const XmlToJsonOutputSchema = z.object({
  jsonText: z.string().describe('The converted JSON content as a string, or an error message.'),
  success: z.boolean().describe('Indicates if the conversion was successful.'),
  message: z.string().optional().describe('Optional message, e.g., for errors.'),
});
export type XmlToJsonOutput = z.infer<typeof XmlToJsonOutputSchema>;

const xmlToJsonGenPrompt = ai.definePrompt({
  name: 'xmlToJsonGenPrompt',
  input: { schema: XmlToJsonInputSchema },
  output: { schema: z.object({ jsonString: z.string() }) },
  prompt: `You are an expert data format converter. Your task is to convert the given XML string into a well-formed JSON string.
Follow these conventions for XML to JSON conversion:
1.  XML elements should generally become JSON object keys.
2.  Text content of an XML element should become the value for its corresponding JSON key.
3.  XML attributes can be handled by prefixing them (e.g., with "@") or by placing them in a special sub-object under the element's key. For simplicity, you can try to represent attributes as regular keys if it makes sense, or use a common convention like "@attributeName".
4.  Repeating XML elements under the same parent should be represented as a JSON array.
5.  If an element has both attributes and text content, or child elements, represent it as a JSON object. The text content could be under a specific key like "#text" or "value".
6.  Strive for a JSON structure that is a natural representation of the XML data. Ensure the output is valid JSON.
7.  Your entire output should be ONLY the JSON string. Do NOT include any other text, explanations, or markdown formatting like \`\`\`json ... \`\`\`.

XML Input:
{{{xmlText}}}
`,
  config: {
    temperature: 0.1, // Lower temperature for more deterministic data transformation
  },
});

const xmlToJsonFlow = ai.defineFlow(
  {
    name: 'xmlToJsonFlow',
    inputSchema: XmlToJsonInputSchema,
    outputSchema: XmlToJsonOutputSchema,
  },
  async (input) => {
    if (!input.xmlText.trim()) {
      return {
        jsonText: 'Input XML text is empty.',
        success: false,
        message: 'Input XML text is empty.',
      };
    }
    
    // Basic check: does it look like XML? (This is not a validator)
    if (!input.xmlText.trim().startsWith('<') || !input.xmlText.trim().endsWith('>')) {
        return {
            jsonText: 'Input does not appear to be valid XML.',
            success: false,
            message: 'Input does not appear to be valid XML. It should start with < and end with >.',
        };
    }

    try {
      const { output } = await xmlToJsonGenPrompt({ xmlText: input.xmlText });
      if (!output || !output.jsonString) {
        return {
          jsonText: 'AI model did not return valid JSON output.',
          success: false,
          message: 'AI model did not return valid JSON output.',
        };
      }

      // Validate if the AI output is actually JSON
      try {
        JSON.parse(output.jsonString);
        return { jsonText: output.jsonString.trim(), success: true };
      } catch (parseError) {
        console.error("AI output is not valid JSON:", parseError);
        return {
          jsonText: 'AI returned text that is not valid JSON.',
          success: false,
          message: `AI output could not be parsed as JSON: ${output.jsonString.substring(0, 100)}...`,
        };
      }
    } catch (e: any) {
      console.error("XML to JSON conversion error in AI flow:", e);
      return {
        jsonText: `AI Conversion failed: ${e.message || 'Unknown error during AI processing.'}`,
        success: false,
        message: `AI Conversion failed: ${e.message || 'Unknown error during AI processing.'}`,
      };
    }
  }
);

export async function convertXmlToJson(input: XmlToJsonInput): Promise<XmlToJsonOutput> {
  return xmlToJsonFlow(input);
}
